import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIStrategist from './components/AIStrategist';
import BudgetManager from './components/BudgetManager';
import NeedsAssessment from './components/NeedsAssessment';
import { Building2, Plus } from 'lucide-react';

// Placeholder components for sections not fully detailed in this pass
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
    <Building2 size={48} className="mb-4 opacity-50" />
    <h2 className="text-xl font-semibold text-slate-600">{title} Module</h2>
    <p className="mt-2">This module is part of the full EIB Group implementation.</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return <NeedsAssessment />;
      case 'strategy':
        return <AIStrategist />;
      case 'budget':
        return <BudgetManager />;
      case 'training':
        return <Placeholder title="Training Programs Management" />;
      case 'assets':
        return <Placeholder title="Asset & Facility Management" />;
      case 'reports':
        return <Placeholder title="Group Reporting & Analytics" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, Group Manager - Training
            </p>
          </div>
          
          <div className="flex space-x-4">
             <button className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                <span>Group: EIB Holdings</span>
             </button>
             <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">
                <Plus size={16} />
                <span>New Initiative</span>
             </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;