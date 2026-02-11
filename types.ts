export enum Subsidiary {
  EIB_HOLDINGS = 'EIB Holdings',
  TECH_SOLUTIONS = 'Tech Solutions Ltd',
  LOGISTICS_PRO = 'Logistics Pro',
  RETAIL_ARM = 'Retail Arm'
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
  }[];
}
