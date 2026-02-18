# 3d-whell-parallax-carousel

Smooth 3D parallax carousel with trapezoid perspective effect. Shows 5 cards at once — center card flat, side cards angled like a fan. Works with **Vanilla JS**, **React**, and **Vue 3**.

## Install

```bash
npm install 3d-whell-parallax-carousel
```

---

## Usage

### Vanilla JS

```js
import { ParallaxCarousel } from "3d-whell-parallax-carousel";

const carousel = new ParallaxCarousel("#my-container", [
  '<div style="color:white">Card 1</div>',
  '<div style="color:white">Card 2</div>',
  '<div style="color:white">Card 3</div>',
  '<div style="color:white">Card 4</div>',
  '<div style="color:white">Card 5</div>',
]);
```

### React

```jsx
import { ParallaxCarouselReact } from "3d-whell-parallax-carousel/react";

const items = ["<div>Card 1</div>", "<div>Card 2</div>", "<div>Card 3</div>"];

function App() {
  const ref = useRef(null);

  return (
    <>
      <ParallaxCarouselReact
        ref={ref}
        items={items}
        options={{ autoplay: true, interval: 3000 }}
        onChange={({ index }) => console.log("Slide:", index)}
      />
      <button onClick={() => ref.current.next()}>Next</button>
    </>
  );
}
```

### Vue 3

```vue
<template>
  <ParallaxCarousel
    ref="carousel"
    :items="items"
    :options="{ autoplay: true, interval: 3000 }"
    @change="onSlideChange"
  />
  <button @click="$refs.carousel.next()">Next</button>
</template>

<script setup>
import { ParallaxCarouselVue as ParallaxCarousel } from "3d-whell-parallax-carousel/vue";

const items = ["<div>Card 1</div>", "<div>Card 2</div>", "<div>Card 3</div>"];
const onSlideChange = ({ index, total }) => console.log(index, total);
</script>
```

---

## Options

| Option         | Type    | Default                       | Description                  |
| -------------- | ------- | ----------------------------- | ---------------------------- |
| `autoplay`     | boolean | `true`                        | Enable auto-advance          |
| `interval`     | number  | `2800`                        | Autoplay interval in ms      |
| `pauseOnHover` | boolean | `true`                        | Pause autoplay on hover      |
| `duration`     | number  | `650`                         | Transition duration in ms    |
| `easing`       | string  | `'cubic-bezier(0.4,0,0.2,1)'` | CSS easing                   |
| `background`   | string  | `'#111111'`                   | Card background color        |
| `borderColor`  | string  | `'rgba(255,255,255,0.1)'`     | Card border color            |
| `borderWidth`  | string  | `'1.5px'`                     | Card border width            |
| `borderRadius` | string  | `'4px'`                       | Card border radius           |
| `stageHeight`  | string  | `'420px'`                     | Height of the carousel stage |
| `perspective`  | number  | `900`                         | CSS perspective value in px  |
| `showGrid`     | boolean | `true`                        | Show background grid         |
| `gridColor`    | string  | `'rgba(255,255,255,0.032)'`   | Grid line color              |
| `gridSize`     | string  | `'38px'`                      | Grid cell size               |
| `slots`        | object  | see below                     | Per-slot position config     |

### `slots` config

Customize each of the 5 visible positions (`-2` to `+2`):

```js
slots: {
  '-2': { x: -490, w: 220, h: 330, ry:  50, origin: 'right center',  z: 1, op: 1 },
  '-1': { x: -255, w: 192, h: 295, ry:  26, origin: 'right center',  z: 2, op: 1 },
   '0': { x:    0, w: 188, h: 275, ry:   0, origin: 'center center', z: 3, op: 1 },
   '1': { x:  255, w: 192, h: 295, ry: -26, origin: 'left center',   z: 2, op: 1 },
   '2': { x:  490, w: 220, h: 330, ry: -50, origin: 'left center',   z: 1, op: 1 },
}
```

| Field    | Description                         |
| -------- | ----------------------------------- |
| `x`      | Horizontal offset from center in px |
| `w`      | Card width in px                    |
| `h`      | Card height in px                   |
| `ry`     | rotateY angle in degrees            |
| `origin` | CSS transform-origin                |
| `z`      | z-index                             |
| `op`     | opacity (0–1)                       |

---

## API

```js
carousel.next(); // Go to next slide
carousel.prev(); // Go to previous slide
carousel.goTo(index); // Jump to specific index
carousel.updateOptions({
  // Update options at runtime
  interval: 5000,
  background: "#222",
});
carousel.destroy(); // Clean up and remove from DOM
```

## Events

```js
container.addEventListener("change", (e) => {
  console.log(e.detail.index); // current index
  console.log(e.detail.total); // total items
});
```

---

## Build from source

```bash
npm install
npm run build
```

Output goes to `dist/`.

---

## License

MIT
