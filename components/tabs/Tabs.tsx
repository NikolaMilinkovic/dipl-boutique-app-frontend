import React, { useState, ReactNode, ReactElement, useEffect } from 'react';
import './tabs.scss';

interface TabProps {
  label: string;
  children: ReactNode;
}

interface TabsProps {
  children: ReactElement<TabProps>[];
}

export function Tab({ children }: TabProps) {
  return <>{children}</>; // just renders its children
}

export function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToTab = (index: number) => {
    const lastIndex = children.length - 1;
    if (index < 0) setActiveIndex(lastIndex);
    else if (index > lastIndex) setActiveIndex(0);
    else setActiveIndex(index);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey) return;

      if (e.key === 'ArrowDown') {
        goToTab(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        goToTab(activeIndex - 1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, children.length]);

  return (
    <div className="tabs">
      <div className="tab-headers">
        {children.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content" key={activeIndex}>
        {children[activeIndex]}
      </div>
    </div>
  );
}
