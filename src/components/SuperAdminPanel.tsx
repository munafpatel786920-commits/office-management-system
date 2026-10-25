import React, { useState } from 'react';
import { Shield, Key, Building2, Trash2, Plus, LogOut, CheckCircle2, Mail, Lock, UserCheck } from 'lucide-react';
import { UserRole } from '../types';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export interface BuyerAccount {
  id: string;
  email: string;
  password: string;
  companyName: string;
  plan: string;
  createdAt: string;
}

interface SuperAdminPanelProps {
  onLogout: () => void;
  onResetData: () => void;
  buyerAccounts: BuyerAccount[];
  setBuyerAccounts: React.Dispatch<React.SetStateAction<BuyerAccount[]>>;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({
  onLogout,
  onResetData,
  buyerAccounts,
  setBuyerAccounts
}) => {
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [buyerPlan, setBuyerPlan] = useState('Enterprise Plan');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleAddBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const email = buyerEmail.trim().toLowerCase();
    const pass = buyerPassword.trim();
    const comp = companyName.trim();

    if (!email || !pass || !comp) {
      setError('All fields (Email, Password, Company Name) are required.');
      return;
    }

    if (buyerAccounts.some(b => b.email.toLowerCase() === email)) {
      setError('A buyer account with this email already exists.');
      return;
    }

    const newBuyer: BuyerAccount = {
      id: Date.now().toString(),
      email,
      password: pass,
      companyName: comp,
      plan: buyerPlan,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDoc(doc(db, 'buyerAccounts', newBuyer.id), newBuyer)
      .then(() => {
        setBuyerEmail('');
        setBuyerPassword('');
        setCompanyName('');
        setSuccessMsg(`Buyer license successfully created for ${comp}!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `buyerAccounts/${newBuyer.id}`));
  };

  const handleDeleteBuyer = (id: string) => {
    if (confirm('Are you sure you want to revoke this buyer license?')) {
      deleteDoc(doc(db, 'buyerAccounts', id))
        .then(() => {
          setSuccessMsg('Buyer license revoked successfully.');
          setTimeout(() => setSuccessMsg(''), 3000);
        })
        .catch(err => handleFirestoreError(err, OperationType.DELETE, `buyerAccounts/${id}`));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Super Admin Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              WorkPulse Super Admin Panel
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase border border-purple-500/30">
                Master Authority
              </span>
            </h1>
            <p className="text-xs text-slate-400">Logged in as patelmunaf90@gmail.com (Cloud Firestore Synced)</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Super Admin Logout</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-8 space-y-8">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active App Buyers</span>
              <UserCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{buyerAccounts.length}</div>
            <p className="text-xs text-slate-500 mt-1">Licensed corporate clients</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Super Admin ID</span>
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-sm font-bold text-white truncate">patelmunaf90@gmail.com</div>
            <p className="text-xs text-emerald-400 mt-1">● Master Access Active</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Status</span>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">ONLINE</div>
            <p className="text-xs text-slate-500 mt-1">Firebase Firestore Connected</p>
          </div>
        </div>

        {/* Buyer License Generation Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" /> Create App Buyer / Client License
            </h2>
            <p className="text-xs text-slate-400">
              Generate login credentials (Email ID and Password) for clients who purchase the WorkPulse app. Data is saved in Google Firebase.
            </p>
          </div>

          <form onSubmit={handleAddBuyer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Tech Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Client Email ID</label>
              <input
                type="email"
                required
                placeholder="buyer@company.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Password</label>
              <input
                type="text"
                required
                placeholder="Assign password"
                value={buyerPassword}
                onChange={(e) => setBuyerPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">License Plan</label>
              <select
                value={buyerPlan}
                onChange={(e) => setBuyerPlan(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Enterprise Plan">Enterprise Plan</option>
                <option value="Professional Plan">Professional Plan</option>
                <option value="Standard Plan">Standard Plan</option>
                <option value="Starter Plan">Starter Plan</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
              >
                <Plus className="w-4 h-4" /> Issue License
              </button>
            </div>
          </form>

          {/* Buyers Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Client Email ID</th>
                  <th className="p-4">Assigned Password</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Issued Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {buyerAccounts.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-400" />
                      {b.companyName}
                    </td>
                    <td className="p-4 text-slate-300">{b.email}</td>
                    <td className="p-4 font-mono font-bold text-purple-400">{b.password}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {b.plan}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">{b.createdAt}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteBuyer(b.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Revoke License"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
