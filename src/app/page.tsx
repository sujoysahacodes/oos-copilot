'use client';

import { useState } from 'react';
import { Header } from '../components/Header';
import { DistributionSidebar } from '../components/DistributionSidebar';
import DistributionOverview from '../components/distribution/DistributionOverview';
import RequestProcessor from '../components/distribution/RequestProcessor';
import DemandIntelligence from '../components/distribution/DemandIntelligence';
import NetworkOptimizer from '../components/distribution/NetworkOptimizer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DistributionOverview />;
      case 'requests':
        return <RequestProcessor />;
      case 'demand':
        return <DemandIntelligence />;
      case 'network':
        return <NetworkOptimizer />;
      default:
        return <DistributionOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <DistributionSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-8">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}
