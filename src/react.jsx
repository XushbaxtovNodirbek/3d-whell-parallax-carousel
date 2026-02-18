import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ParallaxCarousel } from './core.js';

/**
 * React wrapper for ParallaxCarousel
 *
 * @example
 * ```jsx
 * <ParallaxCarouselReact
 *   items={['<div>Card 1</div>', '<div>Card 2</div>']}
 *   options={{ autoplay: true, interval: 3000 }}
 *   onChange={({ index }) => console.log(index)}
 * />
 * ```
 */
const ParallaxCarouselReact = forwardRef(function ParallaxCarouselReact(
  { items = [], options = {}, onChange, className, style },
  ref
) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const itemsRef = useRef(items);
  const optionsRef = useRef(options);

  useEffect(() => {
    if (!containerRef.current) return;

    // Store current items and options
    itemsRef.current = items;
    optionsRef.current = options;

    // Clean up previous instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    instanceRef.current = new ParallaxCarousel(
      containerRef.current,
      items,
      options
    );

    // Subscribe to change events
    const handleChange = (e) => {
      if (onChange) onChange(e.detail);
    };
    containerRef.current.addEventListener('change', handleChange);

    return () => {
      containerRef.current?.removeEventListener('change', handleChange);
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle items update - recreate carousel with new items
  useEffect(() => {
    if (!instanceRef.current || !containerRef.current) return;
    
    // Check if items actually changed
    const itemsChanged = items.length !== itemsRef.current.length ||
      items.some((item, i) => item !== itemsRef.current[i]);
    
    if (itemsChanged) {
      itemsRef.current = items;
      
      // Destroy and recreate
      instanceRef.current.destroy();
      
      instanceRef.current = new ParallaxCarousel(
        containerRef.current,
        items,
        optionsRef.current
      );

      // Re-attach change listener
      if (onChange) {
        containerRef.current.addEventListener('change', (e) => onChange(e.detail));
      }
    }
  }, [items, onChange]);

  // Update options when they change
  useEffect(() => {
    if (instanceRef.current) {
      optionsRef.current = options;
      instanceRef.current.updateOptions(options);
    }
  }, [options]);

  // Expose imperative API
  useImperativeHandle(ref, () => ({
    next: () => instanceRef.current?.next(),
    prev: () => instanceRef.current?.prev(),
    goTo: (i) => instanceRef.current?.goTo(i),
    updateOptions: (opts) => instanceRef.current?.updateOptions(opts),
    destroy: () => instanceRef.current?.destroy(),
  }));

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', ...style }}
    />
  );
});

export default ParallaxCarouselReact;
export { ParallaxCarouselReact };
