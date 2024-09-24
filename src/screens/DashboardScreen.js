import React from 'react';
import '../styles/DashboardScreen.css';
import Navbar from '../components/Navbar';
import Airport from '../components/Airport';
import Airlines from '../components/Airlines';

export default function DashboardScreen() {
  return (
    <section className="dashboard-page">
      <Navbar />
      <h1>Admin Dashboard</h1>
      <div className="dashboard-detail-container">
        <Airport />
        <Airlines />
      </div>
    </section>
  );
}
