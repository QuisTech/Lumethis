export enum Subsidiary {
  EIB_HOLDINGS = 'EIB Holdings',
  TECH_SOLUTIONS = 'Tech Solutions Ltd',
  LOGISTICS_PRO = 'Logistics Pro',
  RETAIL_ARM = 'Retail Arm',
  BRIGHT_FM = 'Bright FM (Broadcast)',
  BRIECH_UAS = 'Briech UAS (Drone Ops)',
  LUFTREIBER_AUTO = 'Luftreiber Automotive',
  BRIECH_ATLANTIC = 'Briech Atlantic (Construction & FM)',
  BRIGHT_ECHEFU_FOUNDATION = 'Bright Echefu Foundation',
  POCTOVA = 'Poctova'
}

export type UserRole = 'GROUP_ADMIN' | 'SUBSIDIARY_MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subsidiary?: Subsidiary; // If undefined, they are Group level
  jobTitle?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  subsidiary: Subsidiary;
  status: 'Planned' | 'In Progress' | 'Completed';
  participants: number;
  budget: number;
  startDate: string;
  category: 'Technical' | 'Leadership' | 'Operational' | 'Soft Skills';
}

export interface ModuleContent {
  title: string;
  objectives: string[];
  duration?: string;
  keyTopics?: string[];
}

export interface ProgramSubmission {
  id: string;
  submittedBy: string;
  submissionDate: string;
  title: string;
  subsidiary: Subsidiary;
  version: string;
  status: 'Pending Review' | 'Changes Requested' | 'Group Approved' | 'Active';
  complianceScore: number; // 0-100 based on Group Standards
  overview: string;
  modules: ModuleContent[];
  requestNotes?: string; // Content from the memo
}

export interface BudgetRecord {
  category: string;
  allocated: number;
  spent: number;
  variance: number; // positive means under budget
}

export interface Asset {
  id: string;
  name: string;
  location: string;
  condition: 'Good' | 'Fair' | 'Maintenance Required';
  lastInspection: string;
}

export interface AIPlanResponse {
  title: string;
  overview: string;
  modules: {
    name: string;
    objectives: string[];
    duration: string;
    sfiaLevel?: string; 
  }[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'scale' | 'text' | 'choice';
  rationale: string;
  options?: string[];
}

export interface SurveyPlan {
  title: string;
  description: string;
  targetAudience: string;
  questions: SurveyQuestion[];
}

export interface KPIItem {
  area: string;
  kpi: string;
  target: string;
  measurementFrequency: string;
  owner: string;
}

export interface KPIPlan {
  title: string;
  level: string; // Staff, Unit, Manager, Subsidiary
  strategicFocus: string;
  kpis: KPIItem[];
}

export interface PDPAction {
  category: 'Formal Training' | 'Experience/Project' | 'Mentoring/Coaching' | 'Self-Study';
  action: string;
  timeline: string;
  successCriteria: string;
}

export interface PDPPlan {
  employeeName: string;
  currentRole: string;
  careerGoal: string;
  strengths: string[];
  developmentAreas: string[];
  actionPlan: PDPAction[];
  cpdRecommendations: string[]; // Recommended topics for CPD
}

export interface TeachingNotes {
  title: string;
  introduction: string;
  keyConcepts: string[];
  discussionQuestions: string[];
  summary: string;
}
