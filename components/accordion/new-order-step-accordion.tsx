import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './new-order-step-accordion.scss';

export interface AccordionRef {
  open: () => void;
  close: () => void;
}
interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  initialOpen?: boolean;
  id?: string;
}

const NewOrderStepAccordion = forwardRef<AccordionRef, AccordionProps>(
  ({ title, children, initialOpen, id }, ref) => {
    const [isOpen, setIsOpen] = useState(initialOpen ?? false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState('0px');

    useEffect(() => {
      if (contentRef.current) {
        setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
      }
    }, [isOpen]);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    return (
      <div className="accordion" id={id}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="accordionButton"
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <span>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
        </button>

        <div
          ref={contentRef}
          className="accordionContent"
          style={{ maxHeight: height }}
        >
          {children}
        </div>
      </div>
    );
  },
);

export default NewOrderStepAccordion;
