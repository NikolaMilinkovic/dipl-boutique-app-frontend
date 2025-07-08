import { useEffect, useState, ComponentType } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './animatedList.scss';

interface AnimatedListProps<T> {
  items: T[];
  searchTerm?: string;
  searchFunction?: (
    item: T,
    searchTerm: string,
    stockTypeFilter?: string,
  ) => boolean;
  renderItem: ComponentType<{ data: T }>;
  noDataImage?: string;
  noDataAlt?: string;
  className?: string;
  maxWidth?: string;
  height?: string;
  stockTypeFilter?: string;
}

function AnimatedList<T>({
  items,
  searchTerm,
  searchFunction,
  renderItem: RenderComponent,
  noDataImage = '/img/no_data_found.png',
  noDataAlt = 'No data found',
  className = '',
  maxWidth = '800px',
  height = '77.5vh',
  stockTypeFilter,
}: AnimatedListProps<T>) {
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  // Default search function - assumes items have a 'name' property
  const defaultSearchFunction = (item: T, searchTerm: string): boolean => {
    const itemAsAny = item as any;
    if (itemAsAny.name && typeof itemAsAny.name === 'string') {
      return itemAsAny.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  };

  useEffect(() => {
    const searchFunc = searchFunction || defaultSearchFunction;

    const filtered = items.filter((item) =>
      searchFunc(item, searchTerm?.trim() || '', stockTypeFilter),
    );

    setFilteredItems(filtered);
  }, [searchTerm, stockTypeFilter, items, searchFunction]);

  // Using the custom hook for scroll animations
  const { visibleItems, containerRef } = useScrollAnimation(filteredItems);

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
      style={{ height, width: '100% !important' }}
    >
      {filteredItems && filteredItems.length > 0 ? (
        <>
          <div
            className="animated-list"
            ref={containerRef}
            style={{ maxWidth }}
          >
            {filteredItems.map((item, index) => (
              <div
                key={`item_${index}`}
                className={`list-item ${visibleItems.has(index) ? 'visible' : ''}`}
                data-index={index}
              >
                <RenderComponent data={item} />
              </div>
            ))}
          </div>

          <div
            className="scroll-fade scroll-fade-top"
            style={{ maxWidth }}
          ></div>
          <div
            className="scroll-fade scroll-fade-bottom"
            style={{ maxWidth }}
          ></div>
        </>
      ) : (
        <img src={noDataImage} alt={noDataAlt} className="no-data-found-icon" />
      )}
    </section>
  );
}

export default AnimatedList;
