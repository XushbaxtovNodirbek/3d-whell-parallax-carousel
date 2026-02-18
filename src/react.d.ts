/**
 * React wrapper for 3d-whell-parallax-carousel
 */

import * as React from 'react';
import { ParallaxCarouselOptions, ChangeEventDetail, CarouselItem } from './index.js';

/**
 * Props for ParallaxCarouselReact component
 */
export interface ParallaxCarouselReactProps {
  /**
   * Array of items to display in the carousel
   * Can be HTML strings, React elements, DOM elements, or objects with render() method
   */
  items: CarouselItem[];

  /**
   * Carousel options
   */
  options?: ParallaxCarouselOptions;

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
 * function App() {
 *   const carouselRef = useRef<ParallaxCarouselReactHandle>(null);
 *   const items = ['<div>Card 1</div>', '<div>Card 2</div>'];
 *
 *   return (
 *     <>
 *       <ParallaxCarouselReact
 *         ref={carouselRef}
 *         items={items}
 *         options={{ autoplay: true, interval: 3000 }}
 *         onChange={({ index }) => console.log('Slide:', index)}
 *       />
 *       <button onClick={() => carouselRef.current?.next()}>Next</button>
 *     </>
 *   );
 * }
 * ```
 */
declare const ParallaxCarouselReact: React.ForwardRefExoticComponent<
  ParallaxCarouselReactProps & React.RefAttributes<ParallaxCarouselReactHandle>
>;

export default ParallaxCarouselReact;
export { ParallaxCarouselReact };
