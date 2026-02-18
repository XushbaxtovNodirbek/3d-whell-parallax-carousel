import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ParallaxCarousel } from './core.js';

/**
 * Helper to convert React element to HTML string
 * Uses a temporary DOM container for rendering
 */
function renderReactElementToHtml(element) {
  if (typeof element === 'string') return element;
  if (!React.isValidElement(element)) return String(element);

  const container = document.createElement('div');
  
  // Try React 18+ createRoot first, fallback to ReactDOM.render
  try {
    const ReactDOM = window.ReactDOM;
    if (ReactDOM && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(container);
      root.render(element);
      // For SSR or immediate HTML, we need to get the rendered output
      // This is a limitation - React elements need to be rendered
      // For best results, pass HTML strings or DOM elements directly
    } else if (ReactDOM) {
      ReactDOM.render(element, container);
    }
  } catch (e) {
    // React not available in this context
  }
  
  // Return innerHTML if rendered, otherwise use a data attribute approach
  if (container.innerHTML) return container.innerHTML;
  
  // Fallback: render to a string-like representation
  // Users should pass HTML strings or DOM elements for best results
  return element.type ? `<div data-react-component="${element.type}"></div>` : String(element);
}

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

  useEffect(() => {
    if (!containerRef.current) return;

    // Store current items
    itemsRef.current = items;

    // Clean up previous instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    // Resolve items to HTML
    const resolvedItems = items.map(item => {
      if (typeof item === 'string') return item;
      if (item instanceof HTMLElement) return item;
      if (item && typeof item.render === 'function') return item.render();
      if (React.isValidElement(item)) {
        // For React elements, create a container and mount
        const tempContainer = document.createElement('div');
        try {
          const ReactDOM = window.ReactDOM;
          if (ReactDOM?.createRoot) {
            const root = ReactDOM.createRoot(tempContainer);
            root.render(item);
          } else if (ReactDOM) {
            ReactDOM.render(item, tempContainer);
          }
        } catch (e) {
          // Ignore React rendering errors
        }
        if (tempContainer.innerHTML) return tempContainer.innerHTML;
      }
      return String(item);
    });

    instanceRef.current = new ParallaxCarousel(
      containerRef.current,
      resolvedItems,
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
      
      const resolvedItems = items.map(item => {
        if (typeof item === 'string') return item;
        if (item instanceof HTMLElement) return item;
        if (item && typeof item.render === 'function') return item.render();
        return String(item);
      });

      instanceRef.current = new ParallaxCarousel(
        containerRef.current,
        resolvedItems,
        instanceRef.current.options
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
