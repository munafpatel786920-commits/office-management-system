import React, { useState } from 'react';
import { 
  Receipt, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText, 
  X,
  Printer,
  Building,
  Phone,
  MapPin,
  Edit3
} from 'lucide-react';
import { Payroll, Employee } from '../types';

interface PayrollTabProps {
  payroll: Payroll[];
  setPayroll: React.Dispatch<React.SetStateAction<Payroll[]>>;
  employees: Employee[];
  currencySymbol: string;
  companyName: string;
  companyLogo: string;
}

export const PayrollTab: React.FC<PayrollTabProps> = ({ 
  payroll, 
  setPayroll, 
  employees,
  currencySymbol,
  companyName,
  companyLogo
}) => {
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);
  const [editingRecord, setEditingRecord] = useState<Payroll | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    bonus: 0,
    status: 'Paid' as Payroll['status']
  });

  const companyAddress = localStorage.getItem('workpulse_comp_address') || '100 Global Towers, Business Bay';
  const companyPhone = localStorage.getItem('workpulse_comp_phone') || '+971 4 555 0199';
  const selectedCountry = localStorage.getItem('workpulse_country') || 'United Arab Emirates';

  const togglePaymentStatus = (id: string) => {
    setPayroll(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Paid' ? 'Pending' : 'Paid' } : p));
  };

  const handleOpenEdit = (record: Payroll) => {
    setEditingRecord(record);
    setEditForm({
      baseSalary: record.baseSalary,
      allowances: record.allowances,
      deductions: record.deductions,
      bonus: record.bonus,
      status: record.status
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const netSalary = Number(editForm.baseSalary) + Number(editForm.allowances) - Number(editForm.deductions) + Number(editForm.bonus);

    setPayroll(prev => prev.map(p => {
      if (p.id === editingRecord.id) {
        return {
          ...p,
          baseSalary: Number(editForm.baseSalary),
          allowances: Number(editForm.allowances),
          deductions: Number(editForm.deductions),
          bonus: Number(editForm.bonus),
          netSalary,
          status: editForm.status
        };
      }
      return p;
    }));

    setEditingRecord(null);
  };

  const totalPaid = payroll.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalPending = payroll.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.netSalary, 0);

  const employeeMap = new Map(employees.map(e => [e.id, e]));

  const handleDownloadHtmlPayslip = () => {
    if (!selectedPayslip) return;
    const emp = employeeMap.get(selectedPayslip.employeeId);
    const payslipHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payslip - ${emp?.name || 'Employee'}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
            .card { max-width: 700px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px; }
            .company-name { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
            .company-info { font-size: 12px; color: #64748b; }
            .payslip-title { font-size: 14px; font-weight: bold; color: #3b82f6; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .emp-grid { display: flex; justify-content: space-between; background: #f1f5f9; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; font-size: 13px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .total { font-size: 18px; font-weight: 800; border-top: 2px solid #cbd5e1; padding-top: 15px; margin-top: 20px; color: #0f172a; }
            .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; pt: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="company-name">${companyName}</div>
              <div class="company-info">${companyAddress} • Ph: ${companyPhone} • Region: ${selectedCountry}</div>
              <div class="payslip-title">Official Salary Payslip — ${selectedPayslip.month}</div>
            </div>
            
            <div class="emp-grid">
              <div>
                <strong>Employee Name:</strong> ${emp?.name}<br/>
                <strong>Employee ID:</strong> ${emp?.id}<br/>
                <strong>Department:</strong> ${emp?.department}
              </div>
              <div style="text-align: right;">
                <strong>Designation:</strong> ${emp?.designation}<br/>
                <strong>Joining Date:</strong> ${emp?.joiningDate}<br/>
                <strong>Status:</strong> ${selectedPayslip.status}
              </div>
            </div>

            <div class="row"><span>Base Salary</span> <strong>${currencySymbol}${selectedPayslip.baseSalary.toLocaleString()}</strong></div>
            <div class="row"><span>Allowances (Housing & Transport)</span> <strong style="color: #059669;">+${currencySymbol}${selectedPayslip.allowances.toLocaleString()}</strong></div>
            <div class="row"><span>Deductions (Tax & Insurance)</span> <strong style="color: #dc2626;">-${currencySymbol}${selectedPayslip.deductions.toLocaleString()}</strong></div>
            <div class="row"><span>Performance Bonus</span> <strong style="color: #2563eb;">+${currencySymbol}${selectedPayslip.bonus.toLocaleString()}</strong></div>

            <div class="row total">
              <span>Net Pay Disbursement</span>
              <span>${currencySymbol}${selectedPayslip.netSalary.toLocaleString()}</span>
            </div>

            <div class="footer">
              This is a computer-generated official document from ${companyName}. No signature is required.
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([payslipHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip-${emp?.name?.replace(/\s+/g, '_') || 'Employee'}-${selectedPayslip.month.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Salary & Payroll Management</h2>
          <p className="text-sm text-slate-500">Maintain monthly salary summaries, allowances, bonuses, and manually editable payslips ({selectedCountry} - {currencySymbol.trim()}).</p>
        </div>
        <button
          onClick={() => alert('Payroll generated successfully for October 2026')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
        >
          <Receipt className="w-4 h-4" />
          <span>Run October Payroll</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <span className="text-lg font-black">{currencySymbol.trim()}</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{currencySymbol}{(totalPaid + totalPending).toLocaleString()}</h3>
            <p className="text-xs font-medium text-slate-500">Total Monthly Payroll</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{currencySymbol}{totalPaid.toLocaleString()}</h3>
            <p className="text-xs font-medium text-slate-500">Paid Out</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{currencySymbol}{totalPending.toLocaleString()}</h3>
            <p className="text-xs font-medium text-slate-500">Pending Disbursements</p>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">October 2026 Salary Records ({selectedCountry})</h3>
          <span className="text-xs font-semibold text-blue-600">8 Employees</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Bonus</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payroll.map((item) => {
                const emp = employeeMap.get(item.employeeId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {emp ? (
                          <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-200"></div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{emp?.name || item.employeeId}</div>
                          <div className="text-[11px] text-slate-400">{emp?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">{currencySymbol}{item.baseSalary.toLocaleString()}</td>
                    <td className="py-4 px-4 text-xs font-medium text-emerald-600">+{currencySymbol}{item.allowances}</td>
                    <td className="py-4 px-4 text-xs font-medium text-rose-600">-{currencySymbol}{item.deductions}</td>
                    <td className="py-4 px-4 text-xs font-medium text-blue-600">+{currencySymbol}{item.bonus}</td>
                    <td className="py-4 px-4 text-xs font-black text-slate-900">{currencySymbol}{item.netSalary.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => togglePaymentStatus(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-transform hover:scale-105 ${
                          item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {item.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
                          title="Edit Payslip Manually"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setSelectedPayslip(item)}
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
                          title="View Payslip"
                        >
                          <FileText className="w-3.5 h-3.5" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Edit Payslip Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base">Edit Payslip Manually</h3>
              <button onClick={() => setEditingRecord(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Salary ({currencySymbol.trim()})</label>
                <input
                  type="number"
                  required
                  value={editForm.baseSalary}
                  onChange={(e) => setEditForm({ ...editForm, baseSalary: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Allowances ({currencySymbol.trim()})</label>
                <input
                  type="number"
                  required
                  value={editForm.allowances}
                  onChange={(e) => setEditForm({ ...editForm, allowances: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deductions ({currencySymbol.trim()})</label>
                <input
                  type="number"
                  required
                  value={editForm.deductions}
                  onChange={(e) => setEditForm({ ...editForm, deductions: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 text-rose-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Performance Bonus ({currencySymbol.trim()})</label>
                <input
                  type="number"
                  required
                  value={editForm.bonus}
                  onChange={(e) => setEditForm({ ...editForm, bonus: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 text-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-sm font-bold">
                <span>Calculated Net Salary:</span>
                <span className="text-blue-600">
                  {currencySymbol}{(Number(editForm.baseSalary) + Number(editForm.allowances) - Number(editForm.deductions) + Number(editForm.bonus)).toLocaleString()}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Save Payslip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal with Company Logo, Name, Address & Phone */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <img 
                  src={companyLogo} 
                  alt={companyName} 
                  className="w-8 h-8 rounded-lg object-cover bg-white border border-slate-700" 
                />
                <div>
                  <h3 className="font-bold text-xs leading-tight">{companyName}</h3>
                  <span className="text-[10px] text-blue-400">Official Salary Payslip</span>
                </div>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              {/* Company Header details on payslip */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" /> {companyName}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {companyAddress}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {companyPhone} • Region: {selectedCountry}
                </div>
              </div>

              {(() => {
                const emp = employeeMap.get(selectedPayslip.employeeId);
                return (
                  <>
                    <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{emp?.name}</h4>
                        <p className="text-xs text-slate-500">{emp?.designation} • {emp?.department}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                          {selectedPayslip.month}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">ID: {emp?.id}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 py-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Base Salary</span>
                        <span className="font-semibold text-slate-800">{currencySymbol}{selectedPayslip.baseSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Allowances (Housing & Transport)</span>
                        <span className="font-semibold text-emerald-600">+{currencySymbol}{selectedPayslip.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Deductions (Tax & Insurance)</span>
                        <span className="font-semibold text-rose-600">-{currencySymbol}{selectedPayslip.deductions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Performance Bonus</span>
                        <span className="font-semibold text-blue-600">+{currencySymbol}{selectedPayslip.bonus.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                      <span className="font-bold text-slate-700 text-sm">Net Pay Disbursement</span>
                      <span className="font-black text-slate-900 text-xl">{currencySymbol}{selectedPayslip.netSalary.toLocaleString()}</span>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                      <button
                        onClick={handleDownloadHtmlPayslip}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download PDF/HTML
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer"
                      >
                        <Printer className="w-4 h-4" /> Print / Save as PDF
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
