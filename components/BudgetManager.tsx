import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { BudgetRecord } from '../types';

const budgetData: BudgetRecord[] = [
  { category: 'External Vendors', allocated: 50000, spent: 42000, variance: 8000 },
  { category: 'Digital Learning Tools', allocated: 15000, spent: 12500, variance: 2500 },
  { category: 'Venues & Catering', allocated: 20000, spent: 22000, variance: -2000 },
  { category: 'Staff Onboarding', allocated: 10000, spent: 4000, variance: 6000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6'];

const BudgetManager: React.FC = () => {
  const totalBudget = budgetData.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = budgetData.reduce((acc, curr) => acc + curr.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Summary Card */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <h3 className="text-slate-500 font-medium text-sm">Total Annual Budget</h3>
            <div className="text-4xl font-bold text-slate-800 mt-2">${totalBudget.toLocaleString()}</div>
            <div className="mt-6 flex items-center space-x-4">
                <div>
                    <span className="text-xs text-slate-400 block">SPENT</span>
                    <span className="text-lg font-bold text-rose-600">${totalSpent.toLocaleString()}</span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <div>
                    <span className="text-xs text-slate-400 block">REMAINING</span>
                    <span className="text-lg font-bold text-emerald-600">${remaining.toLocaleString()}</span>
                </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(totalSpent/totalBudget)*100}%`}}></div>
            </div>
        </div>

        {/* Visual Distribution */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[300px]">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Cost Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="spent"
                    >
                        {budgetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Variance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Budget Variance Report (Forecast vs Actual)</h3>
        </div>
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Allocated</th>
                    <th className="px-6 py-4">Actual Spend</th>
                    <th className="px-6 py-4">Variance</th>
                    <th className="px-6 py-4">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {budgetData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{item.category}</td>
                        <td className="px-6 py-4 text-slate-600">${item.allocated.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600">${item.spent.toLocaleString()}</td>
                        <td className={`px-6 py-4 font-bold ${item.variance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {item.variance < 0 ? '-' : '+'}${Math.abs(item.variance).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                            {item.variance < 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                    <AlertTriangle size={12} className="mr-1"/> Overrun
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    <TrendingDown size={12} className="mr-1"/> Efficient
                                </span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetManager;