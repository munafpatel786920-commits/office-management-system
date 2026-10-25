import { Employee, Department, Attendance, Task, LeaveRequest, Payroll, AppNotification } from './types';

export const initialDepartments: Department[] = [
  { id: 'dept-1', name: 'Engineering', head: 'Sarah Jenkins', headCount: 14, budget: 1200000, description: 'Software development, architecture, and IT infrastructure.', color: 'bg-blue-500' },
  { id: 'dept-2', name: 'Product & Design', head: 'Alex Rivera', headCount: 6, budget: 650000, description: 'User experience, product roadmaps, and visual design systems.', color: 'bg-purple-500' },
  { id: 'dept-3', name: 'Marketing', head: 'Elena Rostova', headCount: 8, budget: 800000, description: 'Growth marketing, brand campaigns, and content strategy.', color: 'bg-emerald-500' },
  { id: 'dept-4', name: 'Human Resources', head: 'Marcus Vance', headCount: 4, budget: 400000, description: 'Talent acquisition, employee experience, and compliance.', color: 'bg-amber-500' },
  { id: 'dept-5', name: 'Finance', head: 'David Chen', headCount: 5, budget: 550000, description: 'Financial planning, accounting, payroll, and auditing.', color: 'bg-indigo-500' },
  { id: 'dept-6', name: 'Operations', head: 'Rachel Green', headCount: 7, budget: 500000, description: 'Office management, logistics, facilities, and customer support.', color: 'bg-rose-500' },
];

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    department: 'Engineering',
    designation: 'VP of Engineering',
    phone: '+1 (555) 234-5678',
    email: 'sarah.jenkins@workpulse.io',
    joiningDate: '2021-03-15',
    salary: 145000,
    status: 'Active',
    role: 'Admin'
  },
  {
    id: 'EMP-002',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'Product & Design',
    designation: 'Lead Product Manager',
    phone: '+1 (555) 345-6789',
    email: 'alex.rivera@workpulse.io',
    joiningDate: '2022-06-10',
    salary: 130000,
    status: 'Active',
    role: 'Manager'
  },
  {
    id: 'EMP-003',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
    phone: '+1 (555) 456-7890',
    email: 'jessica.taylor@workpulse.io',
    joiningDate: '2023-01-15',
    salary: 115000,
    status: 'Active',
    role: 'Employee'
  },
  {
    id: 'EMP-004',
    name: 'Michael Chang',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    department: 'Marketing',
    designation: 'Growth Marketing Manager',
    phone: '+1 (555) 567-8901',
    email: 'michael.chang@workpulse.io',
    joiningDate: '2022-11-01',
    salary: 95000,
    status: 'Remote',
    role: 'Employee'
  },
  {
    id: 'EMP-005',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    department: 'Marketing',
    designation: 'Marketing Director',
    phone: '+1 (555) 678-9012',
    email: 'elena.rostova@workpulse.io',
    joiningDate: '2020-08-20',
    salary: 125000,
    status: 'Active',
    role: 'Manager'
  },
  {
    id: 'EMP-006',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    department: 'Human Resources',
    designation: 'Chief HR Officer',
    phone: '+1 (555) 789-0123',
    email: 'marcus.vance@workpulse.io',
    joiningDate: '2019-05-12',
    salary: 135000,
    status: 'Active',
    role: 'Admin'
  },
  {
    id: 'EMP-007',
    name: 'Aisha Patel',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    department: 'Engineering',
    designation: 'Frontend React Specialist',
    phone: '+1 (555) 890-1234',
    email: 'aisha.patel@workpulse.io',
    joiningDate: '2023-04-10',
    salary: 105000,
    status: 'Active',
    role: 'Employee'
  },
  {
    id: 'EMP-008',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    department: 'Finance',
    designation: 'Financial Controller',
    phone: '+1 (555) 901-2345',
    email: 'david.chen@workpulse.io',
    joiningDate: '2021-09-01',
    salary: 120000,
    status: 'Active',
    role: 'Manager'
  }
];

const todayStr = new Date().toISOString().split('T')[0];

export const initialAttendance: Attendance[] = [
  { id: 'att-1', employeeId: 'EMP-001', date: todayStr, checkIn: '08:55', checkOut: '17:30', status: 'Present', notes: 'On-time arrival' },
  { id: 'att-2', employeeId: 'EMP-002', date: todayStr, checkIn: '09:15', checkOut: '17:45', status: 'Late', notes: 'Traffic delay' },
  { id: 'att-3', employeeId: 'EMP-003', date: todayStr, checkIn: '08:45', checkOut: '17:15', status: 'Present' },
  { id: 'att-4', employeeId: 'EMP-004', date: todayStr, checkIn: '-', checkOut: '-', status: 'Absent', notes: 'Sick leave notification' },
  { id: 'att-5', employeeId: 'EMP-005', date: todayStr, checkIn: '09:00', checkOut: '17:00', status: 'Present' },
  { id: 'att-6', employeeId: 'EMP-006', date: todayStr, checkIn: '08:50', checkOut: '17:20', status: 'Present' },
  { id: 'att-7', employeeId: 'EMP-007', date: todayStr, checkIn: '09:30', checkOut: '14:00', status: 'Half-day', notes: 'Doctor appointment in afternoon' },
  { id: 'att-8', employeeId: 'EMP-008', date: todayStr, checkIn: '08:58', checkOut: '17:35', status: 'Present' },
];

