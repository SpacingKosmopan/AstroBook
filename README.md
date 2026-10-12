# Stylowanie podręcznika - użyteczne klasy

## Strona rozdziału

## Bloki

`<div class="textbook"></div>` - .textbook sam z siebie nic nie robi. Potrzebuje jeszcze klasę helperową

### Definicja

`class="definition"`

![definition box](./common_images/definition_box.png)

```html
<div class="textbook-box definition">
  <p class="box-label">DEFINICJA</p>
  <p>
    <strong>Protogwiazda</strong> — obiekt powstający podczas grawitacyjnego
    zapadania się obłoku materii, zanim rozpocznie się stabilne spalanie wodoru
    w jądrze.
  </p>
</div>
```

### Ciekawostka

`class="curiosity"`

![curiosity box](./common_images/curiosity_box.png)

```html
<div class="textbook-box curiosity">
  <p class="box-label">✦ CZY WIESZ, ŻE…?</p>
  <p>Światło Słońca dociera do Ziemi w około 8 minut i 20 sekund.</p>
</div>
```

### Zapamiętaj

`class="remember"`

![curiosity box](./common_images/remember_box.png)

```html
<div class="textbook-box remember">
  <p class="box-label">ZAPAMIĘTAJ</p>
  <p>
    Masa gwiazdy ma zasadniczy wpływ na jej ewolucję i sposób zakończenia życia.
  </p>
</div>
```

### Przykład

`class="example"`

![curiosity box](./common_images/example_box.png)

```html
<div class="textbook-box example">
  <p class="box-label">PRZYKŁAD OBLICZENIOWY</p>
  <p><strong>Dane:</strong> odległość do gwiazdy wynosi 4 lata świetlne.</p>
  <p><strong>Szukane:</strong> odległość w kilometrach.</p>
  <p><strong>Wzór:</strong> s = c · t</p>
  <p><strong>Wynik:</strong> około 3,78 · 10¹³ km.</p>
</div>
```
