# 3d-whell-parallax-carousel

Smooth 3D parallax carousel with trapezoid perspective effect. Shows 5 cards at once — center card flat, side cards angled like a fan. Works with **Vanilla JS**, **React**, **Vue 3**, and **TypeScript**.

## Install

```bash
npm install 3d-whell-parallax-carousel
```

---

## Live Demo

- **React + TypeScript Example**: https://lqnjk3.csb.app/
- **Source Code**: [`example/app.tsx`](./example/app.tsx)

---

## Usage

### Vanilla JS

```js
import { ParallaxCarousel } from "3d-whell-parallax-carousel";

const carousel = new ParallaxCarousel("#my-container", [
  '<div style="color:white">Card 1</div>',
  '<div style="color:white">Card 2</div>',
  '<div style="color:white">Card 3</div>',
]);
```

### With renderItem callback (HTML string)

```js
import { ParallaxCarousel } from "3d-whell-parallax-carousel";

const products = [
  { id: 1, name: "Product 1", image: "/img1.jpg" },
  { id: 2, name: "Product 2", image: "/img2.jpg" },
];

const carousel = new ParallaxCarousel("#my-container", products, {
  renderItem: ({ item, index }) => `
    <div style="text-align: center; padding: 20px;">
      <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 4px;" />
      <h3 style="margin-top: 10px; color: white;">${item.name}</h3>
    </div>
  `,
});
```

### TypeScript

```ts
import { ParallaxCarousel, type ParallaxCarouselOptions } from "3d-whell-parallax-carousel";

interface Product {
  id: number;
  name: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Product 1", image: "/img1.jpg" },
  { id: 2, name: "Product 2", image: "/img2.jpg" },
];

const options: ParallaxCarouselOptions<Product> = {
  autoplay: true,
  renderItem: ({ item }) => `
    <div>
      <img src="${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
    </div>
  `,
};

const carousel = new ParallaxCarousel<Product>("#my-container", products, options);
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

### React with renderItem (JSX Component)

```jsx
import { ParallaxCarouselReact } from "3d-whell-parallax-carousel/react";

const products = [
  { id: 1, name: "Product 1", image: "/img1.jpg" },
  { id: 2, name: "Product 2", image: "/img2.jpg" },
];

// Your custom React component
function ProductCard({ product, index }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '4px' }} />
      <h3 style={{ marginTop: '10px', color: 'white' }}>{product.name}</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>Index: {index}</p>
    </div>
  );
}

function App() {
  const ref = useRef(null);

  return (
    <ParallaxCarouselReact
      ref={ref}
      items={products}
      options={{
        autoplay: true,
        renderItem: ({ item, index }) => (
          <ProductCard product={item} index={index} />
        ),
      }}
      onChange={({ index }) => console.log("Slide:", index)}
    />
  );
}
```

### React with TypeScript

```tsx
import { useRef } from "react";
import {
  ParallaxCarouselReact,
  type ParallaxCarouselReactHandle,
  type ParallaxCarouselReactProps,
} from "3d-whell-parallax-carousel/react";

interface Product {
  id: number;
  name: string;
  image: string;
}

const items: Product[] = [
  { id: 1, name: "Product 1", image: "/img1.jpg" },
  { id: 2, name: "Product 2", image: "/img2.jpg" },
];