export const initialTasks: Task[] = [
  {
    id: 'tsk-1',
    title: 'Q4 Cloud Architecture Migration',
    description: 'Migrate legacy microservices to multi-region Kubernetes cluster with zero downtime.',
    priority: 'Urgent',
    status: 'InProgress',
    assignedTo: 'EMP-003',
    deadline: '2026-11-15',
    createdAt: '2026-10-01'
  },
  {
    id: 'tsk-2',
    title: 'New Design System UI Kit',
    description: 'Finalize Figma design tokens and component library specifications for Q4 release.',
    priority: 'High',
    status: 'InProgress',
    assignedTo: 'EMP-002',
    deadline: '2026-10-25',
    createdAt: '2026-10-05'
  },
  {
    id: 'tsk-3',
    title: 'Brand Growth Campaign Analysis',
    description: 'Analyze Q3 social media ROI and prepare presentation for executive board meeting.',
    priority: 'Medium',
    status: 'Todo',
    assignedTo: 'EMP-004',
    deadline: '2026-10-30',
    createdAt: '2026-10-08'
  },
  {
    id: 'tsk-4',
    title: 'Annual Employee Benefits Review',
    description: 'Review healthcare provider quotes and wellness stipend options for next year.',
    priority: 'High',
    status: 'Completed',
    assignedTo: 'EMP-006',
    deadline: '2026-10-10',
    createdAt: '2026-09-20'
  },
  {
    id: 'tsk-5',
    title: 'React 19 Component Optimization',
    description: 'Refactor core dashboard components to leverage concurrent rendering features.',
    priority: 'Medium',
    status: 'Todo',
    assignedTo: 'EMP-007',
    deadline: '2026-11-05',
    createdAt: '2026-10-12'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lev-1',
    employeeId: 'EMP-004',
    leaveType: 'Sick',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    reason: 'Severe flu and viral fever',
    status: 'Pending',
    appliedDate: '2026-10-14'
  },
  {
    id: 'lev-2',
    employeeId: 'EMP-007',
    leaveType: 'Annual',
    startDate: '2026-11-01',
    endDate: '2026-11-05',
    reason: 'Family vacation to Hawaii',
    status: 'Approved',
    appliedDate: '2026-10-10'
  },
  {
    id: 'lev-3',
    employeeId: 'EMP-002',
    leaveType: 'Casual',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'Personal legal matters',
    status: 'Pending',
    appliedDate: '2026-10-12'
  }
];

export const initialPayroll: Payroll[] = initialEmployees.map((emp, idx) => ({
  id: `pay-${idx + 1}`,
  employeeId: emp.id,
  month: 'October 2026',
  baseSalary: Math.round(emp.salary / 12),
  allowances: 850,
  deductions: 350,
  bonus: idx % 2 === 0 ? 500 : 0,
  netSalary: Math.round(emp.salary / 12) + 850 - 350 + (idx % 2 === 0 ? 500 : 0),
  status: idx < 6 ? 'Paid' : 'Pending'
}));

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Leave Request',
    message: 'Michael Chang submitted a Sick Leave request for Oct 15 - Oct 16.',
    time: '10 mins ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'notif-2',
    title: 'Task Milestone Reached',
    message: 'Marcus Vance completed "Annual Employee Benefits Review".',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-3',
    title: 'Payroll Summary Generated',
    message: 'October 2026 payroll summary is ready for review and processing.',
    time: '1 day ago',
    read: true,
    type: 'info'
  }
];

import { Announcement, CompanyAsset, Appraisal } from './types';

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Q4 Global Townhall Meeting',
    content: 'Join us this Friday at 10:00 AM for our Q4 strategic roadmap review and Q&A with executive leadership.',
    author: 'Sarah Jenkins',
    date: '2026-10-14',
    priority: 'Important'
  },
  {
    id: 'ann-2',
    title: 'Office Security & Access Card Update',
    content: 'All employees are required to wear visible ID badges at all times within office premises.',
    author: 'Marcus Vance',
    date: '2026-10-10',
    priority: 'Urgent'
  }
];

export const initialAssets: CompanyAsset[] = [
  {
    id: 'ast-1',
    assetName: 'MacBook Pro 16 M3 Max',
    serialNumber: 'C02G90XYZ3D',
    category: 'Laptop',
    assignedTo: 'EMP-003',
    assignedDate: '2023-01-15',
    status: 'Assigned'
  },
  {
    id: 'ast-2',
    assetName: 'Dell UltraSharp 32 4K Monitor',
    serialNumber: 'DEL-4920-991',
    category: 'Monitor',
    assignedTo: 'EMP-007',
    assignedDate: '2023-04-10',
    status: 'Assigned'
  },
  {
    id: 'ast-3',
    assetName: 'iPhone 15 Pro Enterprise',
    serialNumber: 'IMEI-88492019',
    category: 'Mobile',
    assignedTo: 'EMP-002',
    assignedDate: '2022-06-10',
    status: 'Assigned'
  }
];

export const initialAppraisals: Appraisal[] = [
  {
    id: 'app-1',
    employeeId: 'EMP-003',
    reviewPeriod: '2026 Q3 Review',
    rating: 5,
    strengths: 'Exceptional system architecture refactoring and zero-downtime deployment execution.',
    improvements: 'Continue mentoring junior frontend engineers.',
    reviewer: 'Sarah Jenkins',
    reviewDate: '2026-10-01'
  },
  {
    id: 'app-2',
    employeeId: 'EMP-007',
    reviewPeriod: '2026 Q3 Review',
    rating: 4,
    strengths: 'Outstanding React component delivery and clean UI code standards.',
    improvements: 'Proactive backend API integration documentation.',
    reviewer: 'Sarah Jenkins',
    reviewDate: '2026-10-02'
  }
];
