/**
 * 3D Wheel Parallax Carousel - React TypeScript Example
 * 
 * This example demonstrates how to use the 3d-whell-parallax-carousel
 * library in a React application with TypeScript.
 * 
 * To run this example:
 * 1. Create a new React + TypeScript project (e.g., with Vite)
 * 2. Install the package: npm install 3d-whell-parallax-carousel
 * 3. Copy this file to your src folder
 * 4. Update main.tsx to render this App component
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ParallaxCarouselReact,
  type ParallaxCarouselReactHandle,
  type ParallaxCarouselOptions,
  type ChangeEventDetail,
} from '3d-whell-parallax-carousel/react';

// ============================================================================
// Types
// ============================================================================

interface CarouselItem {
  id: number;
  number: string;
  gradient: string;
}

// ============================================================================
// Data
// ============================================================================

const TOTAL_ITEMS = 8;

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
];

// Generate carousel items
const items: CarouselItem[] = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: i + 1,
  number: String(i + 1).padStart(2, '0'),
  gradient: GRADIENTS[i % GRADIENTS.length],
}));

// ============================================================================
// Styles (CSS-in-JS for simplicity)
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0e0e0e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Syne', sans-serif",
    overflow: 'hidden',
  },
  gridBackground: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)
    `,
    backgroundSize: '38px 38px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  carouselWrapper: {
    position: 'relative',
    width: '100vw',
    height: '420px',
    zIndex: 1,
  },
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '56px',
    fontWeight: 700,
    letterSpacing: '-3px',
    color: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)',
  },
  cardNumber: {
    position: 'relative',
    zIndex: 1,
  },
  nav: {
    position: 'fixed',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    zIndex: 100,
  },
  navButton: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.45)',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    display: 'flex',
    gap: '7px',
    alignItems: 'center',
  },
  dot: (isActive: boolean) => ({
    width: isActive ? '18px' : '5px',
    height: '5px',
    borderRadius: '3px',
    background: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)',
    transition: 'all 0.3s',
    cursor: 'pointer',
  }),
  info: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    zIndex: 100,
    textAlign: 'center',
  },
};

// ============================================================================
// Carousel Options
// ============================================================================

const carouselOptions: ParallaxCarouselOptions<CarouselItem> = {
  autoplay: true,
  interval: 2800,
  pauseOnHover: true,
  duration: 650,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  background: '#111111',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: '1.5px',
  borderRadius: '4px',
  perspective: 900,
  showGrid: false, // We render grid separately
  renderItem: ({ item }) => (
    <div
      style={{
        ...styles.card,
        background: item.gradient,
      }}
    >
      <div style={styles.cardGradient} />
      <span style={styles.cardNumber}>{item.number}</span>
    </div>
  ),
};

// ============================================================================
// Main Component
// ============================================================================

export default function App() {
  const carouselRef = useRef<ParallaxCarouselReactHandle>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Handle slide change
  const handleChange = useCallback((detail: ChangeEventDetail) => {
    setCurrentIndex(detail.index);
  }, []);

  // Handle dot click
  const handleDotClick = useCallback(
    (index: number) => {
      carouselRef.current?.goTo(index);
    },
    [],
  );

  // Handle navigation
  const handleNext = useCallback(() => {
    carouselRef.current?.next();
  }, []);

  const handlePrev = useCallback(() => {
    carouselRef.current?.prev();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div style={styles.container}>
      {/* Grid Background */}
      <div style={styles.gridBackground} />

      {/* Info */}
      <div style={styles.info}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
          3D Parallax Carousel
        </h1>
        <p>React + TypeScript Example</p>
      </div>

      {/* Carousel */}
      <div
        style={styles.carouselWrapper}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <ParallaxCarouselReact<CarouselItem>
          ref={carouselRef}
          items={items}
          options={carouselOptions}
          onChange={handleChange}
        />
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        <button
          style={{
            ...styles.navButton,
            ...(isHovering ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' } : {}),
          }}
          onClick={handlePrev}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
          }}
        >
          ←
        </button>

        <div style={styles.dotsContainer}>
          {items.map((_, index) => (
            <div
              key={index}
              style={styles.dot(index === currentIndex)}
              onClick={() => handleDotClick(index)}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                }
              }}
            />
          ))}
        </div>

        <button
          style={{
            ...styles.navButton,
            ...(isHovering ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' } : {}),
          }}
          onClick={handleNext}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
