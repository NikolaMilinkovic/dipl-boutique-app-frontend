import { useState } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import './addAndEditProducts.scss';

function AddAndEditProducts() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <section
      className="add-edit-products-main"
      style={{ width: '100%', boxSizing: 'border-box' }}
    >
      <AddProduct isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        style={{
          position: isExpanded ? 'absolute' : 'unset',
          left: isExpanded ? '100vw' : '',
          transform: isExpanded ? 'translateX(50vw)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flex: 1,
        }}
      >
        <EditProduct />
      </div>
    </section>
  );
}

export default AddAndEditProducts;
