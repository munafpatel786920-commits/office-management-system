import React from 'react';
import { Building2, Users, DollarSign, Briefcase } from 'lucide-react';
import { Department, Employee } from '../types';

interface DepartmentsTabProps {
  departments: Department[];
  employees: Employee[];
}

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({ departments, employees }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Departments & Staff Management</h2>
        <p className="text-sm text-slate-500">Overview of company departments, budgets, heads, and team members.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptEmployees = employees.filter(e => e.department === dept.name);
          return (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${dept.color} text-white flex items-center justify-center font-bold shadow-lg`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    Budget: ${(dept.budget / 1000).toFixed(0)}k
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{dept.description}</p>

                <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department Head:</span>
                    <span className="font-bold text-slate-800">{dept.head}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Members:</span>
                    <span className="font-bold text-blue-600">{deptEmployees.length} employees</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Key Team Members</h4>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {deptEmployees.map(emp => (
                    <img
                      key={emp.id}
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                      title={`${emp.name} (${emp.designation})`}
                    />
                  ))}
                  {deptEmployees.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No assigned staff yet</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
