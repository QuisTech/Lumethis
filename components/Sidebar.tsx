import React from 'react';
import { LayoutDashboard, GraduationCap, DollarSign, BrainCircuit, Building2, PieChart, ClipboardList } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assessment', label: 'Diagnostic Pulse', icon: ClipboardList },
    { id: 'strategy', label: 'AI Strategist', icon: BrainCircuit },
    { id: 'training', label: 'Training Programs', icon: GraduationCap },
    { id: 'budget', label: 'Budget & Cost', icon: DollarSign },
    { id: 'assets', label: 'Assets & Admin', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent tracking-tight">Lumethis</h1>
        <p className="text-xs text-slate-400 mt-1 tracking-widest">EIB GROUP CONTROL</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-200 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? "text-amber-300" : ""} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold">System Status</p>
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
            <span className="text-sm text-slate-200">Gemini 3.0 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;