function App() {
  const carouselRef = useRef<ParallaxCarouselReactHandle>(null);

  const handleChange: ParallaxCarouselReactProps["onChange"] = ({ index, total }) => {
    console.log(`Slide ${index} of ${total}`);
  };

  return (
    <>
      <ParallaxCarouselReact<Product>
        ref={carouselRef}
        items={items}
        options={{
          autoplay: true,
          renderItem: ({ item, index }) => (
            <div>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
            </div>
          ),
        }}
        onChange={handleChange}
      />
      <button onClick={() => carouselRef.current?.next()}>Next</button>
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

const items = ["<div>Card 1</div>", "<div>Card 2</div>"];
const onSlideChange = ({ index, total }) => console.log(index, total);
</script>
```

### Vue 3 with renderItem (VNode)

```vue
<template>
  <ParallaxCarousel
    ref="carousel"
    :items="products"
    :options="{
      autoplay: true,
      renderItem: ({ item, index }) => h('div', { 
        style: { padding: '20px', textAlign: 'center' }
      }, [
        h('img', { src: item.image, style: { width: '100%', borderRadius: '4px' } }),
        h('h3', { style: { marginTop: '10px', color: 'white' } }, item.name),
        h('p', { style: { color: 'rgba(255,255,255,0.6)' } }, `Index: ${index}`),
      ]),
    }"
    @change="onSlideChange"
  />
</template>

<script setup>
import { h } from 'vue';
import { ParallaxCarouselVue as ParallaxCarousel } from "3d-whell-parallax-carousel/vue";

const products = [
  { id: 1, name: "Product 1", image: "/img1.jpg" },
  { id: 2, name: "Product 2", image: "/img2.jpg" },
];

const onSlideChange = ({ index, total }) => console.log(index, total);
</script>
```

### Vue 3 with TypeScript

```vue
<template>
  <ParallaxCarousel
    ref="carouselRef"
    :items="products"
    :options="options"
    @change="onSlideChange"
  />
  <button @click="carouselRef?.next()">Next</button>
</template>

<script setup lang="ts">
import { ref, h, type VNode } from "vue";
import {
  ParallaxCarouselVue as ParallaxCarousel,
  type ParallaxCarouselInstance,
  type ParallaxCarouselOptions,
  type RenderItemContext,
} from "3d-whell-parallax-carousel/vue";

interface Product {
  id: number;
  name: string;
  image: string;
}

const carouselRef = ref<ParallaxCarouselInstance | null>(null);

const products: Product[] = [
  { id: 1, name: "Product 1", image: "/img1.jpg" },
  { id: 2, name: "Product 2", image: "/img2.jpg" },
];

const options: ParallaxCarouselOptions<Product> = {
  autoplay: true,
  renderItem: ({ item, index }: RenderItemContext<Product>): VNode => {
    return h('div', { style: { padding: '20px' } }, [
      h('img', { src: item.image, style: { width: '100%' } }),
      h('h3', item.name),
    ]);
  },
};

const onSlideChange = ({ index, total }: { index: number; total: number }) => {
  console.log(`Slide ${index} of ${total}`);
};
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
| `renderItem`   | function | `undefined`                  | Custom render function       |

### `slots` config

Customize each of the 5 visible positions (`-2` to `+2`):

```ts
import type { ParallaxCarouselOptions } from "3d-whell-parallax-carousel";

const options: ParallaxCarouselOptions = {
  slots: {
    '-2': { x: -490, w: 220, h: 330, ry:  50, origin: 'right center',  z: 1, op: 1 },
    '-1': { x: -255, w: 192, h: 295, ry:  26, origin: 'right center',  z: 2, op: 1 },
     '0': { x:    0, w: 188, h: 275, ry:   0, origin: 'center center', z: 3, op: 1 },
     '1': { x:  255, w: 192, h: 295, ry: -26, origin: 'left center',   z: 2, op: 1 },
     '2': { x:  490, w: 220, h: 330, ry: -50, origin: 'left center',   z: 1, op: 1 },
  },
};
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

### `renderItem` callback

Custom render function for each item. Returns depend on framework:

| Framework | Return Type | Example |
|-----------|-------------|---------|
| Vanilla JS | `string` \| `HTMLElement` | `'<div>Content</div>'` |
| React | `ReactNode` | `<MyComponent />` |
| Vue 3 | `VNode` \| `string` | `h('div', 'Content')` |

**Context object:**

```ts
type RenderItem = (context: {
  item: T;        // The item data
  index: number;  // Item index
  container: HTMLElement; // Card container element
}) => ReactNode | VNode | HTMLElement | string;
```

---

## API

### Vanilla JS / Core

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

### React Ref Methods

```tsx
const ref = useRef<ParallaxCarouselReactHandle>(null);

ref.current?.next();
ref.current?.prev();
ref.current?.goTo(2);
ref.current?.updateOptions({ interval: 5000 });
ref.current?.destroy();
```

### Vue Ref Methods

```vue
<script setup lang="ts">
const carouselRef = ref<ParallaxCarouselInstance | null>(null);

carouselRef.value?.next();
carouselRef.value?.prev();
carouselRef.value?.goTo(2);
carouselRef.value?.updateOptions({ interval: 5000 });
carouselRef.value?.destroy();
</script>
```

## Events

### Vanilla JS

```js
container.addEventListener("change", (e) => {
  console.log(e.detail.index); // current index
  console.log(e.detail.total); // total items
});
```

### React

```tsx
<ParallaxCarouselReact
  items={items}
  onChange={({ index, total }) => {
    console.log(`Slide ${index} of ${total}`);
  }}
/>
```

### Vue

```vue
<ParallaxCarousel
  :items="items"
  @change="({ index, total }) => console.log(`Slide ${index} of ${total}`)"
/>
```

---

## Build from source

```bash
npm install
npm run build
```

Output goes to `dist/`.

### Development

```bash
# Watch mode
npm run dev

# Type check
npm run typecheck
```

---

## TypeScript Support

This library includes full TypeScript support with:

- ✅ Complete type definitions for all exports
- ✅ Generic type support for items (`<T>`)
- ✅ Type-safe `renderItem` callback with framework-specific return types
- ✅ ReactNode support for React
- ✅ VNode support for Vue
- ✅ Type-safe options and props
- ✅ Typed event handlers
- ✅ Proper ref types for React and Vue
- ✅ tsconfig.json included

---

## License

MIT
