import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIStrategist from './components/AIStrategist';
import BudgetManager from './components/BudgetManager';
import NeedsAssessment from './components/NeedsAssessment';
import TrainingManager from './components/TrainingManager';
import { Building2, Plus, Shield, UserCircle, LogIn } from 'lucide-react';
import { UserProfile, Subsidiary } from './types';

// Placeholder components for sections not fully detailed in this pass
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
    <Building2 size={48} className="mb-4 opacity-50" />
    <h2 className="text-xl font-semibold text-slate-600">{title} Module</h2>
    <p className="mt-2">This module is part of the full EIB Group implementation.</p>
  </div>
);

// RBAC Login Simulation Component
const LoginScreen = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => {
    const roles: UserProfile[] = [
        { id: 'u1', name: 'Marquis Michael Abimbola', role: 'GROUP_ADMIN', jobTitle: 'Group Manager - Training' },
        { id: 'u2', name: 'Benedict Aondofa', role: 'GROUP_ADMIN', jobTitle: 'Technical Supervisor (2nd in Command)' },
        { id: 'u6', name: 'Ms. Anita', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIGHT_FM, jobTitle: 'General Manager' },
        { id: 'u3', name: 'Mubarak Sani', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_UAS, jobTitle: 'General Manager' },
        { id: 'u4', name: 'Mr. Junaid Raza', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.LUFTREIBER_AUTO, jobTitle: 'Director' },
        { id: 'u5', name: 'Mr. Monday Apeh', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_ATLANTIC, jobTitle: 'General Manager' },
        { id: 'u7', name: 'Mr. Giwa Ayodele', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_ATLANTIC, jobTitle: 'Deputy General Manager' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent tracking-tight mb-2">Lumethis</h1>
                    <p className="text-slate-500">Select a role to simulate Role-Based Access Control (RBAC)</p>
                </div>

                <div className="space-y-3">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => onLogin(role)}
                            className={`w-full p-4 rounded-xl border flex items-center transition-all ${
                                role.role === 'GROUP_ADMIN' 
                                    ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' 
                                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                        >
                            <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${role.role === 'GROUP_ADMIN' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                {role.role === 'GROUP_ADMIN' ? <Shield size={20} /> : <UserCircle size={20} />}
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="font-bold text-slate-800 truncate">{role.name}</p>
                                <p className="text-xs text-slate-500 font-medium truncate">
                                    {role.jobTitle || role.subsidiary}
                                </p>
                                {role.subsidiary && role.jobTitle && (
                                    <p className="text-[10px] text-slate-400 truncate">{role.subsidiary}</p>
                                )}
                            </div>
                            <LogIn size={16} className="ml-auto text-slate-300 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  if (!currentUser) {
      return <LoginScreen onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return <NeedsAssessment />;
      case 'strategy':
        return <AIStrategist />;
      case 'training':
        return <TrainingManager user={currentUser} />;
      case 'budget':
        return <BudgetManager />;
      case 'reports':
        return <Placeholder title="Group Reporting & Analytics" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        onLogout={() => setCurrentUser(null)}
      />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="flex items-center space-x-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${currentUser.role === 'GROUP_ADMIN' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                <p className="text-slate-500 text-sm">
                    {currentUser.jobTitle ? `${currentUser.jobTitle} View` : (currentUser.role === 'GROUP_ADMIN' ? 'Group Control View' : `${currentUser.subsidiary} View`)}
                </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
             {currentUser.role === 'GROUP_ADMIN' && (
                <button className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                    <span>Scope: All Subsidiaries</span>
                </button>
             )}
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