export type UserRole = 'SuperAdmin' | 'Admin' | 'Manager' | 'Employee';

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Remote' | 'Terminated';
  role: UserRole;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  headCount: number;
  budget: number;
  description: string;
  color: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:MM
  checkOut: string; // HH:MM
  status: 'Present' | 'Absent' | 'Late' | 'Half-day';
  notes?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string; // employeeId
  deadline: string; // YYYY-MM-DD
  createdAt: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string; // e.g., "October 2026"
  baseSalary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'General' | 'Important' | 'Urgent';
}

export interface CompanyAsset {
  id: string;
  assetName: string;
  serialNumber: string;
  category: 'Laptop' | 'Monitor' | 'Mobile' | 'Access Card' | 'Accessory';
  assignedTo: string; // employeeId
  assignedDate: string;
  status: 'Assigned' | 'In Stock' | 'Under Maintenance';
}

export interface Appraisal {
  id: string;
  employeeId: string;
  reviewPeriod: string;
  rating: number; // 1 to 5
  strengths: string;
  improvements: string;
  reviewer: string;
  reviewDate: string;
}

export interface AccessKey {
  id: string;
  key: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

