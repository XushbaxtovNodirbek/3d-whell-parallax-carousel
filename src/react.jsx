import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ParallaxCarousel } from './core.js';

/**
 * React wrapper for ParallaxCarousel
 *
 * @example
 * <ParallaxCarouselReact
 *   items={['<div>Card 1</div>', '<div>Card 2</div>']}
 *   options={{ autoplay: true, interval: 3000 }}
 *   onChange={({ index }) => console.log(index)}
 * />
 */
const ParallaxCarouselReact = forwardRef(function ParallaxCarouselReact(
  { items = [], options = {}, onChange, className, style },
  ref
) {
  const containerRef = useRef(null);
  const instanceRef  = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert React elements to HTML strings if needed
    const resolvedItems = items.map(item => {
      if (typeof item === 'string') return item;
      if (React.isValidElement(item)) {
        // Render to static markup via a temp container
        const tmp = document.createElement('div');
        // Use ReactDOM.render or createRoot depending on React version
        return tmp.innerHTML || String(item);
      }
      return String(item);
    });

    instanceRef.current = new ParallaxCarousel(
      containerRef.current,
      resolvedItems,
      options
    );

    if (onChange) {
      containerRef.current.addEventListener('change', (e) => onChange(e.detail));
    }

    return () => {
      instanceRef.current?.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update options when they change
  useEffect(() => {
    instanceRef.current?.updateOptions(options);
  }, [options]);

  // Expose imperative API
  useImperativeHandle(ref, () => ({
    next:    () => instanceRef.current?.next(),
    prev:    () => instanceRef.current?.prev(),
    goTo:    (i) => instanceRef.current?.goTo(i),
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
