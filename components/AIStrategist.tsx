import React, { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Target, Clock, ArrowRight, Lightbulb, ShieldCheck, BarChart3, TrendingUp, UserPlus, CheckCircle2, Download } from 'lucide-react';
import { generateTrainingStrategy, analyzeSkillGap, generateKPIs, generatePDP, generateTeachingNotes } from '../services/geminiService';
import { AIPlanResponse, KPIPlan, PDPPlan, TeachingNotes } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Markdown from 'react-markdown';

const AIStrategist: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'analyze' | 'kpi' | 'pdp'>('create');
  
  // Generation State
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<AIPlanResponse | null>(null);

  // Analysis State
  const [role, setRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string>('');

  // KPI State
  const [kpiLevel, setKpiLevel] = useState('Subsidiary');
  const [entityName, setEntityName] = useState('');
  const [strategicFocus, setStrategicFocus] = useState('');
  const [generatedKPIs, setGeneratedKPIs] = useState<KPIPlan | null>(null);

  // PDP State
  const [pdpRole, setPdpRole] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [timeframe, setTimeframe] = useState('6 Months');
  const [generatedPDP, setGeneratedPDP] = useState<PDPPlan | null>(null);

  // Teaching Notes State
  const [generatedTeachingNotes, setGeneratedTeachingNotes] = useState<TeachingNotes | null>(null);
  const [notesContent, setNotesContent] = useState('');
  const [notesMode, setNotesMode] = useState('Curriculum');

  const handleModeChange = (mode: 'create' | 'analyze' | 'kpi' | 'pdp') => {
    setActiveMode(mode);
    setGeneratedTeachingNotes(null);
    setNotesContent('');
    if (mode === 'create') setNotesMode('Curriculum');
    if (mode === 'analyze') setNotesMode('Gap Analysis');
    if (mode === 'kpi') setNotesMode('KPI');
    if (mode === 'pdp') setNotesMode('PDP');
  };

  const handleGenerate = async () => {
    if (!topic || !audience) return;
    setLoading(true);
    setError(null);
    try {
      const plan = await generateTrainingStrategy(topic, audience, duration);
      if (plan) {
        setGeneratedPlan(plan);
      } else {
        setError("Failed to generate curriculum. The AI returned an empty response.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!role || !currentSkills) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSkillGap(role, currentSkills, goal);
      if (result) {
        setAnalysisResult(result);
      } else {
        setError("Failed to analyze skill gaps.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKPIs = async () => {
    if (!entityName || !strategicFocus) return;
    setLoading(true);
    setError(null);
    try {
      const kpis = await generateKPIs(kpiLevel, entityName, strategicFocus);
      if (kpis) {
        setGeneratedKPIs(kpis);
      } else {
        setError("Failed to generate KPIs.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during KPI generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDP = async () => {
    if (!pdpRole || !careerGoal) return;
    setLoading(true);
    setError(null);
    try {
      const pdp = await generatePDP(pdpRole, careerGoal, timeframe);
      if (pdp) {
        setGeneratedPDP(pdp);
      } else {
        setError("Failed to generate PDP.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during PDP generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotes = async (sourceContent: string, sourceType: string) => {
    setLoading(true);
    setError(null);
    try {
      const notes = await generateTeachingNotes(sourceContent, sourceType);
      if (notes) {
        setGeneratedTeachingNotes(notes);
      } else {
        setError("Failed to generate teaching notes.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during note generation.");
    } finally {
      setLoading(false);
    }
  };

  const renderNotesSection = () => {
    if (!generatedTeachingNotes) return null;
    return (
      <div className="mt-8 space-y-6 animate-fade-in">
        <div id="notes-report" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div id="notes-header" className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {generatedTeachingNotes.title}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teaching Strategy & Notes</span>
          </div>
          
          <div id="notes-intro">
            <p className="text-slate-600 leading-relaxed">{generatedTeachingNotes.introduction}</p>
          </div>

          <div id="notes-concepts" className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center">
              <Lightbulb size={16} className="mr-2 text-amber-500" />
              Key Concepts
            </h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
              {generatedTeachingNotes.keyConcepts.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          <div id="notes-questions">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center">
              <Target size={16} className="mr-2 text-blue-500" />
              Discussion Questions
            </h4>
            <ul className="list-decimal list-inside text-slate-600 space-y-2 text-sm">
              {generatedTeachingNotes.discussionQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>

          <div id="notes-summary" className="border-t border-slate-100 pt-4">
            <p className="text-slate-600 italic text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="font-bold not-italic block mb-1 text-blue-800">Summary</span>
              {generatedTeachingNotes.summary}
            </p>
          </div>
        </div>

        <button 
          onClick={() => handleDownloadPDF('notes')}
          disabled={isDownloading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Download size={18} className="mr-2" />}
          Export Teaching Notes (PDF)
        </button>
      </div>
    );
  };

  const renderTeachingNotesInput = () => {
    return (
      <div className="mt-8 pt-8 border-t border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <BookOpen className="mr-2 text-blue-600" size={20} />
          Generate Teaching Notes
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Generation Mode</label>
            <select 
              value={notesMode}
              onChange={(e) => setNotesMode(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            >
              <option value="Curriculum">Curriculum Builder</option>
              <option value="Gap Analysis">SFIA Gap Analyzer</option>
              <option value="KPI">KPI & Goal Setter</option>
              <option value="PDP">CPD & PDP Architect</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Source Content</label>
            <textarea 
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none transition-shadow"
              placeholder="Paste the generated report content here to create teaching notes..."
            />
          </div>
          
          <button 
            onClick={() => handleGenerateNotes(notesContent, notesMode)}
            disabled={loading || !notesContent}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            <span>Synthesize Teaching Notes</span>
          </button>
        </div>
      </div>
    );
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async (type: 'main' | 'notes' = 'main') => {
    let reportId = '';
    let sections: string[] = [];
    let filename = '';

    if (type === 'notes' && generatedTeachingNotes) {
      reportId = 'notes-report';
      sections = ['notes-header', 'notes-intro', 'notes-concepts', 'notes-questions', 'notes-summary'];
      filename = `Teaching_Notes_${generatedTeachingNotes.title.replace(/\s+/g, '_')}.pdf`;
    } else if (activeMode === 'create' && generatedPlan) {
      reportId = 'curriculum-report';
      sections = ['curriculum-header', 'curriculum-overview', 'curriculum-modules-header'];
      generatedPlan.modules.forEach((_, idx) => sections.push(`curriculum-module-${idx}`));
      filename = `Curriculum_${generatedPlan.title.replace(/\s+/g, '_')}.pdf`;
    } else if (activeMode === 'analyze' && analysisResult) {
      reportId = 'gap-report';
      sections = ['gap-header', 'gap-content'];
      filename = `SFIA_Gap_Analysis_${role.replace(/\s+/g, '_')}.pdf`;
    } else if (activeMode === 'kpi' && generatedKPIs) {
      reportId = 'kpi-report';
      sections = ['kpi-header'];
      generatedKPIs.kpis.forEach((_, idx) => sections.push(`kpi-item-${idx}`));
      filename = `KPI_Scorecard_${generatedKPIs.level.replace(/\s+/g, '_')}.pdf`;
    } else if (activeMode === 'pdp' && generatedPDP) {
      reportId = 'pdp-report';
      sections = ['pdp-header', 'pdp-strengths', 'pdp-actions-header'];
      generatedPDP.actionPlan.forEach((_, idx) => sections.push(`pdp-action-${idx}`));
      sections.push('pdp-cpd');
      filename = `PDP_${generatedPDP.currentRole.replace(/\s+/g, '_')}.pdf`;
    }

    if (!reportId) return;

    setIsDownloading(true);
    
    // Give UI time to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let currentY = margin;

      for (const sectionId of sections) {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) continue;

        const canvas = await html2canvas(sectionElement, {
          scale: 2,
          logging: false,
          backgroundColor: '#ffffff',
          useCORS: true,
          onclone: (clonedDoc) => {
            // Copy font link
            const fontLink = clonedDoc.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            fontLink.rel = 'stylesheet';
            clonedDoc.head.appendChild(fontLink);

            // Copy style
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
            `;
            clonedDoc.head.appendChild(style);
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const componentWidth = pdfWidth - (margin * 2);
        const componentHeight = (canvas.height * componentWidth) / canvas.width;
        const pdfPageContentHeight = pdfHeight - (margin * 2);

        // Check if component is larger than a single page
        if (componentHeight > pdfPageContentHeight) {
             // Slicing logic
             if (currentY > margin) {
                pdf.addPage();
                currentY = margin;
             }
             
             let heightLeft = componentHeight;
             let position = 0; 
             
             while (heightLeft > 0) {
                const heightToPrint = Math.min(heightLeft, pdfPageContentHeight);
                
                // Calculate source coordinates
                const sourceY = (position / componentHeight) * canvas.height;
                const sourceH = (heightToPrint / componentHeight) * canvas.height;
                
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sourceH;
                
                const ctx = sliceCanvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
                    ctx.drawImage(
                        canvas,
                        0, sourceY, canvas.width, sourceH,
                        0, 0, sliceCanvas.width, sliceCanvas.height
                    );
                    
                    const sliceImgData = sliceCanvas.toDataURL('image/png');
                    pdf.addImage(sliceImgData, 'PNG', margin, margin, componentWidth, heightToPrint);
                }
                
                heightLeft -= heightToPrint;
                position += heightToPrint;
                
                if (heightLeft > 0) {
                    pdf.addPage();
                    currentY = margin;
                } else {
                    currentY = margin + heightToPrint + 10;
                }
             }
        } else {
            // Standard logic
            if (currentY + componentHeight > pdfHeight - margin) {
              pdf.addPage();
              currentY = margin;
            }
    
            pdf.addImage(imgData, 'PNG', margin, currentY, componentWidth, componentHeight);
            currentY += componentHeight + 10;
        }
      }
      
      // Add Footer with Page Numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
        pdf.text(`Generated by Lumethis AI Strategist on ${new Date().toLocaleDateString()}`, margin, pdfHeight - 10);
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
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
          Ignite workforce potential with <strong>SFIA-aligned</strong> pathways. Design structured curriculums, shed light on critical skill gaps, define <strong>KPIs</strong>, or build <strong>PDPs & CPD</strong> plans.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-8 relative z-10">
          <button 
            onClick={() => handleModeChange('create')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'create' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Curriculum Builder
          </button>
          <button 
            onClick={() => handleModeChange('analyze')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'analyze' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            SFIA Gap Analyzer
          </button>
          <button 
            onClick={() => handleModeChange('kpi')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg flex items-center ${
              activeMode === 'kpi' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            <BarChart3 size={16} className="mr-2" />
            KPI & Goal Setter
          </button>
          <button 
            onClick={() => handleModeChange('pdp')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg flex items-center ${
              activeMode === 'pdp' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            <UserPlus size={16} className="mr-2" />
            CPD & PDP Architect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            {activeMode === 'create' && <BookOpen className="mr-2 text-orange-500" size={20}/>}
            {activeMode === 'analyze' && <Target className="mr-2 text-orange-500" size={20}/>}
            {activeMode === 'kpi' && <TrendingUp className="mr-2 text-orange-500" size={20}/>}
            {activeMode === 'pdp' && <UserPlus className="mr-2 text-orange-500" size={20}/>}
            
            {activeMode === 'create' && 'Program Parameters'}
            {activeMode === 'analyze' && 'SFIA Analysis Context'}
            {activeMode === 'kpi' && 'KPI Configuration'}
            {activeMode === 'pdp' && 'Development Plan Context'}
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
              {renderTeachingNotesInput()}
            </div>
          ) : activeMode === 'analyze' ? (
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
              {renderTeachingNotesInput()}
            </div>
          ) : activeMode === 'kpi' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Target Level</label>
                <select 
                  value={kpiLevel}
                  onChange={(e) => setKpiLevel(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                >
                  <option value="Subsidiary">Subsidiary (Company Level)</option>
                  <option value="Unit/Department">Unit / Department</option>
                  <option value="Manager">Manager / Team Lead</option>
                  <option value="Individual Staff">Individual Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Entity Name / Role</label>
                <input 
                  type="text" 
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder={kpiLevel === 'Subsidiary' ? "e.g., Bright FM" : "e.g., Sales Manager"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Strategic Focus / Goal</label>
                <textarea 
                  value={strategicFocus}
                  onChange={(e) => setStrategicFocus(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none transition-shadow"
                  placeholder="e.g., Increase market share by 20% and improve operational efficiency."
                />
              </div>
              <button 
                onClick={handleGenerateKPIs}
                disabled={loading || !entityName}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <BarChart3 size={18} />}
                <span>Generate SMART KPIs</span>
              </button>
              {renderTeachingNotesInput()}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Current Role</label>
                <input 
                  type="text" 
                  value={pdpRole}
                  onChange={(e) => setPdpRole(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder="e.g., Junior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Career Aspiration / Goal</label>
                <input 
                  type="text" 
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                  placeholder="e.g., Senior Tech Lead"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Plan Timeframe</label>
                <select 
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                >
                  <option value="3 Months">3 Months (Sprint)</option>
                  <option value="6 Months">6 Months (Standard)</option>
                  <option value="1 Year">1 Year (Long Term)</option>
                  <option value="2 Years">2 Years (Strategic)</option>
                </select>
              </div>
              <button 
                onClick={handleGeneratePDP}
                disabled={loading || !pdpRole}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                <span>Design PDP & CPD Plan</span>
              </button>
              {renderTeachingNotesInput()}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full overflow-y-auto max-h-[600px] shadow-inner">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 animate-fade-in">
              <ShieldCheck className="text-rose-500 mt-0.5 flex-shrink-0" size={18} />
              <div className="flex-1">
                <p className="font-bold text-sm">Generation Error</p>
                <p className="text-xs mt-1">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-orange-500" />
              <p className="font-medium text-slate-500">
                {activeMode === 'kpi' ? 'Formulating SMART Goals...' : 
                  activeMode === 'pdp' ? 'Architecting Career Pathway...' :
                  'Consulting SFIA Framework Models...'}
              </p>
            </div>
          ) : activeMode === 'create' && generatedPlan ? (
            <div className="space-y-6 animate-fade-in">
              <div id="curriculum-report" className="p-6 bg-white rounded-xl shadow-sm">
                <div id="curriculum-header" className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600">
                          {generatedPlan.title}
                      </h2>
                      <span className="bg-slate-800 text-white text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">SFIA Aligned</span>
                  </div>
                  <div id="curriculum-overview">
                    <p className="text-slate-600 mt-2 leading-relaxed">{generatedPlan.overview}</p>
                  </div>
                </div>
                <div id="curriculum-modules-header">
                  <h3 className="font-bold text-slate-800 mt-6 mb-4">Training Modules</h3>
                </div>
                <div className="space-y-4 mt-6">
                  {generatedPlan.modules?.map((mod, idx) => (
                    <div id={`curriculum-module-${idx}`} key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
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
                        {mod.objectives?.map((obj, i) => (
                          <li key={i} className="flex items-start text-sm text-slate-600">
                            <ArrowRight size={14} className="mr-2 mt-1 text-orange-500 flex-shrink-0" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleGenerateNotes(JSON.stringify(generatedPlan), 'Curriculum')}
                  className="py-3 border-2 border-blue-600 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <BookOpen size={18} className="mr-2" />
                  Generate Teaching Notes
                </button>
                <button 
                  onClick={() => handleDownloadPDF()}
                  disabled={isDownloading}
                  className="py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Download size={18} className="mr-2" />}
                  Export Curriculum (PDF)
                </button>
              </div>
              {renderNotesSection()}
            </div>
          ) : activeMode === 'analyze' && analysisResult ? (
            <div className="space-y-6 animate-fade-in">
              <div id="gap-report" className="p-6 bg-white rounded-xl shadow-sm">
                  <div id="gap-header" className="flex items-center mb-6 border-b border-slate-100 pb-4">
                      <div className="bg-rose-100 p-2 rounded-lg mr-3">
                          <Target className="text-rose-600" size={24} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 m-0">SFIA Gap Analysis Report</h3>
                          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Autonomy • Influence • Complexity • Knowledge</p>
                      </div>
                  </div>
                  <div id="gap-content" className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed markdown-container">
                      <Markdown>{analysisResult}</Markdown>
                  </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleGenerateNotes(analysisResult, 'Gap Analysis')}
                  className="py-3 border-2 border-blue-600 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <BookOpen size={18} className="mr-2" />
                  Generate Teaching Notes
                </button>
                <button 
                  onClick={() => handleDownloadPDF()}
                  disabled={isDownloading}
                  className="py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Download size={18} className="mr-2" />}
                  Download Analysis Report (PDF)
                </button>
              </div>
              {renderNotesSection()}
            </div>
          ) : activeMode === 'kpi' && generatedKPIs ? (
            <div className="space-y-6 animate-fade-in">
              <div id="kpi-report" className="p-4 bg-white rounded-xl">
                <div id="kpi-header" className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600">
                          {generatedKPIs.title || 'Strategic KPI Plan'}
                      </h2>
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider border border-emerald-200">
                          {generatedKPIs.level || 'Organization'}
                      </span>
                  </div>
                  <p className="text-slate-600 mt-2 text-sm italic">Focus: {generatedKPIs.strategicFocus || 'Strategic Growth'}</p>
                </div>
                
                <div className="space-y-4 mt-4">
                  {generatedKPIs.kpis && generatedKPIs.kpis.length > 0 ? (
                    generatedKPIs.kpis.map((kpi, idx) => (
                      <div id={`kpi-item-${idx}`} key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                {kpi.area || 'General'}
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {kpi.measurementFrequency || 'Ongoing'}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-2">{kpi.kpi || 'KPI Indicator'}</h4>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Target</p>
                                <p className="font-bold text-emerald-600">{kpi.target || 'TBD'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Owner</p>
                                <p className="font-bold text-slate-700 text-sm">{kpi.owner || 'Unassigned'}</p>
                            </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-slate-500">
                      <p>No KPIs generated. Please try refining your strategic focus.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleGenerateNotes(JSON.stringify(generatedKPIs), 'KPI')}
                  className="py-3 border-2 border-blue-600 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <BookOpen size={18} className="mr-2" />
                  Generate Teaching Notes
                </button>
                <button 
                  onClick={() => handleDownloadPDF()}
                  disabled={isDownloading}
                  className="py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Download size={18} className="mr-2" />}
                  Export KPI Scorecard (PDF)
                </button>
              </div>
              {renderNotesSection()}
            </div>
          ) : activeMode === 'pdp' && generatedPDP ? (
            <div className="space-y-6 animate-fade-in">
              <div id="pdp-report" className="p-4 bg-white rounded-xl">
                <div id="pdp-header" className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between items-start">
                      <div>
                          <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600">
                              Personal Development Plan
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">
                              {generatedPDP.currentRole || 'Current Role'} <ArrowRight size={12} className="inline mx-1"/> <span className="font-bold text-slate-700">{generatedPDP.careerGoal || 'Future Goal'}</span>
                          </p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider border border-blue-200">
                          PDP & CPD
                      </span>
                  </div>
                </div>

                {/* Strengths & Areas */}
                <div id="pdp-strengths" className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-700 uppercase mb-2">Key Strengths to Leverage</h4>
                      <ul className="list-disc list-inside text-xs text-emerald-900 space-y-1">
                          {generatedPDP.strengths && generatedPDP.strengths.length > 0 ? (
                            generatedPDP.strengths.map((s, i) => <li key={i}>{s}</li>)
                          ) : (
                            <li>Strengths analysis pending...</li>
                          )}
                      </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <h4 className="text-xs font-bold text-amber-700 uppercase mb-2">Development Areas</h4>
                      <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                          {generatedPDP.developmentAreas && generatedPDP.developmentAreas.length > 0 ? (
                            generatedPDP.developmentAreas.map((s, i) => <li key={i}>{s}</li>)
                          ) : (
                            <li>Development areas pending...</li>
                          )}
                      </ul>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="mt-6">
                  <h3 id="pdp-actions-header" className="font-bold text-slate-800 mb-3 flex items-center">
                      <CheckCircle2 size={18} className="mr-2 text-orange-500"/>
                      Action Plan
                  </h3>
                  <div className="space-y-3">
                      {generatedPDP.actionPlan && generatedPDP.actionPlan.length > 0 ? (
                        generatedPDP.actionPlan.map((action, idx) => (
                          <div id={`pdp-action-${idx}`} key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                      {action.category || 'General'}
                                  </span>
                                  <span className="text-[10px] font-bold text-orange-600">
                                      {action.timeline || 'TBD'}
                                  </span>
                              </div>
                              <p className="font-bold text-slate-800 text-sm mb-1">{action.action || 'Action Item'}</p>
                              <p className="text-xs text-slate-500 italic">Success: {action.successCriteria || 'Completion'}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 text-slate-400 italic text-sm">No specific actions generated.</div>
                      )}
                  </div>
                </div>

                {/* CPD Recommendations */}
                <div id="pdp-cpd" className="bg-slate-800 text-white p-5 rounded-xl mt-6">
                  <h3 className="font-bold mb-3 flex items-center text-amber-400">
                      <Sparkles size={18} className="mr-2"/>
                      Recommended CPD Focus
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">Log hours in these areas to support your growth:</p>
                  <div className="flex flex-wrap gap-2">
                      {generatedPDP.cpdRecommendations && generatedPDP.cpdRecommendations.length > 0 ? (
                        generatedPDP.cpdRecommendations.map((rec, i) => (
                          <span key={i} className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                              {rec}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No specific CPD recommendations.</span>
                      )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleGenerateNotes(JSON.stringify(generatedPDP), 'PDP')}
                  className="py-3 border-2 border-blue-600 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <BookOpen size={18} className="mr-2" />
                  Generate Teaching Notes
                </button>
                <button 
                  onClick={() => handleDownloadPDF()}
                  disabled={isDownloading}
                  className="py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Download size={18} className="mr-2" />}
                  Export PDP Document (PDF)
                </button>
              </div>
              {renderNotesSection()}
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

      {/* Hidden Reports for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '794px', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
        
        {/* Curriculum Report */}
        {generatedPlan && (
          <div id="curriculum-report">
            <div id="curriculum-header" style={{ padding: '40px', borderBottom: '2px solid #ea580c', marginBottom: '20px' }}>
              <h1 style={{ color: '#ea580c', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{generatedPlan.title}</h1>
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px', color: '#64748b', fontSize: '14px' }}>
                <p style={{ margin: 0 }}><strong>Topic:</strong> {topic}</p>
                <p style={{ margin: 0 }}><strong>Audience:</strong> {audience}</p>
                <p style={{ margin: 0 }}><strong>Duration:</strong> {duration}</p>
              </div>
            </div>
            <div id="curriculum-overview" style={{ padding: '0 40px 30px 40px' }}>
               <h2 style={{ color: '#ea580c', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>Program Overview</h2>
               <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>{generatedPlan.overview}</p>
            </div>
            <div id="curriculum-modules" style={{ padding: '0 40px 40px 40px' }}>
               <h2 id="curriculum-modules-header" style={{ color: '#ea580c', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Training Modules</h2>
               {generatedPlan.modules.map((mod, idx) => (
                 <div id={`curriculum-module-${idx}`} key={idx} style={{ marginBottom: '25px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#fff7ed', padding: '15px', borderBottom: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <h3 style={{ margin: 0, color: '#9a3412', fontSize: '16px', fontWeight: 'bold' }}>Module {idx + 1}: {mod.name}</h3>
                       <span style={{ fontSize: '12px', backgroundColor: '#fff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #fed7aa', color: '#ea580c' }}>{mod.duration}</span>
                    </div>
                    <div style={{ padding: '20px' }}>
                       {mod.sfiaLevel && (
                         <div style={{ marginBottom: '15px', display: 'inline-block', fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '12px' }}>
                            SFIA Level: {mod.sfiaLevel}
                         </div>
                       )}
                       <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {mod.objectives.map((obj, i) => (
                            <li key={i} style={{ color: '#475569', fontSize: '14px', marginBottom: '5px' }}>{obj}</li>
                          ))}
                       </ul>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Gap Analysis Report */}
        {analysisResult && (
          <div id="gap-report">
             <div id="gap-header" style={{ padding: '40px', borderBottom: '2px solid #e11d48', marginBottom: '30px' }}>
                <h1 style={{ color: '#e11d48', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>SFIA Gap Analysis Report</h1>
                <div style={{ display: 'flex', gap: '30px', marginTop: '15px', color: '#64748b', fontSize: '14px' }}>
                  <p style={{ margin: 0 }}><strong>Role:</strong> {role}</p>
                  <p style={{ margin: 0 }}><strong>Goal:</strong> {goal}</p>
                </div>
             </div>
             <div id="gap-content" style={{ padding: '0 40px 40px 40px' }}>
                {/* We render markdown inside a div with specific styles to emulate prose */}
                <div style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>
                   <Markdown 
                     components={{
                       h1: ({node, ...props}) => <h1 style={{ color: '#0f172a', fontSize: '24px', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }} {...props} />,
                       h2: ({node, ...props}) => <h2 style={{ color: '#334155', fontSize: '20px', fontWeight: 'bold', marginTop: '18px', marginBottom: '10px' }} {...props} />,
                       h3: ({node, ...props}) => <h3 style={{ color: '#475569', fontSize: '18px', fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }} {...props} />,
                       ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '15px' }} {...props} />,
                       li: ({node, ...props}) => <li style={{ marginBottom: '5px' }} {...props} />,
                       p: ({node, ...props}) => <p style={{ marginBottom: '10px' }} {...props} />,
                       strong: ({node, ...props}) => <strong style={{ color: '#0f172a', fontWeight: 'bold' }} {...props} />,
                     }}
                   >
                     {analysisResult}
                   </Markdown>
                </div>
             </div>
          </div>
        )}

        {/* KPI Report */}
        {generatedKPIs && (
          <div id="kpi-report">
             <div id="kpi-header" style={{ padding: '40px', borderBottom: '2px solid #059669', marginBottom: '30px' }}>
                <h1 style={{ color: '#059669', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{generatedKPIs.title}</h1>
                <div style={{ marginTop: '15px', color: '#64748b', fontSize: '14px' }}>
                   <p style={{ margin: 0, marginBottom: '5px' }}><strong>Level:</strong> {generatedKPIs.level}</p>
                   <p style={{ margin: 0 }}><strong>Strategic Focus:</strong> {generatedKPIs.strategicFocus}</p>
                </div>
             </div>
             <div id="kpi-list" style={{ padding: '0 40px 40px 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                   {generatedKPIs.kpis.map((kpi, idx) => (
                      <div id={`kpi-item-${idx}`} key={idx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.area}</span>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>{kpi.measurementFrequency}</span>
                         </div>
                         <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 15px 0' }}>{kpi.kpi}</h3>
                         <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                            <div>
                               <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Target</div>
                               <div style={{ fontSize: '16px', color: '#059669', fontWeight: 'bold' }}>{kpi.target}</div>
                            </div>
                            <div>
                               <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Owner</div>
                               <div style={{ fontSize: '16px', color: '#334155', fontWeight: 'bold' }}>{kpi.owner}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* PDP Report */}
        {generatedPDP && (
          <div id="pdp-report">
             <div id="pdp-header" style={{ padding: '40px', borderBottom: '2px solid #2563eb', marginBottom: '30px' }}>
                <h1 style={{ color: '#2563eb', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Personal Development Plan</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', color: '#64748b', fontSize: '16px' }}>
                   <span>{generatedPDP.currentRole}</span>
                   <span>→</span>
                   <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{generatedPDP.careerGoal}</span>
                </div>
             </div>
             
             <div id="pdp-strengths" style={{ padding: '0 40px 30px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                   <h3 style={{ color: '#047857', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Key Strengths</h3>
                   <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#064e3b' }}>
                      {generatedPDP.strengths.map((s, i) => <li key={i} style={{ marginBottom: '5px' }}>{s}</li>)}
                   </ul>
                </div>
                <div style={{ backgroundColor: '#fffbeb', padding: '20px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                   <h3 style={{ color: '#b45309', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Development Areas</h3>
                   <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#78350f' }}>
                      {generatedPDP.developmentAreas.map((s, i) => <li key={i} style={{ marginBottom: '5px' }}>{s}</li>)}
                   </ul>
                </div>
             </div>

             <div id="pdp-actions" style={{ padding: '0 40px 30px 40px' }}>
                <h2 id="pdp-actions-header" style={{ color: '#2563eb', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Action Plan</h2>
                <div style={{ display: 'grid', gap: '15px' }}>
                   {generatedPDP.actionPlan.map((action, idx) => (
                      <div id={`pdp-action-${idx}`} key={idx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{action.category}</span>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ea580c' }}>{action.timeline}</span>
                         </div>
                         <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>{action.action}</p>
                         <p style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>Success: {action.successCriteria}</p>
                      </div>
                   ))}
                </div>
             </div>

             <div id="pdp-cpd" style={{ padding: '0 40px 40px 40px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px', color: '#fff' }}>
                   <h3 style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px 0' }}>CPD Recommendations</h3>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {generatedPDP.cpdRecommendations.map((rec, i) => (
                         <span key={i} style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px' }}>{rec}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Teaching Notes Report */}
        {generatedTeachingNotes && (
          <div id="notes-report">
            <div id="notes-header" style={{ padding: '40px', borderBottom: '2px solid #2563eb', marginBottom: '20px' }}>
              <h1 style={{ color: '#2563eb', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{generatedTeachingNotes.title}</h1>
              <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Teaching Strategy & Notes</p>
            </div>
            
            <div id="notes-intro" style={{ padding: '0 40px 30px 40px' }}>
              <h2 style={{ color: '#2563eb', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>Introduction</h2>
              <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>{generatedTeachingNotes.introduction}</p>
            </div>

            <div id="notes-concepts" style={{ padding: '0 40px 30px 40px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1e293b', fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Key Concepts</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569' }}>
                  {generatedTeachingNotes.keyConcepts.map((c, i) => <li key={i} style={{ marginBottom: '8px' }}>{c}</li>)}
                </ul>
              </div>
            </div>

            <div id="notes-questions" style={{ padding: '0 40px 30px 40px' }}>
              <h3 style={{ color: '#1e293b', fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Discussion Questions</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569' }}>
                {generatedTeachingNotes.discussionQuestions.map((q, i) => <li key={i} style={{ marginBottom: '12px' }}>{q}</li>)}
              </ul>
            </div>

            <div id="notes-summary" style={{ padding: '0 40px 40px 40px' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px', border: '1px solid #dbeafe', borderLeft: '4px solid #2563eb' }}>
                <h3 style={{ color: '#1e40af', fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Summary</h3>
                <p style={{ color: '#1e3a8a', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>{generatedTeachingNotes.summary}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIStrategist;