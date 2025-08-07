import { Tabs, Tab } from '../../components/tabs/Tabs';
import ColorsManager from './colors/ColorsManager';
import './appStup.scss';
import CategoriesManager from './categories/CategoriesManager';
import SuppliersManager from './suppliers/SuppliersManager';
import CouriersManager from './couriers/CouriersManager';

function AppSetup() {
  return (
    <section className="fade app-setup-section">
      <Tabs>
        <Tab label="Colors">
          <ColorsManager />
        </Tab>
        <Tab label="Categories">
          <CategoriesManager />
        </Tab>
        <Tab label="Suppliers">
          <SuppliersManager />
        </Tab>
        <Tab label="Couriers">
          <CouriersManager />
        </Tab>
      </Tabs>
    </section>
  );
}

export default AppSetup;
