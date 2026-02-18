/**
 * Vue 3 wrapper for 3d-whell-parallax-carousel
 */

import { DefineComponent, Ref, ComponentPublicInstance } from 'vue';
import { ParallaxCarouselOptions, ChangeEventDetail, RenderItemContext } from './index.js';

/**
 * Props for ParallaxCarouselVue component
 *
 * @typeParam T - Type of items in the carousel
 */
export interface ParallaxCarouselVueProps<T = any> {
  /**
   * Array of items to display in the carousel
   * Can be any type - use renderItem to customize rendering
   */
  items: T[];

  /**
   * Carousel options
   */
  options?: ParallaxCarouselOptions<T>;
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
 *     ref="carouselRef"
 *     :items="items"
 *     :options="{
 *       autoplay: true,
 *       renderItem: ({ item }) => `<div>${item.name}</div>`,
 *     }"
 *     @change="onSlideChange"
 *   />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { ParallaxCarouselVue } from '3d-whell-parallax-carousel/vue';
 *
 * interface Product {
 *   id: number;
 *   name: string;
 * }
 *
 * const carouselRef = ref<ParallaxCarouselInstance | null>(null);
 * const items: Product[] = [
 *   { id: 1, name: 'Product 1' },
 *   { id: 2, name: 'Product 2' },
 * ];
 * const onSlideChange = ({ index, total }) => console.log(index, total);
 * </script>
 * ```
 */
declare const ParallaxCarouselVue: {
  new <T = any>(): DefineComponent<
    ParallaxCarouselVueProps<T>,
    {},
    {},
    {},
    {},
    {},
    {},
    ParallaxCarouselVueEmits
  >;
};

export default ParallaxCarouselVue;
export { ParallaxCarouselVue };

/**
 * Type for component instance (for use with template refs)
 */
export type ParallaxCarouselInstance = ComponentPublicInstance<
  ParallaxCarouselVueProps,
  ParallaxCarouselVueExposed
>;
