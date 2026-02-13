import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Clock, 
  User, 
  Award,
  Download,
  MessageSquare
} from 'lucide-react';
import { ProgramSubmission, Subsidiary, UserProfile } from '../types';

// Hardcoded data derived from the User's input
const ALL_SUBMISSIONS: ProgramSubmission[] = [
  {
    id: 'sub-004',
    subsidiary: Subsidiary.BRIECH_ATLANTIC,
    title: 'Standard Operating Procedures (Construction & FM)',
    version: '1.0',
    submittedBy: 'General Manager (Operations)',
    submissionDate: '2026-02-20',
    status: 'Pending Review',
    complianceScore: 85,
    requestNotes: 'Submitted for Group review. Covers Construction, FM, Assets, and Logistics units. Includes specific Project Team protocols for design and execution.',
    overview: 'Comprehensive SOPs guiding all staff through standardized procedures to ensure operational efficiency, safety, and compliance across core business units.',
    modules: [
      {
        title: 'General Operational Guidelines',
        objectives: ['Define work hours & attendance', 'Mandate HSE & PPE compliance', 'Establish reporting hierarchy'],
        keyTopics: ['Code of Conduct', 'Toolbox talks', 'Daily/Weekly Reports']
      },
      {
        title: 'Construction Services SOP',
        objectives: ['Project Initiation & Feasibility', 'Execution Planning & Design', 'Quality Control & Handover'],
        keyTopics: ['Site Assessment', 'LPOs', 'Snagging', 'As-built documentation']
      },
      {
        title: 'Facility Management SOP',
        objectives: ['Routine & Preventive Maintenance', 'Vendor & Staff Management', 'Diesel Supply Chain Control'],
        keyTopics: ['SLA Reviews', 'Diesel Inventory', 'HSE Audits', 'Site Surveys']
      },
      {
        title: 'Asset & Logistics Operations',
        objectives: ['Asset Tagging & Lifecycle tracking', 'Fleet Management', 'Vehicle Servicing protocols'],
        keyTopics: ['Asset Register', 'Depreciation', 'Service History', 'Preventive Maintenance']
      },
      {
        title: 'Project Team Lifecycle',
        duration: 'Variable',
        objectives: ['Manage Design Phases (Conceptual to Detailed)', 'Bill of Quantities (BoQ) Preparation', 'Client Approval & Sign-off'],
        keyTopics: ['CAD Modeling', 'Procurement', 'Project Handover', 'Feasibility Studies']
      }
    ]
  },
  {
    id: 'sub-003',
    subsidiary: Subsidiary.LUFTREIBER_AUTO,
    title: 'Automotive Technician Curriculum (Levels 1-4)',
    version: '1.0',
    submittedBy: 'Academy Director',
    submissionDate: '2026-02-18',
    status: 'Pending Review',
    complianceScore: 96,
    requestNotes: 'Comprehensive modular structure attached. Assessment structure: Practical 60%, Theory 30%, Attendance 10%. Levels stack into Diploma in Automotive Technology.',
    overview: 'A structured, competency-based framework divided into 4 levels, ranging from Foundation to Specialist. Heavy emphasis on practical workshop skills (up to 70%).',
    modules: [
      {
        title: 'Level 1: Foundation (Safety & Basics)',
        duration: '4 Weeks (160 Hrs)',
        objectives: ['Understand workshop hazards & PPE', 'Perform oil service & fluid inspection', 'Identify major vehicle systems'],
        keyTopics: ['Workshop Safety', 'Vehicle Systems Overview', 'Routine Maintenance', 'Tyres & Fluids']
      },
      {
        title: 'Level 2: Core Technician',
        duration: '8 Weeks (320 Hrs)',
        objectives: ['Diagnose brake & suspension faults', 'Perform compression tests', 'Use multimeter & trace circuits'],
        keyTopics: ['Brakes, Steering & Suspension', 'Engine Mechanical Basics', 'Auto Electrical Fundamentals', 'Service Diagnostics']
      },
      {
        title: 'Level 3: Advanced Workshop Skills',
        duration: '12 Weeks (480 Hrs)',
        objectives: ['Interpret live data & scan tools', 'Diagnose sensor & ECU faults', 'Apply systematic fault-finding logic'],
        keyTopics: ['Diagnostics & Scan Tools', 'Advanced Auto Electrical', 'HVAC & Comfort Systems', 'Fault-Finding Methodology']
      },
      {
        title: 'Level 4: Specialist Programs',
        duration: '4-8 Weeks',
        objectives: ['High-voltage safety (EV/Hybrid)', 'ECU architecture & repair', 'Preventive fleet maintenance'],
        keyTopics: ['Electric & Hybrid Vehicles', 'ECU Diagnostics', 'CNG Systems', 'Fleet Maintenance']
      }
    ]
  },
  {
    id: 'sub-001',
    subsidiary: Subsidiary.BRIGHT_FM,
    title: 'Broadcast Training Manual (Version 1.0)',
    version: '1.0',
    submittedBy: 'Antah Benedict Aondofa (Training Supervisor)',
    submissionDate: '2026-02-12',
    status: 'Pending Review',
    complianceScore: 88,
    requestNotes: 'Submitted for review and consideration. Seeking approval for pilot implementation and adaptation as a template for other media subsidiaries.',
    overview: 'Foundational training manual for broadcast operations, developed from subsidiary SOPs and structured for standardization.',
    modules: [
      {
        title: 'Module 1: Staff Induction & Orientation',
        objectives: ['Understand EIB Group & Bright FM values', 'Broadcasting Ethics', 'Health, Safety & Security'],
        keyTopics: ['Org Structure', 'Workplace Conduct', 'Training Pathway']
      },
      {
        title: 'Module 2: Programme Preparation & Presentation',
        objectives: ['Develop structured outlines', 'Demonstrate professional delivery', 'Handle live interactions'],
        keyTopics: ['Editorial compliance', 'Voice control', 'Interview techniques']
      },
      {
        title: 'Module 3: Studio Operations',
        objectives: ['Identify studio equipment', 'Operate mixing console', 'Follow safety protocols'],
        keyTopics: ['Pre-broadcast checklist', 'Emergency fault handling', 'Playout software']
      },
      {
        title: 'Module 4: Advertising & Sponsorship',
        objectives: ['Advertisement approval workflow', 'Payment confirmation', 'On-air disclosure'],
        keyTopics: ['Revenue protection', 'NBC regulations', 'Log management']
      },
      {
        title: 'Module 5: Professional Conduct & Ethics',
        objectives: ['Apply broadcasting ethics', 'Maintain confidentiality', 'Avoid conflicts of interest'],
        keyTopics: ['Social Media Conduct', 'Whistleblowing', 'Dress code']
      },
      {
        title: 'Module 6: Audience Engagement',
        objectives: ['Handle complaints respectfully', 'Document feedback', 'Escalate issues'],
        keyTopics: ['Complaint Log Template', 'Escalation Framework', 'On-air tone']
      }
    ]
  },
  {
    id: 'sub-002',
    subsidiary: Subsidiary.BRIECH_UAS,
    title: 'RPAS (Drone) Training Curriculum',
    version: '2.0 (Aug 2025)',
    submittedBy: 'Mubarak Sani (Chief Pilot)',
    submissionDate: '2025-08-15',
    status: 'Changes Requested',
    complianceScore: 92,
    overview: 'Comprehensive curriculum for Remotely Piloted Aircraft Systems (RPAS) covering entry-level to advanced BVLOS operations.',
    requestNotes: 'Standardization for field personnel flying under Briech UAS authority. Includes NCAA compliance modules.',
    modules: [
      {
        title: 'Company Indoctrination',
        duration: '1 Week',
        objectives: ['Familiarize with mission & values', 'Understand Safety Management System (SMS)', 'Regulatory Compliance (NCAA)'],
        keyTopics: ['Code of Conduct', 'Aerodynamics', 'Airspace Management']
      },
      {
        title: 'Model-Specific RPA Type Training',
        duration: '2 Weeks',
        objectives: ['System Overview', 'Pre-flight Procedures', 'Emergency Recovery'],
        keyTopics: ['GCS Setup', 'Firmware Updates', 'Manual Override']
      },
      {
        title: 'BVLOS Transition Training',
        duration: '1 Week',
        objectives: ['Understand BVLOS regulations', 'Airspace Risk Management', 'SORA (Specific Operations Risk Assessment)'],
        keyTopics: ['DAA Tech', 'NOTAM review', 'Contingency drills']
      },
      {
        title: 'Maintenance & System Specifics',
        objectives: ['Airframe inspection', 'Battery management', 'Payload calibration'],
        keyTopics: ['Hybrid Drones', 'Fixed-Wing maintenance', 'DJI Matrice 300']
      }
    ]
  }
];

