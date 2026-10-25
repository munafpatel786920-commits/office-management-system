import React, { useState } from 'react';
import { Award, Plus, Star, User, Calendar, Trash2, X } from 'lucide-react';
import { Appraisal, Employee } from '../types';

interface AppraisalsTabProps {
  appraisals: Appraisal[];
  setAppraisals: React.Dispatch<React.SetStateAction<Appraisal[]>>;
  employees: Employee[];
}

export const AppraisalsTab: React.FC<AppraisalsTabProps> = ({ appraisals, setAppraisals, employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || '',
    reviewPeriod: '2026 Q3 Review',
    rating: 5,
    strengths: '',
    improvements: '',
    reviewer: 'Sarah Jenkins (VP Engineering)'
  });

  const employeeMap = new Map(employees.map(e => [e.id, e]));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.strengths) return;

    const newAppr: Appraisal = {
      id: `app-${Date.now()}`,
      ...formData,
      reviewDate: new Date().toISOString().split('T')[0]
    };

    setAppraisals(prev => [newAppr, ...prev]);
    setIsModalOpen(false);
    setFormData({
      employeeId: employees[0]?.id || '',
      reviewPeriod: '2026 Q3 Review',
      rating: 5,
      strengths: '',
      improvements: '',
      reviewer: 'Sarah Jenkins (VP Engineering)'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete review record?')) {
      setAppraisals(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance Reviews & Appraisals</h2>
          <p className="text-sm text-slate-500">Conduct quarterly performance appraisals, rating scores, strengths, and feedback.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Appraisal Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appraisals.map((appr) => {
          const emp = employeeMap.get(appr.employeeId);
          return (
            <div key={appr.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {emp ? (
                      <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover border" />
                    ) : null}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{emp?.name || appr.employeeId}</h3>
                      <p className="text-xs text-slate-400">{emp?.designation} • {emp?.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(appr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-b border-slate-100 mb-4 text-xs">
                  <span className="font-semibold text-slate-600">{appr.reviewPeriod}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{appr.rating} / 5.0</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Key Strengths:</span>
                    <p className="leading-relaxed">{appr.strengths}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Growth Opportunities:</span>
                    <p className="leading-relaxed">{appr.improvements}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Reviewer: {appr.reviewer}</span>
                <span>Date: {appr.reviewDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">New Performance Appraisal</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Review Period</label>
                  <input
                    type="text"
                    value={formData.reviewPeriod}
                    onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1 - 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-bold text-amber-600"
                  >
                    <option value="5">5.0 — Outstanding</option>
                    <option value="4">4.0 — Exceeds Expectations</option>
                    <option value="3">3.0 — Meets Expectations</option>
                    <option value="2">2.0 — Needs Improvement</option>
                    <option value="1">1.0 — Unsatisfactory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Strengths *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  placeholder="Highlight key achievements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Areas for Growth / Feedback</label>
                <textarea
                  rows={3}
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  placeholder="Constructive feedback..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/25"
                >
                  Save Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
