import { useState } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import './addAndEditProducts.scss';

function AddAndEditProducts() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    // EXPAND BUTTONS
    // > Napravi tako da se add product moze expand i zauzme gotovo ceo ekran
    <section className="add-edit-products-main">
      <AddProduct isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        style={{
          position: isExpanded ? 'absolute' : 'unset',
          left: isExpanded ? '110vw' : '',
          transform: isExpanded ? 'translateX(50vw)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        <EditProduct />
      </div>
    </section>
  );
}

export default AddAndEditProducts;
