import React, { useState } from 'react';
import { Laptop, Plus, User, Calendar, Trash2, X, ShieldCheck } from 'lucide-react';
import { CompanyAsset, Employee } from '../types';

interface AssetsTabProps {
  assets: CompanyAsset[];
  setAssets: React.Dispatch<React.SetStateAction<CompanyAsset[]>>;
  employees: Employee[];
}

export const AssetsTab: React.FC<AssetsTabProps> = ({ assets, setAssets, employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetName: '',
    serialNumber: '',
    category: 'Laptop' as CompanyAsset['category'],
    assignedTo: employees[0]?.id || '',
    status: 'Assigned' as CompanyAsset['status']
  });

  const employeeMap = new Map(employees.map(e => [e.id, e]));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetName || !formData.serialNumber) return;

    const newAsset: CompanyAsset = {
      id: `ast-${Date.now()}`,
      ...formData,
      assignedDate: new Date().toISOString().split('T')[0]
    };

    setAssets(prev => [newAsset, ...prev]);
    setIsModalOpen(false);
    setFormData({
      assetName: '',
      serialNumber: '',
      category: 'Laptop',
      assignedTo: employees[0]?.id || '',
      status: 'Assigned'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove asset record?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Company Asset & Equipment Management</h2>
          <p className="text-sm text-slate-500">Track company laptops, monitors, mobile devices, and access cards assigned to employees.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Asset</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Asset Name & Serial</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Assigned Employee</th>
                <th className="py-3.5 px-4">Assigned Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">No assets recorded.</td>
                </tr>
              ) : (
                assets.map((asset) => {
                  const emp = employeeMap.get(asset.assignedTo);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-xs">{asset.assetName}</div>
                        <div className="text-[11px] font-mono text-slate-400">S/N: {asset.serialNumber}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                          {asset.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          {emp ? (
                            <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border" />
                          ) : null}
                          <span className="text-xs font-semibold text-slate-800">{emp?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">{asset.assignedDate}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          asset.status === 'Assigned' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Assigned' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Assign New Company Asset</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  placeholder="e.g. MacBook Pro 16 M3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Serial Number / IMEI *</label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g. C02G90XYZ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Access Card">Access Card</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign To Employee</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                    ))}
                  </select>
                </div>
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
                  Record Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
