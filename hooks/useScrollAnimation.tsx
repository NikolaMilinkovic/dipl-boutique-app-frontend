// hooks/useIntersectionObserver.js
import { useState, useEffect, useRef } from 'react';

/**
 * Hook for animating elements as they scroll into view
 * @param {Array} items - Array of items to observe
 * @param {Object} options - IntersectionObserver options
 * @param {string} selector - CSS selector for elements to observe
 * @param {number} delay - Delay before starting observation
 * @returns {Object} - { visibleItems: Set, containerRef: RefObject }
 */
export function useIntersectionObserver(
  items = [],
  options = {},
  selector = '.list-item',
  delay = 30,
) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  // Default options
  const defaultOptions = {
    threshold: 0.0,
    rootMargin: '200px',
    ...options,
  };

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Reset visible items when items change
    setVisibleItems(new Set());

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          if (!isNaN(index)) {
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        }
      });
    }, defaultOptions);

    const timer = setTimeout(() => {
      const elements = containerRef.current?.querySelectorAll(selector);
      elements?.forEach((element) => observerRef.current?.observe(element));
    }, delay);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [
    items,
    selector,
    delay,
    defaultOptions.threshold,
    defaultOptions.rootMargin,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { visibleItems, containerRef };
}

// Alternative: More specific hook for lists
export function useScrollAnimation(items, options = {}) {
  return useIntersectionObserver(items, {
    threshold: 0.0,
    rootMargin: '200px',
    ...options,
  });
}

// Alternative: Hook with callback support
export function useVisibilityObserver(items, onVisible, options = {}) {
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!items || items.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            if (!isNaN(index) && onVisible) {
              onVisible(index, entry.target);
            }
          }
        });
      },
      {
        threshold: 0.0,
        rootMargin: '200px',
        ...options,
      },
    );

    const timer = setTimeout(() => {
      const elements = containerRef.current?.querySelectorAll('.list-item');
      elements?.forEach((element) => observerRef.current?.observe(element));
    }, 50);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [items, onVisible, options]);

  return containerRef;
}
