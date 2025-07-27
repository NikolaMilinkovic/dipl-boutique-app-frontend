import { useEffect, useState, ComponentType } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './animatedList.scss';

interface AnimatedListProps<T> {
  items: T[];
  searchTerm?: string;
  searchFunction?: (item: T) => boolean;
  renderItem: (item: T) => React.ReactNode;
  noDataImage?: string;
  noDataAlt?: string;
  className?: string;
  maxWidth?: string;
  containerStyles?: any;
  containScroll?: boolean;
}

function AnimatedList<T>({
  items,
  renderItem,
  noDataImage = '/img/no_data_found.png',
  noDataAlt = 'No data found',
  className = '',
  containerStyles,
  containScroll = true,
}: AnimatedListProps<T>) {
  // Using the custom hook for scroll animations
  const { visibleItems, containerRef } = useScrollAnimation(items);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const height = el.clientHeight;
      const delta = e.deltaY;

      if (
        (scrollTop === 0 && delta < 0) ||
        (scrollTop + height >= scrollHeight && delta > 0)
      ) {
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section
      className={`animated-list-section ${className}`}
      style={containerStyles}
    >
      {items && items.length > 0 ? (
        <>
          <div
            className="animated-list"
            ref={containerRef}
            style={{ overscrollBehavior: containScroll ? 'contain' : 'auto' }}
          >
            {items.map((item, index) => (
              <div
                key={(item as any)._id || `item_${index}`}
                className={`list-item ${visibleItems.has(index) ? 'visible' : ''}`}
                data-index={index}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>

          <div className="scroll-fade scroll-fade-top"></div>
          <div className="scroll-fade scroll-fade-bottom"></div>
        </>
      ) : (
        <img src={noDataImage} alt={noDataAlt} className="no-data-found-icon" />
      )}
    </section>
  );
}

export default AnimatedList;
