import React, { useState } from 'react';
import { 
  Clock, 
  UserCheck, 
  UserX, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Attendance, Employee } from '../types';

interface AttendanceTabProps {
  attendance: Attendance[];
  setAttendance: React.Dispatch<React.SetStateAction<Attendance[]>>;
  employees: Employee[];
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  attendance,
  setAttendance,
  employees
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckIn = (employeeId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setAttendance(prev => {
      const existing = prev.find(a => a.employeeId === employeeId && a.date === todayStr);
      if (existing) {
        return prev.map(a => a.id === existing.id ? { ...a, checkIn: timeStr, status: 'Present' } : a);
      } else {
        const newAtt: Attendance = {
          id: `att-${Date.now()}`,
          employeeId,
          date: todayStr,
          checkIn: timeStr,
          checkOut: '-',
          status: 'Present'
        };
        return [newAtt, ...prev];
      }
    });
  };

  const handleCheckOut = (employeeId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setAttendance(prev => {
      return prev.map(a => {
        if (a.employeeId === employeeId && a.date === todayStr) {
          return { ...a, checkOut: timeStr };
        }
        return a;
      });
    });
  };

  const presentCount = attendance.filter(a => a.date === selectedDate && (a.status === 'Present' || a.status === 'Late')).length;
  const absentCount = attendance.filter(a => a.date === selectedDate && a.status === 'Absent').length;
  const lateCount = attendance.filter(a => a.date === selectedDate && a.status === 'Late').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Management</h2>
          <p className="text-sm text-slate-500">Track daily check-ins, check-outs, lateness, and monthly records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{presentCount}</h3>
            <p className="text-xs font-medium text-slate-500">Present Today</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{absentCount}</h3>
            <p className="text-xs font-medium text-slate-500">Absent Today</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{lateCount}</h3>
            <p className="text-xs font-medium text-slate-500">Late Arrivals</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{Math.round((presentCount / (employees.length || 1)) * 100)}%</h3>
            <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">Attendance Log — {selectedDate}</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Half-day">Half-day</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {employees.map((emp) => {
                const record = attendance.find(a => a.employeeId === emp.id && a.date === selectedDate);
                const status = record ? record.status : 'Absent';
                
                if (filterStatus !== 'All' && status !== filterStatus) return null;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs leading-tight">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                      {emp.department}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono font-medium text-slate-800">
                      {record?.checkIn || '-'}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono font-medium text-slate-800">
                      {record?.checkOut || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        status === 'Present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        status === 'Late' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        status === 'Half-day' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status === 'Present' ? 'bg-emerald-500' :
                          status === 'Late' ? 'bg-amber-500' :
                          status === 'Half-day' ? 'bg-blue-500' : 'bg-rose-500'
                        }`}></span>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {selectedDate === todayStr && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCheckIn(emp.id)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                          >
                            Check In
                          </button>
                          <button
                            onClick={() => handleCheckOut(emp.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                          >
                            Check Out
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
