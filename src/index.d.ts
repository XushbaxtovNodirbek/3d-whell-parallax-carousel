/**
 * 3d-whell-parallax-carousel
 * Smooth 3D parallax carousel with trapezoid perspective effect
 */

/**
 * Slot configuration for carousel positions (-2 to +2)
 */
export interface SlotConfig {
  /** Horizontal offset from center in pixels */
  x: number;
  /** Card width in pixels */
  w: number;
  /** Card height in pixels */
  h: number;
  /** rotateY angle in degrees */
  ry: number;
  /** CSS transform-origin */
  origin: string;
  /** z-index */
  z: number;
  /** opacity (0-1) */
  op: number;
}

/**
 * Context object passed to renderItem callback
 */
export interface RenderItemContext<T = any> {
  /** The item data */
  item: T;
  /** Item index */
  index: number;
  /** Card container element */
  container: HTMLElement;
}

/**
 * Carousel options interface
 */
export interface ParallaxCarouselOptions<T = any> {
  /**
   * Per-slot position configuration (-2 to +2)
   * @default See DEFAULT_OPTIONS
   */
  slots?: Partial<Record<'-2' | '-1' | '0' | '1' | '2', Partial<SlotConfig>>>;

  /**
   * Transition duration in milliseconds
   * @default 650
   */
  duration?: number;

  /**
   * CSS easing function
   * @default 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  easing?: string;

  /**
   * Enable auto-advance
   * @default true
   */
  autoplay?: boolean;

  /**
   * Autoplay interval in milliseconds
   * @default 2800
   */
  interval?: number;

  /**
   * Pause autoplay on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Card background color
   * @default '#111111'
   */
  background?: string;

  /**
   * Card border color
   * @default 'rgba(255,255,255,0.1)'
   */
  borderColor?: string;

  /**
   * Card border width
   * @default '1.5px'
   */
  borderWidth?: string;

  /**
   * Card border radius
   * @default '4px'
   */
  borderRadius?: string;

  /**
   * Stage height
   * @default '420px'
   */
  stageHeight?: string;

  /**
   * CSS perspective value in pixels
   * @default 900
   */
  perspective?: number;

  /**
   * Show background grid
   * @default true
   */
  showGrid?: boolean;

  /**
   * Grid line color
   * @default 'rgba(255,255,255,0.032)'
   */
  gridColor?: string;

  /**
   * Grid cell size
   * @default '38px'
   */
  gridSize?: string;

  /**
   * Custom render function for items
   * @param context - Render context with item, index, and container
   * @returns HTMLElement or HTML string
   */
  renderItem?: (context: RenderItemContext<T>) => HTMLElement | string;
}

/**
 * Change event detail
 */
export interface ChangeEventDetail {
  /** Current slide index */
  index: number;
  /** Total number of items */
  total: number;
}

/**
 * Default options object
 */
export declare const DEFAULT_OPTIONS: Readonly<{
  slots: Record<'-2' | '-1' | '0' | '1' | '2', SlotConfig>;
  duration: number;
  easing: string;
  autoplay: boolean;
  interval: number;
  pauseOnHover: boolean;
  background: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  stageHeight: string;
  perspective: number;
  showGrid: boolean;
  gridColor: string;
  gridSize: string;
}>;

/**
 * ParallaxCarousel class
 * Main carousel implementation (framework-free)
 *
 * @typeParam T - Type of items in the carousel
 */
export declare class ParallaxCarousel<T = any> {
  /** Current slide index */
  current: number;

  /** Total number of items */
  total: number;

  /** Carousel options */
  options: ParallaxCarouselOptions<T>;

  /** Whether animation is in progress */
  isAnimating: boolean;

  /**
   * Create a new ParallaxCarousel instance
   * @param container - CSS selector string or HTMLElement
   * @param items - Array of items to display
   * @param options - Carousel options
   * @throws Error if container not found
   */
  constructor(
    container: string | HTMLElement,
    items: T[],
    options?: ParallaxCarouselOptions<T>
  );

  /**
   * Go to next slide
   */
  next(): void;

  /**
   * Go to previous slide
   */
  prev(): void;

  /**
   * Jump to specific slide index
   * @param index - Target slide index
   */
  goTo(index: number): void;

  /**
   * Update carousel options at runtime
   * @param newOptions - Options to merge with current
   */
  updateOptions(newOptions: ParallaxCarouselOptions<T>): void;

  /**
   * Destroy carousel instance and clean up
   */
  destroy(): void;
}

// Export as default
export default ParallaxCarousel;
