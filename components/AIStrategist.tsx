import React, { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Target, Clock, ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react';
import { generateTrainingStrategy, analyzeSkillGap } from '../services/geminiService';
import { AIPlanResponse } from '../types';

const AIStrategist: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'analyze'>('create');
  
  // Generation State
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AIPlanResponse | null>(null);

  // Analysis State
  const [role, setRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const handleGenerate = async () => {
    if (!topic || !audience) return;
    setLoading(true);
    const plan = await generateTrainingStrategy(topic, audience, duration);
    setGeneratedPlan(plan);
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!role || !currentSkills) return;
    setLoading(true);
    const result = await analyzeSkillGap(role, currentSkills, goal);
    setAnalysisResult(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-xl p-8 text-white shadow-xl shadow-orange-200/50 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-[-20px] right-[-20px] opacity-20 rotate-12">
            <Sparkles size={150} />
        </div>

        <div className="flex items-center space-x-3 mb-3 relative z-10">
          <Lightbulb className="text-yellow-200 fill-yellow-200 animate-pulse" size={32} />
          <h2 className="text-3xl font-bold tracking-tight">Strategic Illumination Hub</h2>
        </div>
        <p className="text-orange-50 max-w-2xl font-medium text-lg relative z-10 leading-relaxed">
          Ignite workforce potential with <strong>SFIA-aligned</strong> pathways. Design structured curriculums or shed light on critical skill gaps using the global standard.
        </p>
        
        <div className="flex space-x-4 mt-8 relative z-10">
          <button 
            onClick={() => setActiveMode('create')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'create' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Curriculum Builder
          </button>
          <button 
            onClick={() => setActiveMode('analyze')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'analyze' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            SFIA Gap Analyzer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            {activeMode === 'create' ? <BookOpen className="mr-2 text-orange-500" size={20}/> : <Target className="mr-2 text-orange-500" size={20}/>}
            {activeMode === 'create' ? 'Program Parameters' : 'SFIA Analysis Context'}
          </h3>
          
          {activeMode === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Training Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder="e.g., Advanced Project Management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Target Audience</label>
                <input 
                  type="text" 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder="e.g., Subsidiary Operations Managers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                >
                  <option value="">Select Duration...</option>
                  <option value="Half Day">Half Day (4 Hours)</option>
                  <option value="Full Day">Full Day (8 Hours)</option>
                  <option value="3 Days">3 Days Intensive</option>
                  <option value="1 Week">1 Week Program</option>
                </select>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                <span>Generate Strategy</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Job Role</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder="e.g., Customer Service Supervisor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Observed Skills / Issues</label>
                <textarea 
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none transition-shadow"
                  placeholder="e.g., Good technical knowledge but struggles with conflict resolution and team motivation."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Business Goal</label>
                <input 
                  type="text" 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder="e.g., Improve customer retention by 15%"
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={loading || !role}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Target size={18} />}
                <span>Analyze Gaps</span>
              </button>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full overflow-y-auto max-h-[600px] shadow-inner">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-orange-500" />
              <p className="font-medium text-slate-500">Consulting SFIA Framework Models...</p>
            </div>
          ) : activeMode === 'create' && generatedPlan ? (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600">
                        {generatedPlan.title}
                    </h2>
                    <span className="bg-slate-800 text-white text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">SFIA Aligned</span>
                </div>
                <p className="text-slate-600 mt-2 leading-relaxed">{generatedPlan.overview}</p>
              </div>
              <div className="space-y-4">
                {generatedPlan.modules.map((mod, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <h4 className="font-bold text-slate-800 flex items-center text-lg">
                        <span className="bg-orange-100 text-orange-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mr-3 border border-orange-200">{idx + 1}</span>
                        {mod.name}
                      </h4>
                      <div className="flex space-x-2">
                        <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            <Clock size={12} className="mr-1.5" />
                            {mod.duration}
                        </div>
                        {mod.sfiaLevel && (
                            <div className="flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <ShieldCheck size={12} className="mr-1.5" />
                                {mod.sfiaLevel}
                            </div>
                        )}
                      </div>
                    </div>
                    <ul className="pl-10 space-y-2 mt-3">
                      {mod.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <ArrowRight size={14} className="mr-2 mt-1 text-orange-500 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 border-2 border-orange-600 text-orange-700 font-bold rounded-lg hover:bg-orange-50 transition-colors">
                Save to Training Calendar
              </button>
            </div>
          ) : activeMode === 'analyze' && analysisResult ? (
            <div className="prose prose-slate max-w-none animate-fade-in">
                <div className="flex items-center mb-6">
                    <div className="bg-rose-100 p-2 rounded-lg mr-3">
                        <Target className="text-rose-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 m-0">SFIA Gap Analysis Report</h3>
                        <p className="text-xs text-slate-400 font-medium">AUTONOMY • INFLUENCE • COMPLEXITY</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                        {analysisResult}
                    </div>
                </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                 <Sparkles className="w-10 h-10 text-slate-300" />
              </div>
              <p className="font-medium text-center max-w-xs">
                  Strategic insights will illuminate here, powered by the <br/><span className="text-blue-500 font-bold">SFIA Framework</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStrategist;