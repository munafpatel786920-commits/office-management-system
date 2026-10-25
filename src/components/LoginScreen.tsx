import React, { useState } from 'react';
import { Key, Shield, ArrowRight, Lock, Mail, Building2, UserCheck, CheckCircle2, Zap, Users, Receipt, Sparkles, Database, Briefcase } from 'lucide-react';
import { UserRole, AccessKey } from '../types';
import { BuyerAccount } from './SuperAdminPanel';

interface LoginScreenProps {
  onLogin: (role: UserRole, keyUsed: string) => void;
  companyName: string;
  companyLogo: string;
  buyerAccounts: BuyerAccount[];
  accessKeys: AccessKey[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLogin, 
  companyName, 
  companyLogo,
  buyerAccounts,
  accessKeys
}) => {
  const [accessKey, setAccessKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Super Admin
    if (cleanEmail === 'patelmunaf90@gmail.com' && cleanPass === 'munaf786') {
      onLogin('SuperAdmin', cleanEmail);
      return;
    }

    // 2. Check App Buyer / Client accounts
    const matchedBuyer = buyerAccounts.find(b => b.email.toLowerCase() === cleanEmail && b.password === cleanPass);
    if (matchedBuyer) {
      localStorage.setItem('workpulse_comp_name', matchedBuyer.companyName);
      onLogin('Admin', cleanEmail);
      return;
    }

    setError('Invalid Email ID or Password.');
  };

  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = accessKey.trim();

    const matched = accessKeys.find(k => k.key === cleanKey);
    if (matched) {
      onLogin(matched.role, cleanKey);
    } else {
      setError('Invalid 4-digit Access Key PIN.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-12 selection:bg-blue-500 selection:text-white">
      
      {/* Left Column: App Advertising & Feature Showcase */}
      <div className="w-full lg:w-1/2 max-w-2xl text-white space-y-8 p-6 lg:p-12 animate-in fade-in slide-in-from-left duration-500">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Next-Gen Enterprise HRMS</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white">
            Office Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">System</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            The ultimate cloud-powered HR, payroll, attendance, and corporate task management platform built for modern enterprises. Powered by Google Firebase.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Employee Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Complete staff profiles, roles & departments.</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Global Payroll</h3>
              <p className="text-xs text-slate-400 mt-0.5">Multi-currency salary & allowance automation.</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Task & Leave Flow</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time task boards & leave approvals.</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Firebase Cloud</h3>
              <p className="text-xs text-slate-400 mt-0.5">Instant sync, secure Firestore storage & auth.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Grade Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>99.9% Uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="w-full lg:w-1/2 max-w-md flex items-center justify-center p-4">
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-in fade-in zoom-in-95 duration-300 space-y-6">
          {/* Header Branding with Office Management System Logo Badge */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xl border border-white/20">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Portal</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Enter 4-Digit Access Key PIN to Sign In</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in shake">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Enter 4-Digit Access Key PIN */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Staff Access Key PIN</span>
            </div>
            <form onSubmit={handlePinLogin} className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={4}
                  inputMode="numeric"
                  required
                  placeholder="e.g. 1234"
                  value={accessKey}
                  onChange={(e) => { 
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setAccessKey(val); 
                    setError(''); 
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-lg tracking-widest text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-bold text-center"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <span>Authenticate with PIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Super Admin & Buyer Login Toggle Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => { setShowEmailModal(true); setError(''); }}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 underline transition-colors cursor-pointer"
            >
              Super Admin & App Buyer Login (Email / Password)
            </button>
          </div>

          <div className="text-center pt-2 space-y-1 border-t border-slate-100">
            <p className="text-[11px] text-slate-600 font-medium">
              Copyright Global software contact for support <a href="mailto:patelmunaf90@gmail.com" className="text-purple-600 underline hover:text-purple-800 font-bold">patelmunaf90@gmail.com</a>
            </p>
            <span className="text-[10px] text-slate-400 block">
              Office Management System • Enterprise Security
            </span>
          </div>
        </div>
      </div>

      {/* Email & Password Login Modal for Super Admin & Buyers */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Super Admin & App Buyer Login</span>
              </div>
              <button 
                onClick={() => { setShowEmailModal(false); setError(''); }}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold rounded-lg"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email ID"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full bg-white border border-purple-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="w-full bg-white border border-purple-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <span>Login with Email & Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
