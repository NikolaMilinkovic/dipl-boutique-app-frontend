import './productsManager.scss';
import { Tab, Tabs } from '../../components/tabs/Tabs';
import AddAndEditProducts from './add-products/AddAndEditProducts';

function ProductsManager() {
  return (
    <section className="products-manager-section">
      <AddAndEditProducts />
    </section>
  );
}

export default ProductsManager;
