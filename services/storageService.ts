import { UserProfile, ProgramSubmission, Subsidiary } from '../types';

const USERS_KEY = 'lumethis_users_v1';
const SUBMISSIONS_KEY = 'lumethis_submissions_v2';
const SESSION_KEY = 'lumethis_session_v1';

// Seed Data for initial load
const SEED_USERS = [
    { id: 'u1', name: 'Marquis Michael Abimbola', email: 'marquis@eib.com', password: 'password', role: 'GROUP_ADMIN', jobTitle: 'Group Manager - Training' },
    { id: 'u2', name: 'Benedict Aondofa', email: 'benedict@eib.com', password: 'password', role: 'GROUP_ADMIN', jobTitle: 'Technical Supervisor' },
    { id: 'u3', name: 'Ms. Anita', email: 'anita@brightfm.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIGHT_FM, jobTitle: 'General Manager' },
    { id: 'u4', name: 'Mubarak Sani', email: 'mubarak@briechuas.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_UAS, jobTitle: 'General Manager' },
    { id: 'u5', name: 'Mr. Junaid Raza', email: 'junaid@luftreiber.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.LUFTREIBER_AUTO, jobTitle: 'Director' },
    { id: 'u6', name: 'Mr. Monday Apeh', email: 'monday@briechatlantic.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_ATLANTIC, jobTitle: 'General Manager' },
    { id: 'u7', name: 'Foundation Admin', email: 'admin@brightechefu.org', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIGHT_ECHEFU_FOUNDATION, jobTitle: 'Program Coordinator' },
    { id: 'u8', name: 'Poctova HR', email: 'hr@poctova.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.POCTOVA, jobTitle: 'HR Manager' },
    // Demo Account
    { id: 'demo_user', name: 'Demo Administrator', email: 'demo@lumethis.com', password: 'demo', role: 'GROUP_ADMIN', jobTitle: 'System Demo User' }
];

const SEED_SUBMISSIONS: ProgramSubmission[] = [
    {
        id: 'sub-006',
        subsidiary: Subsidiary.POCTOVA,
        title: 'Mode of Employment Policy & Compliance',
        version: '1.0',
        submittedBy: 'Poctova HR',
        submissionDate: '2026-02-25',
        status: 'Pending Review',
        complianceScore: 92,
        requestNotes: 'Standard employment policy for military uniform production staff.',
        overview: 'Policy outlining employment structure, conditions, and conduct for Poctova staff, emphasizing professionalism, discipline, and confidentiality in military uniform production.',
        modules: [
            { 
                title: 'Introduction & Employment Categories', 
                objectives: ['Understand company mission', 'Define employment types'], 
                keyTopics: ['Confidentiality', 'Professionalism', 'Permanent vs Contract'],
                duration: '1 Hour'
            },
            { 
                title: 'Recruitment & Work Structure', 
                objectives: ['Explain recruitment process', 'Outline department structure'], 
                keyTopics: ['Merit-based recruitment', 'Security checks', 'Design & Pattern Dept', 'Quality Control'],
                duration: '1.5 Hours'
            },
            { 
                title: 'Work Hours & Code of Conduct', 
                objectives: ['Define standard hours', 'Establish conduct rules'], 
                keyTopics: ['8-hour shifts', 'Overtime policy', 'Military design secrecy', 'Discipline'],
                duration: '2 Hours'
            },
            { 
                title: 'Compensation, Benefits & Performance', 
                objectives: ['Explain remuneration', 'Review performance criteria'], 
                keyTopics: ['Salary & Bonuses', 'Health contributions', 'Productivity metrics', 'Leave entitlements'],
                duration: '1.5 Hours'
            },
            { 
                title: 'Health, Safety, Security & Termination', 
                objectives: ['Ensure safe working conditions', 'Clarify termination grounds'], 
                keyTopics: ['Safety equipment', 'Security clearance', 'Redundancy', 'Misconduct'],
                duration: '2 Hours'
            }
        ]
    },
    {
        id: 'sub-005',
        subsidiary: Subsidiary.BRIGHT_ECHEFU_FOUNDATION,
        title: 'Training Curriculum for Staff and Volunteers',
        version: '1.0',
        submittedBy: 'Foundation Admin',
        submissionDate: '2026-02-24',
        status: 'Pending Review',
        complianceScore: 89,
        requestNotes: 'Comprehensive curriculum for all foundation staff and volunteers.',
        overview: 'Five-day training program designed to align the team with the foundation’s mission, equip them with case management skills, and strengthen accountability.',
        modules: [
            { 
                title: 'Module 1: Foundation Orientation and Values', 
                objectives: ['Align with mission', 'Understand core values'], 
                keyTopics: ['History & Vision', 'Integrity & Compassion', 'Code of Conduct', 'Confidentiality', 'Safeguarding'],
                duration: '4 Hours'
            },
            { 
                title: 'Module 2: Health Assistance and Medical Bill Support', 
                objectives: ['Master medical verification', 'Understand healthcare structure'], 
                keyTopics: ['Nigeria Healthcare Structure', 'Medical Bill Verification', 'Hospital Partnerships', 'Disbursement Workflow'],
                duration: '6 Hours'
            },
            { 
                title: 'Module 3: Case Management and Beneficiary Assessment', 
                objectives: ['Conduct needs assessment', 'Prioritize cases'], 
                keyTopics: ['Home Visitation Protocols', 'Risk Assessment Tools', 'Prioritization Matrix', 'Reporting Templates'],
                duration: '6 Hours'
            },
            { 
                title: 'Module 4: Educational Support Program Management', 
                objectives: ['Manage educational support', 'Verify tuition'], 
                keyTopics: ['Identifying Deserving Students', 'School Partnerships', 'Tuition Verification', 'Academic Monitoring'],
                duration: '4 Hours'
            },
            { 
                title: 'Module 5: Fund Management and Financial Accountability', 
                objectives: ['Ensure financial transparency', 'Detect fraud'], 
                keyTopics: ['Approval Processes', 'Receipt Management', 'Budget Tracking', 'Fraud Red Flags'],
                duration: '4 Hours'
            },
            { 
                title: 'Module 6: Community Engagement and Public Relations', 
                objectives: ['Engage local leaders', 'Manage public image'], 
                keyTopics: ['Community Entry Strategies', 'Media Engagement', 'Storytelling Ethics', 'Crisis Management'],
                duration: '4 Hours'
            },
            { 
                title: 'Module 7: Monitoring, Evaluation and Impact Reporting', 
                objectives: ['Track KPIs', 'Report impact'], 
                keyTopics: ['KPIs', 'Health Outcome Tracking', 'Beneficiary Feedback', 'Quarterly Reports'],
                duration: '4 Hours'
            },
            { 
                title: 'Module 8: Volunteer Development and Leadership', 
                objectives: ['Motivate volunteers', 'Develop leadership'], 
                keyTopics: ['Motivation Strategies', 'Time Management', 'Emotional Resilience', 'Team Coordination'],
                duration: '4 Hours'
            }
        ]
    },
    {
        id: 'sub-004',
        subsidiary: Subsidiary.BRIECH_ATLANTIC,
        title: 'Standard Operating Procedures (Construction & FM)',
        version: '1.0',
        submittedBy: 'Mr. Monday Apeh',
        submissionDate: '2026-02-20',
        status: 'Pending Review',
        complianceScore: 85,
        requestNotes: 'Submitted for Group review. Covers Construction, FM, Assets, and Logistics units.',
        overview: 'Comprehensive SOPs guiding all staff through standardized procedures.',
        modules: [
            { title: 'General Operational Guidelines', objectives: ['Define work hours', 'HSE compliance'], duration: '2 Hours' },
            { title: 'Construction Services SOP', objectives: ['Project Initiation', 'Quality Control'], duration: '4 Hours' }
        ]
    },
    {
        id: 'sub-001',
        subsidiary: Subsidiary.BRIGHT_FM,
        title: 'Broadcast Training Manual',
        version: '1.0',
        submittedBy: 'Ms. Anita',
        submissionDate: '2026-02-12',
        status: 'Group Approved',
        complianceScore: 88,
        requestNotes: 'Seeking approval for pilot implementation.',
        overview: 'Foundational training manual for broadcast operations.',
        modules: [
            { title: 'Module 1: Staff Induction', objectives: ['Values', 'Ethics'], duration: '1 Day' },
            { title: 'Module 2: Programme Prep', objectives: ['Outlines', 'Delivery'], duration: '2 Days' }
        ]
    }
];

export const storageService = {
    // Initialize DB if empty
    init: () => {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (!storedUsers) {
            localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
        } else {
            // Ensure Demo User exists even if DB was previously created
            const users = JSON.parse(storedUsers);
            const demoUser = SEED_USERS.find(u => u.id === 'demo_user');
            if (demoUser && !users.find((u: any) => u.email === demoUser.email)) {
                users.push(demoUser);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            }
        }

        if (!localStorage.getItem(SUBMISSIONS_KEY)) {
            localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(SEED_SUBMISSIONS));
        }
    },

    // Auth Methods
    login: (email: string, password: string): UserProfile | null => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            const { password, ...profile } = user; // Exclude password from return
            localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
            return profile;
        }
        return null;
    },

    signup: (user: Omit<UserProfile, 'id'> & { password: string }): UserProfile => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        
        if (users.find((u: any) => u.email === user.email)) {
            throw new Error('User already exists');
        }

        const newUser = { ...user, id: `u-${Date.now()}` };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        const { password, ...profile } = newUser;
        localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        return profile;
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    getSession: (): UserProfile | null => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    // Data Methods
    getSubmissions: (user: UserProfile): ProgramSubmission[] => {
        const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        if (user.role === 'GROUP_ADMIN') return all;
        return all.filter((s: ProgramSubmission) => s.subsidiary === user.subsidiary);
    },

    updateSubmissionStatus: (id: string, status: ProgramSubmission['status']) => {
        const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        const updated = all.map((s: ProgramSubmission) => s.id === id ? { ...s, status } : s);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
        return updated;
    },

    createSubmission: (submission: ProgramSubmission) => {
        const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        all.unshift(submission);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
    }
};