import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CheckSquare, 
  CalendarDays, 
  Building2, 
  Receipt, 
  BarChart3, 
  Sparkles, 
  Settings as SettingsIcon, 
  LogOut,
  ShieldAlert,
  Megaphone,
  Laptop,
  Award
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
  companyName: string;
  companyLogo: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  userRole, 
  onLogout,
  companyName,
  companyLogo
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'leaves', label: 'Leave Requests', icon: CalendarDays },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'payroll', label: 'Salary & Payroll', icon: Receipt },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'assets', label: 'Asset Management', icon: Laptop },
    { id: 'appraisals', label: 'Appraisals & Reviews', icon: Award },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI HR Advisor', icon: Sparkles, badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (userRole === 'Admin' || userRole === 'SuperAdmin') return true;
    if (userRole === 'Manager') {
      return !['payroll', 'settings'].includes(item.id);
    }
    if (userRole === 'Employee') {
      return ['dashboard', 'attendance', 'tasks', 'leaves', 'announcements', 'assets'].includes(item.id);
    }
    return true;
  });

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col h-screen sticky top-0 border-r border-slate-200 shrink-0 select-none shadow-xs">
      {/* App Branding with Company Logo */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-200 bg-white">
        <img 
          src={companyLogo} 
          alt="Company Logo" 
          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0 bg-slate-100"
        />
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-slate-900 text-sm truncate tracking-tight">{companyName}</h1>
          <span className="text-[11px] text-blue-600 font-medium tracking-wide">Office Manager</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-md shadow">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <img 
            src={companyLogo} 
            alt={companyName} 
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs bg-white"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 truncate">{userRole === 'SuperAdmin' ? 'Super Admin' : `${userRole} User`}</h4>
            <p className="text-xs text-slate-500 truncate">{companyName}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
