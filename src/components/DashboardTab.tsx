import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  CheckSquare, 
  CalendarDays, 
  Receipt, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Building2,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Employee, Attendance, Task, LeaveRequest, Department } from '../types';

interface DashboardTabProps {
  employees: Employee[];
  attendance: Attendance[];
  tasks: Task[];
  leaveRequests: LeaveRequest[];
  departments: Department[];
  setCurrentTab: (tab: string) => void;
  companyName: string;
  companyLogo: string;
  selectedCountry: string;
  currencySymbol: string;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  employees,
  attendance,
  tasks,
  leaveRequests,
  departments,
  setCurrentTab,
  companyName,
  companyLogo,
  selectedCountry,
  currencySymbol
}) => {
  const totalEmployees = employees.length;
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  
  const totalPayroll = employees.reduce((acc, emp) => acc + Math.round(emp.salary / 12), 0);

  const stats = [
    { title: 'Total Employees', value: totalEmployees, change: '+12% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', tab: 'employees' },
    { title: 'Present Today', value: presentCount, change: `${Math.round((presentCount / (totalEmployees || 1)) * 100)}% attendance rate`, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', tab: 'attendance' },
    { title: 'Absent Today', value: absentCount, change: 'Requires review', icon: UserX, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', tab: 'attendance' },
    { title: 'Pending Tasks', value: pendingTasks, change: 'Active projects', icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', tab: 'tasks' },
    { title: 'Leave Requests', value: pendingLeaves, change: 'Action needed', icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', tab: 'leaves' },
    { title: 'Monthly Payroll', value: `${currencySymbol}${totalPayroll.toLocaleString()}`, change: 'Estimated net total', icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', tab: 'payroll' },
  ];

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'InProgress').length;
  const todoTasksCount = tasks.filter(t => t.status === 'Todo').length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Welcome Banner with Company Logo & Name */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src={companyLogo} 
              alt={companyName} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-lg bg-white shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {selectedCountry}
                </span>
                <span className="text-xs text-blue-200">Office Management System</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-1">{companyName}</h2>
              <p className="text-blue-100 text-xs font-medium">Welcome back, Sarah! All departments operating at 94% efficiency.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('ai-assistant')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Advisor</span>
            </button>
            <button
              onClick={() => setCurrentTab('employees')}
              className="flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-black/10"
            >
              <Users className="w-4 h-4" />
              <span>Manage Staff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setCurrentTab(stat.tab)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                  View <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h3>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Charts & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Progress & Attendance breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Progress Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Task Status Overview</h3>
                <p className="text-xs text-slate-500">Current progress across active company projects</p>
              </div>
              <button 
                onClick={() => setCurrentTab('tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all tasks →
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Completed Tasks</span>
                  <span className="text-emerald-600">{completedTasksCount} of {tasks.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${tasks.length ? (completedTasksCount / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>In Progress</span>
                  <span className="text-blue-600">{inProgressTasksCount} of {tasks.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${tasks.length ? (inProgressTasksCount / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>To Do (Backlog)</span>
                  <span className="text-amber-600">{todoTasksCount} of {tasks.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${tasks.length ? (todoTasksCount / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Department Headcount</h3>
                <p className="text-xs text-slate-500">Distribution of active employees across teams</p>
              </div>
              <button 
                onClick={() => setCurrentTab('departments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage departments →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{dept.name}</h4>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Head: {dept.head}</span>
                    <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {dept.headCount} staff
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recent Activities & Upcoming Events */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Leave Approved</p>
                  <p className="text-xs text-slate-500">Annual leave approved for Aisha Patel.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  +
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">New Employee Onboarded</p>
                  <p className="text-xs text-slate-500">Jessica Taylor joined Engineering.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ★
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Task Milestone</p>
                  <p className="text-xs text-slate-500">Benefits review completed by Marcus.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Upcoming Schedule</h3>
            </div>
            <div className="space-y-3.5">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-2 py-0.5 rounded-md">Tomorrow, 10:00 AM</span>
                <h4 className="text-xs font-bold text-white mt-1.5">Q4 Engineering Townhall</h4>
                <p className="text-xs text-slate-300 mt-0.5">Conference Room A & Zoom</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] bg-purple-500/30 text-purple-300 font-bold px-2 py-0.5 rounded-md">Oct 20, 02:00 PM</span>
                <h4 className="text-xs font-bold text-white mt-1.5">Executive Budget Review</h4>
                <p className="text-xs text-slate-300 mt-0.5">Boardroom 2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
