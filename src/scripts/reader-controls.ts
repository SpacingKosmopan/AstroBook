// * SPIS TREŚCI * //

// table of contents
const openButton = document.querySelector<HTMLButtonElement>("#toc-open");
const closeButton = document.querySelector<HTMLButtonElement>("#toc-close");
const backdrop = document.querySelector<HTMLElement>("#toc-backdrop");

function openToc() {
  if (!backdrop || !openButton) return;

  backdrop.hidden = false;
  openButton.setAttribute("aria-expanded", "true");
  closeButton?.focus();
}

function closeToc() {
  if (!backdrop || !openButton) return;

  backdrop.hidden = true;
  openButton.setAttribute("aria-expanded", "false");
  openButton.focus();
}

openButton?.addEventListener("click", openToc);
closeButton?.addEventListener("click", closeToc);

backdrop?.addEventListener("click", (event) => {
  if (event.target === backdrop) {
    closeToc();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && backdrop && !backdrop.hidden) {
    closeToc();
  }
});

/* * ZOOM + DRAG * */

const readerViewport = document.querySelector<HTMLElement>("#reader-viewport");
const spread = document.querySelector<HTMLElement>(".book-spread");
const canvas = document.querySelector<HTMLElement>(".book-canvas");
const zoomValue = document.querySelector<HTMLOutputElement>("#zoom-value");
const zoomIn = document.querySelector<HTMLButtonElement>("#zoom-in");
const zoomOut = document.querySelector<HTMLButtonElement>("#zoom-out");
const zoomReset = document.querySelector<HTMLButtonElement>("#zoom-reset");

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const SCALE_STEP = 1.2;

const BASE_WIDTH = 1200;

let scale = 1;
let fitMode = true;

let isDragging = false;
let pointerStartX = 0;
let pointerStartY = 0;
let scrollStartX = 0;
let scrollStartY = 0;

function getAvailableWidth(): number {
  if (!readerViewport) return BASE_WIDTH;

  return Math.max(1, readerViewport.clientWidth - 8);
}

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function updateZoomLabel(): void {
  if (!zoomValue) return;

  zoomValue.value = `${Math.round(scale * 100)}%`;
}

function updatePageLinksZoom(): void {
  const zoom = String(Math.round(scale * 100));

  const links = document.querySelectorAll<HTMLAnchorElement>(
    ".page-navigation a[href], .reader-toc-list a[href]",
  );

  links.forEach((link) => {
    const url = new URL(link.href, window.location.href);

    url.searchParams.set("zoom", zoom);

    link.href = `${url.pathname}${url.search}${url.hash}`;
  });
}

function applyZoom(): void {
  if (!spread || !canvas) return;

  scale = clampScale(scale);

  const baseWidth = spread.offsetWidth;
  const baseHeight = spread.offsetHeight;

  spread.style.transform = `scale(${scale})`;

  canvas.style.width = `${baseWidth * scale}px`;
  canvas.style.height = `${baseHeight * scale}px`;

  updateZoomLabel();

  updatePageLinksZoom();
}

function fitSpread(): void {
  if (!spread || !canvas) return;

  fitMode = true;

  const baseWidth = spread.offsetWidth;

  if (baseWidth <= 0) return;

  scale = clampScale(getAvailableWidth() / baseWidth);

  applyZoom();

  if (readerViewport) {
    readerViewport.scrollLeft = 0;
    readerViewport.scrollTop = 0;
  }
}

function changeZoom(factor: number): void {
  if (!spread || !canvas) return;

  fitMode = false;

  const oldScale = scale;
  const newScale = clampScale(oldScale * factor);

  if (newScale === oldScale) return;

  if (readerViewport) {
    const centerX =
      (readerViewport.scrollLeft + readerViewport.clientWidth / 2) / oldScale;

    const centerY =
      (readerViewport.scrollTop + readerViewport.clientHeight / 2) / oldScale;

    scale = newScale;
    applyZoom();

    readerViewport.scrollLeft =
      centerX * scale - readerViewport.clientWidth / 2;

    readerViewport.scrollTop =
      centerY * scale - readerViewport.clientHeight / 2;
  } else {
    scale = newScale;
    applyZoom();
  }
}

zoomIn?.addEventListener("click", () => {
  changeZoom(SCALE_STEP);
});

zoomOut?.addEventListener("click", () => {
  changeZoom(1 / SCALE_STEP);
});

zoomReset?.addEventListener("click", () => {
  fitSpread();
});

/* * DRAGGIN / PAN * */
if (readerViewport) {
  readerViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    const target = event.target;

    if (
      target instanceof Element &&
      target.closest("a, button, input, textarea, select")
    ) {
      return;
    }

    isDragging = true;

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;

    scrollStartX = readerViewport.scrollLeft;
    scrollStartY = readerViewport.scrollTop;

    readerViewport.classList.add("is-dragging");
    readerViewport.setPointerCapture(event.pointerId);
  });

  readerViewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    readerViewport.scrollLeft = scrollStartX - (event.clientX - pointerStartX);

    readerViewport.scrollTop = scrollStartY - (event.clientY - pointerStartY);
  });

  function stopDragging(): void {
    isDragging = false;
    readerViewport?.classList.remove("is-dragging");
  }

  readerViewport.addEventListener("pointerup", stopDragging);
  readerViewport.addEventListener("pointercancel", stopDragging);
  readerViewport.addEventListener("lostpointercapture", stopDragging);
}

/* * RESIZE * */

let resizeFrame = 0;

window.addEventListener("resize", () => {
  if (!fitMode || resizeFrame) return;

  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = 0;
    fitSpread();
  });
});

/* * START * */

const params = new URLSearchParams(window.location.search);
const zoomParam = Number(params.get("zoom"));

const hasValidZoom =
  params.has("zoom") && Number.isFinite(zoomParam) && zoomParam > 0;

requestAnimationFrame(() => {
  if (hasValidZoom) {
    scale = clampScale(zoomParam / 100);
    fitMode = false;
    applyZoom();
  } else {
    fitSpread();
  }
});

/* * SAVE * */

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest<HTMLAnchorElement>(
    ".page-navigation a[href], .side-navigation a[href], .reader-toc-list a[href]",
  );

  if (!link || event.defaultPrevented) return;
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  if (link.target && link.target !== "_self") return;

  const url = new URL(link.href, window.location.href);

  if (url.origin !== window.location.origin) return;
  if (!url.pathname.startsWith("/books/")) return;

  url.searchParams.set("zoom", String(Math.round(scale * 100)));

  event.preventDefault();
  window.location.assign(url.href);
});

/* * FULLSCREEN * */
const fullscreenButton =
  document.querySelector<HTMLButtonElement>("#reader-fullscreen");

function updateFullscreenButton(): void {
  if (!fullscreenButton) return;

  const isFullscreen = document.fullscreenElement !== null;

  fullscreenButton.textContent = isFullscreen
    ? "✕ Wyjdź z pełnego ekranu"
    : "⛶ Pełny ekran";

  fullscreenButton.setAttribute(
    "aria-label",
    isFullscreen ? "Wyjdź z pełnego ekranu" : "Włącz pełny ekran",
  );
}

fullscreenButton?.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.error("Nie udało się zmienić trybu pełnoekranowego:", error);
  }
});

document.addEventListener("fullscreenchange", updateFullscreenButton);

updateFullscreenButton();
