import './productsManager.scss';
import { Tab, Tabs } from '../../components/tabs/Tabs';
import AddAndEditProducts from './add-products/AddAndEditProducts';

function ProductsManager() {
  return (
    <section className="products-manager-section" style={{ marginTop: '1rem' }}>
      <AddAndEditProducts />
    </section>
  );
}

export default ProductsManager;
