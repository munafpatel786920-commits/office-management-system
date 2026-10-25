import React from 'react';
import { BarChart3, Download, Printer, TrendingUp, Users, Clock, Receipt, CalendarDays, Building2, Laptop, Award } from 'lucide-react';
import { Employee, Attendance, Task, LeaveRequest, Payroll, Department, CompanyAsset, Appraisal } from '../types';

interface ReportsTabProps {
  employees: Employee[];
  attendance: Attendance[];
  tasks: Task[];
  leaveRequests: LeaveRequest[];
  payroll: Payroll[];
  departments: Department[];
  assets: CompanyAsset[];
  appraisals: Appraisal[];
  currencySymbol: string;
  companyName: string;
  companyLogo: string;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  employees,
  attendance,
  tasks,
  leaveRequests,
  payroll,
  departments,
  assets,
  appraisals,
  currencySymbol,
  companyName,
  companyLogo
}) => {
  const companyAddress = localStorage.getItem('workpulse_comp_address') || '100 Global Towers, Business Bay';
  const companyPhone = localStorage.getItem('workpulse_comp_phone') || '+971 4 555 0199';
  const selectedCountry = localStorage.getItem('workpulse_country') || 'United Arab Emirates';

  const generateReportHtml = (title: string, contentHtml: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${companyName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
            .card { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px; }
            .company-name { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
            .company-info { font-size: 12px; color: #64748b; }
            .report-title { font-size: 16px; font-weight: bold; color: #3b82f6; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; }
            th { background: #f1f5f9; color: #334155; font-weight: 700; }
            .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="company-name">${companyName}</div>
              <div class="company-info">${companyAddress} • Ph: ${companyPhone} • Region: ${selectedCountry}</div>
              <div class="report-title">${title}</div>
            </div>
            ${contentHtml}
            <div class="footer">
              Generated via WorkPulse Office Management System on ${new Date().toLocaleDateString()}. Official Company Report.
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const downloadReport = (title: string, htmlContent: string) => {
    const fullHtml = generateReportHtml(title, htmlContent);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReport = (title: string, htmlContent: string) => {
    const fullHtml = generateReportHtml(title, htmlContent);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(fullHtml);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  const attendanceHtml = `
    <p><strong>Total Logs Recorded:</strong> ${attendance.length}</p>
    <table>
      <thead>
        <tr><th>Employee ID</th><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${attendance.map(a => `<tr><td>${a.employeeId}</td><td>${a.date}</td><td>${a.checkIn}</td><td>${a.checkOut}</td><td>${a.status}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const payrollHtml = `
    <p><strong>Total Monthly Payroll Outflow:</strong> ${currencySymbol}${payroll.reduce((a, c) => a + c.netSalary, 0).toLocaleString()}</p>
    <table>
      <thead>
        <tr><th>Employee ID</th><th>Month</th><th>Base Salary</th><th>Allowances</th><th>Deductions</th><th>Net Salary</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${payroll.map(p => `<tr><td>${p.employeeId}</td><td>${p.month}</td><td>${currencySymbol}${p.baseSalary}</td><td>+${currencySymbol}${p.allowances}</td><td>-${currencySymbol}${p.deductions}</td><td><strong>${currencySymbol}${p.netSalary}</strong></td><td>${p.status}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const employeeHtml = `
    <p><strong>Total Active Employees:</strong> ${employees.length}</p>
    <table>
      <thead>
        <tr><th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Email</th><th>Salary</th></tr>
      </thead>
      <tbody>
        ${employees.map(e => `<tr><td>${e.id}</td><td>${e.name}</td><td>${e.department}</td><td>${e.designation}</td><td>${e.email}</td><td>${currencySymbol}${e.salary.toLocaleString()}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const tasksHtml = `
    <p><strong>Total Tasks:</strong> ${tasks.length}</p>
    <table>
      <thead>
        <tr><th>Title</th><th>Priority</th><th>Status</th><th>Deadline</th><th>Assigned To</th></tr>
      </thead>
      <tbody>
        ${tasks.map(t => `<tr><td>${t.title}</td><td>${t.priority}</td><td>${t.status}</td><td>${t.deadline}</td><td>${t.assignedTo}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const leavesHtml = `
    <p><strong>Total Leave Requests:</strong> ${leaveRequests.length}</p>
    <table>
      <thead>
        <tr><th>Employee ID</th><th>Leave Type</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${leaveRequests.map(l => `<tr><td>${l.employeeId}</td><td>${l.leaveType}</td><td>${l.startDate}</td><td>${l.endDate}</td><td>${l.reason}</td><td><strong>${l.status}</strong></td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const departmentsHtml = `
    <p><strong>Total Active Departments:</strong> ${departments.length}</p>
    <table>
      <thead>
        <tr><th>Department Name</th><th>Department Head</th><th>Headcount</th><th>Budget</th></tr>
      </thead>
      <tbody>
        ${departments.map(d => `<tr><td>${d.name}</td><td>${d.head}</td><td>${d.headCount} staff</td><td>${currencySymbol}${d.budget.toLocaleString()}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const assetsHtml = `
    <p><strong>Total Assets Recorded:</strong> ${assets.length}</p>
    <table>
      <thead>
        <tr><th>Asset Name</th><th>Serial Number</th><th>Category</th><th>Assigned To</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${assets.map(ast => `<tr><td>${ast.assetName}</td><td>${ast.serialNumber}</td><td>${ast.category}</td><td>${ast.assignedTo}</td><td>${ast.status}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  const appraisalsHtml = `
    <p><strong>Total Performance Reviews:</strong> ${appraisals.length}</p>
    <table>
      <thead>
        <tr><th>Employee ID</th><th>Review Period</th><th>Rating</th><th>Reviewer</th><th>Date</th></tr>
      </thead>
      <tbody>
        ${appraisals.map(appr => `<tr><td>${appr.employeeId}</td><td>${appr.reviewPeriod}</td><td><strong>${appr.rating} / 5.0</strong></td><td>${appr.reviewer}</td><td>${appr.reviewDate}</td></tr>`).join('')}
      </tbody>
    </table>
  `;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Generate, download PDF/HTML, and print comprehensive corporate reports ({selectedCountry}).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Attendance & Punctuality Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Detailed breakdown of daily check-ins, punctuality rates, tardiness patterns, and absenteeism across all departments.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Total Recorded Logs:</span>
                <span className="font-bold">{attendance.length} records</span>
              </div>
              <div className="flex justify-between">
                <span>Average Monthly Attendance:</span>
                <span className="font-bold text-emerald-600">95.4%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Attendance Summary', attendanceHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Attendance Summary', attendanceHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Payroll Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Payroll & Compensation Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Comprehensive financial report covering base salaries, allowances, statutory deductions, performance bonuses, and net disbursements.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Total Monthly Payroll Outflow:</span>
                <span className="font-bold">{currencySymbol}{payroll.reduce((a, c) => a + c.netSalary, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Disbursement Status:</span>
                <span className="font-bold text-emerald-600">75% Paid</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Payroll Financial', payrollHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Payroll Financial', payrollHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Employee Directory Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Employee Headcount & Tenure Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Staff directory analytics segmented by department hierarchy, job roles, joining dates, and employment status.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Total Active Staff:</span>
                <span className="font-bold">{employees.length} employees</span>
              </div>
              <div className="flex justify-between">
                <span>Departments:</span>
                <span className="font-bold">6 active units</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Employee Directory', employeeHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Employee Directory', employeeHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Task Progress Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Task & Project Performance Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Project tracking report measuring completion rates, overdue items, and task priorities across engineering and product teams.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Active Tasks:</span>
                <span className="font-bold">{tasks.length} total</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate:</span>
                <span className="font-bold text-purple-600">
                  {Math.round((tasks.filter(t => t.status === 'Completed').length / (tasks.length || 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Task Performance', tasksHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Task Performance', tasksHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Leave Utilization Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Leave Utilization Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Track annual leaves, sick leaves, pending applications, and leave balances across company personnel.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Total Leave Requests:</span>
                <span className="font-bold">{leaveRequests.length} requests</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Leave Utilization', leavesHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Leave Utilization', leavesHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Department Budget Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Department Budget & Headcount Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Departmental analysis of allocated budgets, heads, and team staffing levels.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Active Departments:</span>
                <span className="font-bold">{departments.length} units</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Department Budget', departmentsHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Department Budget', departmentsHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Asset Audit Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Company Asset & Equipment Audit Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Inventory audit report listing assigned laptops, monitors, mobile devices, and serial numbers.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Total Assets Tracked:</span>
                <span className="font-bold">{assets.length} items</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Asset Audit', assetsHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Asset Audit', assetsHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Performance Appraisal Summary Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Performance Appraisal Summary Report</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Aggregated review ratings, strengths, and feedback across staff appraisals.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Completed Appraisals:</span>
                <span className="font-bold">{appraisals.length} reviews</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReport('Performance Appraisal Summary', appraisalsHtml)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button
              onClick={() => printReport('Performance Appraisal Summary', appraisalsHtml)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
