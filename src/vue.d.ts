/**
 * Vue 3 wrapper for 3d-whell-parallax-carousel
 */

import { DefineComponent, Ref, ComponentPublicInstance } from 'vue';
import { ParallaxCarouselOptions, ChangeEventDetail, CarouselItem } from './index.js';

/**
 * Props for ParallaxCarouselVue component
 */
export interface ParallaxCarouselVueProps {
  /**
   * Array of items to display in the carousel
   * Can be HTML strings, DOM elements, or objects with render() method
   */
  items: CarouselItem[];

  /**
   * Carousel options
   */
  options?: ParallaxCarouselOptions;
}

/**
 * Emits for ParallaxCarouselVue component
 */
export interface ParallaxCarouselVueEmits {
  /**
   * Change event emitted when slide changes
   * @param detail - Event detail with index and total
   */
  (e: 'change', detail: ChangeEventDetail): void;
}

/**
 * Exposed methods for ParallaxCarouselVue
 */
export interface ParallaxCarouselVueExposed {
  /**
   * Go to next slide
   */
  next: () => void;

  /**
   * Go to previous slide
   */
  prev: () => void;

  /**
   * Go to specific slide index
   * @param index - Slide index
   */
  goTo: (index: number) => void;

  /**
   * Update carousel options
   * @param options - New options to merge
   */
  updateOptions: (options: ParallaxCarouselOptions) => void;

  /**
   * Destroy the carousel instance
   */
  destroy: () => void;

  /**
   * Get current slide index
   */
  getCurrentIndex: () => number;

  /**
   * Get total number of items
   */
  getTotal: () => number;
}

/**
 * Vue 3 component wrapper for ParallaxCarousel
 *
 * @example
 * ```vue
 * <template>
 *   <ParallaxCarousel
 *     ref="carousel"
 *     :items="items"
 *     :options="{ autoplay: true, interval: 3000 }"
 *     @change="onSlideChange"
 *   />
 *   <button @click="$refs.carousel.next()">Next</button>
 * </template>
 *
 * <script setup lang="ts">
 * import { ParallaxCarouselVue } from '3d-whell-parallax-carousel/vue';
 * import type { ParallaxCarouselVueExposed } from '3d-whell-parallax-carousel/vue';
 *
 * const carousel = ref<ParallaxCarouselVueExposed | null>(null);
 * const items = ['<div>Card 1</div>', '<div>Card 2</div>'];
 * const onSlideChange = ({ index, total }) => console.log(index, total);
 * </script>
 * ```
 */
declare const ParallaxCarouselVue: DefineComponent<
  ParallaxCarouselVueProps,
  {},
  {},
  {},
  {},
  {},
  {},
  ParallaxCarouselVueEmits
>;

export default ParallaxCarouselVue;
export { ParallaxCarouselVue };

/**
 * Type for component instance (for use with template refs)
 */
export type ParallaxCarouselInstance = ComponentPublicInstance<
  ParallaxCarouselVueProps,
  ParallaxCarouselVueExposed
>;
