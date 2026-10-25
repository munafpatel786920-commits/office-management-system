import React, { useState } from 'react';
import { Search, Bell, CheckCircle2, AlertTriangle, Info, Clock, Plus, User, CheckSquare } from 'lucide-react';
import { AppNotification, Employee, Task } from '../types';

interface HeaderProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onOpenQuickAdd: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  companyName: string;
  companyLogo: string;
  setCurrentTab: (tab: string) => void;
  employees: Employee[];
  tasks: Task[];
}

export const Header: React.FC<HeaderProps> = ({ 
  notifications, 
  setNotifications, 
  onOpenQuickAdd,
  searchTerm,
  setSearchTerm,
  companyName,
  companyLogo,
  setCurrentTab,
  employees,
  tasks
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length > 0) {
      setIsSearching(true);
      setCurrentTab('employees'); // Automatically jump to employee/search view
    } else {
      setIsSearching(false);
    }
  };

  const matchingEmployees = employees.filter(e => 
    searchTerm && (e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase()) || e.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const matchingTasks = tasks.filter(t => 
    searchTerm && (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96 relative">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, tasks, departments..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => { if (searchTerm) setIsSearching(true); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Live Search Suggestions Dropdown */}
        {isSearching && searchTerm.trim().length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 max-h-80 overflow-y-auto">
            <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Results for "{searchTerm}"</span>
              <button onClick={() => setIsSearching(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
            </div>

            <div className="p-2 space-y-1">
              {matchingEmployees.length === 0 && matchingTasks.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 italic">No matching records found</div>
              ) : (
                <>
                  {matchingEmployees.length > 0 && (
                    <div className="px-2 py-1 text-[10px] font-bold text-blue-600 uppercase">Employees</div>
                  )}
                  {matchingEmployees.map(emp => (
                    <div 
                      key={emp.id}
                      onClick={() => { setCurrentTab('employees'); setIsSearching(false); }}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover border" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">{emp.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{emp.designation} • {emp.department}</div>
                      </div>
                    </div>
                  ))}

                  {matchingTasks.length > 0 && (
                    <div className="px-2 py-1 text-[10px] font-bold text-purple-600 uppercase mt-2">Tasks</div>
                  )}
                  {matchingTasks.map(tsk => (
                    <div 
                      key={tsk.id}
                      onClick={() => { setCurrentTab('tasks'); setIsSearching(false); }}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">{tsk.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">Status: {tsk.status} • Priority: {tsk.priority}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Actions</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {notif.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-800 mb-0.5">{notif.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1 cursor-pointer"
                >
                  Close notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Admin Pill using Company Logo */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={companyLogo}
            alt={companyName}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs"
          />
          <div className="hidden md:block text-left">
            <h4 className="text-xs font-bold text-slate-800 leading-tight">Admin User</h4>
            <span className="text-[11px] text-slate-500 font-medium">{companyName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