interface TrainingManagerProps {
    user: UserProfile;
}

const TrainingManager: React.FC<TrainingManagerProps> = ({ user }) => {
  // Filter submissions based on User Role
  // If Group Admin -> See All
  // If Subsidiary Manager -> See only their subsidiary
  const visibleSubmissions = ALL_SUBMISSIONS.filter(sub => {
    if (user.role === 'GROUP_ADMIN') return true;
    return sub.subsidiary === user.subsidiary;
  });

  const [submissions, setSubmissions] = useState<ProgramSubmission[]>(visibleSubmissions);
  const [selectedId, setSelectedId] = useState<string | null>(visibleSubmissions.length > 0 ? visibleSubmissions[0].id : null);

  // Update filtered list when user changes
  useEffect(() => {
    const filtered = ALL_SUBMISSIONS.filter(sub => {
        if (user.role === 'GROUP_ADMIN') return true;
        return sub.subsidiary === user.subsidiary;
    });
    setSubmissions(filtered);
    setSelectedId(filtered.length > 0 ? filtered[0].id : null);
  }, [user]);

  const selectedProgram = submissions.find(s => s.id === selectedId);

  const handleStatusChange = (id: string, newStatus: ProgramSubmission['status']) => {
    setSubmissions(prev => prev.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ));
  };

  if (submissions.length === 0) {
      return (
        <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 border-dashed text-slate-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-slate-600">No Submissions Found</h3>
            <p className="mt-2 text-sm text-center max-w-sm">
                {user.role === 'GROUP_ADMIN' 
                    ? "There are no pending submissions from any subsidiary." 
                    : "You haven't submitted any training programs yet. Please create a new submission."}
            </p>
        </div>
      );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Sidebar List */}
      <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-700 flex items-center">
            <FileText className="mr-2 text-blue-600" size={20}/>
            {user.role === 'GROUP_ADMIN' ? 'Incoming Submissions' : 'My Submissions'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {user.role === 'GROUP_ADMIN' 
                ? 'Review and standardize subsidiary manuals' 
                : 'Manage your training documents'}
          </p>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {submissions.map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setSelectedId(sub.id)}
              className={`p-4 rounded-lg cursor-pointer border transition-all ${
                selectedId === sub.id 
                  ? 'bg-blue-50 border-blue-500 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                  sub.status === 'Group Approved' ? 'bg-emerald-100 text-emerald-700' :
                  sub.status === 'Changes Requested' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {sub.status}
                </span>
                <span className="text-xs text-slate-400">{sub.submissionDate}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{sub.title}</h3>
              <p className="text-xs text-slate-500 font-medium mb-2">{sub.subsidiary}</p>
              
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <User size={12}/>
                <span className="truncate">{sub.submittedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Review Area */}
      {selectedProgram && (
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-xl font-bold text-slate-800">{selectedProgram.title}</h1>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">v{selectedProgram.version}</span>
              </div>
              <p className="text-sm text-slate-600 max-w-xl">{selectedProgram.overview}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1 text-emerald-600 font-bold">
                <ShieldCheck size={18} />
                <span>{selectedProgram.complianceScore}% Match</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Group Standard Compliance</p>
            </div>
          </div>

          {/* Memo / Context */}
          {selectedProgram.requestNotes && (
            <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-start space-x-3">
              <MessageSquare className="text-amber-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase mb-1">Submission Note</p>
                <p className="text-sm text-amber-900 italic">"{selectedProgram.requestNotes}"</p>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Curriculum Modules</h3>
            {selectedProgram.modules.map((mod, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 flex items-center">
                    <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded flex items-center justify-center text-xs mr-3">{idx + 1}</span>
                    {mod.title}
                  </h4>
                  {mod.duration && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium flex items-center">
                      <Clock size={12} className="mr-1"/> {mod.duration}
                    </span>
                  )}
                </div>
                
                <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Learning Objectives</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {mod.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>
                  {mod.keyTopics && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Key Topics</p>
                      <div className="flex flex-wrap gap-1">
                        {mod.keyTopics.map((topic, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer - Only Group Admin can Approve/Request Changes */}
          {user.role === 'GROUP_ADMIN' && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <button className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
                <Download size={16} className="mr-2"/>
                Export Original PDF
                </button>
                
                <div className="flex space-x-3">
                <button 
                    onClick={() => handleStatusChange(selectedProgram.id, 'Changes Requested')}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-white transition-colors text-sm"
                >
                    Request Changes
                </button>
                <button 
                    onClick={() => handleStatusChange(selectedProgram.id, 'Group Approved')}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center shadow-sm"
                >
                    <Award size={16} className="mr-2"/>
                    Approve & Standardize
                </button>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingManager;