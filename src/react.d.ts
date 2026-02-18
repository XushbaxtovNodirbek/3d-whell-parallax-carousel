/**
 * React wrapper for 3d-whell-parallax-carousel
 */

import * as React from 'react';
import { ParallaxCarouselOptions, ChangeEventDetail, RenderItemContext } from './index.js';

/**
 * Render function return type for React - supports ReactNode
 */
export type ReactRenderItemResult = React.ReactNode | HTMLElement | string;

/**
 * Props for ParallaxCarouselReact component
 *
 * @typeParam T - Type of items in the carousel
 */
export interface ParallaxCarouselReactProps<T = any> {
  /**
   * Array of items to display in the carousel
   * Can be any type - use renderItem to customize rendering
   */
  items: T[];

  /**
   * Carousel options
   */
  options?: ParallaxCarouselOptions<T> & {
    /**
     * Custom render function for items (React-specific)
     * Can return ReactNode, HTMLElement, or string
     * @param context - Render context with item, index, and container
     * @returns ReactNode or render result
     */
    renderItem?: (context: RenderItemContext<T>) => ReactRenderItemResult;
  };

  /**
   * Change event handler
   * @param detail - Event detail with index and total
   */
  onChange?: (detail: ChangeEventDetail) => void;

  /**
   * CSS class name for the container
   */
  className?: string;

  /**
   * Inline styles for the container
   */
  style?: React.CSSProperties;
}

/**
 * Imperative handle for ParallaxCarouselReact
 */
export interface ParallaxCarouselReactHandle {
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
}

/**
 * React component wrapper for ParallaxCarousel
 *
 * @example
 * ```tsx
 * import { ParallaxCarouselReact } from '3d-whell-parallax-carousel/react';
 *
 * interface Product {
 *   id: number;
 *   name: string;
 *   image: string;
 * }
 *
 * function App() {
 *   const carouselRef = useRef<ParallaxCarouselReactHandle>(null);
 *   const items: Product[] = [
 *     { id: 1, name: 'Product 1', image: '/img1.jpg' },
 *     { id: 2, name: 'Product 2', image: '/img2.jpg' },
 *   ];
 *
 *   return (
 *     <>
 *       <ParallaxCarouselReact<Product>
 *         ref={carouselRef}
 *         items={items}
 *         options={{
 *           autoplay: true,
 *           renderItem: ({ item }) => (
 *             <div>
 *               <img src={item.image} alt={item.name} />
 *               <h3>{item.name}</h3>
 *             </div>
 *           ),
 *         }}
 *         onChange={({ index }) => console.log('Slide:', index)}
 *       />
 *       <button onClick={() => carouselRef.current?.next()}>Next</button>
 *     </>
 *   );
 * }
 * ```
 */
declare const ParallaxCarouselReact: {
  <T = any>(
    props: ParallaxCarouselReactProps<T> & React.RefAttributes<ParallaxCarouselReactHandle>
  ): React.ReactElement;
};

export default ParallaxCarouselReact;
export { ParallaxCarouselReact };
