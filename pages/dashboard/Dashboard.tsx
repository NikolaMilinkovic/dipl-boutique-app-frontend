import React, { useState } from 'react';
import './dashboard.scss';
import ApexDonutChart from '../../components/charts/donut/ApexDonutChart';
import { OrderStatistics } from '../../util-methods/OrderStatistics';
import { useOrders } from '../../store/orders-context';
import ApexBarChart from '../../components/charts/bar/ApexBarChart';
import UsersManager from './components/UsersManager';
import { NewUserTypes } from '../../global/types';
import { AdminContextProvider, useAdmin } from '../../store/admin-context';

// category: {
// add: true,
// edit: true,
// remove: true,
// update: true,
// },
// color: {
//   add: true,
//   edit: true,
//   remove: true,
//   update: true,
// },
// courier: {
//   add: true,
//   edit: true,
//   remove: true,
//   update: true,
// },
// supplier: {
//   add: true,
//   edit: true,
//   remove: true,
//   update: true,
// },

function Dashboard() {
  const { combinedOrders } = useOrders();
  const chart_1 = OrderStatistics.getCategoryCountData(combinedOrders);
  const chart_2 = OrderStatistics.getCategoryValueData(combinedOrders);
  const chart_3 = OrderStatistics.getOrderCountPerDay(combinedOrders);
  const chart_4 = OrderStatistics.getOrderValuePerDay(combinedOrders);
  const { newUser, setNewUser } = useAdmin();

  return (
    <section className="fade dashboard-section">
      <section className="pie-charts-section">
        {/* ITEMS PER CATEGORY */}
        <div className="pie-chart-card dashboard-card">
          <h3>Items sold per category:</h3>
          <div style={{ height: '250px' }}>
            <ApexDonutChart data={chart_1} displayCurrency="items" />
          </div>
        </div>

        {/* VALUE OF SOLD ITEMS PER CATEGORY */}
        <div className="pie-chart-card dashboard-card">
          <h3>Value of sold items per category:</h3>
          <div style={{ height: '250px' }}>
            <ApexDonutChart data={chart_2} displayCurrency="rsd" />
          </div>
        </div>

        {/* ORDERS PER DAY */}
        <div className="pie-chart-card dashboard-card">
          <h3>Orders per day:</h3>
          <div style={{ height: '230px' }}>
            <ApexBarChart data={chart_3} displayCurrency="orders" />
          </div>
        </div>

        {/* VALUE OF ORDERS PER DAY */}
        <div className="pie-chart-card dashboard-card">
          <h3>Order values per day:</h3>
          <div style={{ height: '230px' }}>
            <ApexBarChart data={chart_4} displayCurrency="rsd" />
          </div>
        </div>
      </section>
      <UsersManager newUser={newUser} setNewUser={setNewUser} />
    </section>
  );
}

export default Dashboard;
