import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Building, Lock, Save, RefreshCw, Upload, Globe, Key, Trash2, Plus, Copy, Check } from 'lucide-react';
import { UserRole, AccessKey } from '../types';

interface SettingsTabProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onResetData: () => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  companyLogo: string;
  setCompanyLogo: (logo: string) => void;
}

const defaultKeys: AccessKey[] = [
  { id: '1', key: '1234', role: 'Admin', name: 'Master Admin Key', createdAt: '2026-01-01' },
  { id: '2', key: '5678', role: 'Manager', name: 'Operations Manager Key', createdAt: '2026-01-01' },
  { id: '3', key: '9012', role: 'Employee', name: 'Standard Employee Key', createdAt: '2026-01-01' },
];

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
  userRole, 
  setUserRole, 
  onResetData,
  selectedCountry,
  setSelectedCountry,
  currencySymbol,
  setCurrencySymbol,
  companyName,
  setCompanyName,
  companyLogo,
  setCompanyLogo
}) => {
  const [companyEmail, setCompanyEmail] = useState(() => localStorage.getItem('workpulse_comp_email') || 'admin@workpulse.io');
  const [companyAddress, setCompanyAddress] = useState(() => localStorage.getItem('workpulse_comp_address') || '100 Global Towers, Business Bay');
  const [companyPhone, setCompanyPhone] = useState(() => localStorage.getItem('workpulse_comp_phone') || '+971 4 555 0199');

  const [emailNotifications, setEmailNotifications] = useState(() => localStorage.getItem('workpulse_notif_email') !== 'false');
  const [pushNotifications, setPushNotifications] = useState(() => localStorage.getItem('workpulse_notif_push') !== 'false');

  // Access Keys Management State
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>(() => {
    try {
      const saved = localStorage.getItem('workpulse_access_keys');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultKeys;
  });

  const [newKeyRole, setNewKeyRole] = useState<UserRole>('Employee');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('workpulse_access_keys', JSON.stringify(accessKeys));
  }, [accessKeys]);

  const handleGenerateRandomKey = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setNewKeyValue(randomPin);
  };

  const handleCreateAccessKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newKeyValue.trim();
    if (cleanKey.length !== 4 || !/^\d{4}$/.test(cleanKey)) {
      alert('Access key must be exactly 4 digits (e.g. 2345).');
      return;
    }
    if (!newKeyName.trim()) {
      alert('Please provide a Key Name / Holder label.');
      return;
    }

    if (accessKeys.some(k => k.key === cleanKey)) {
      alert('This 4-digit access key already exists. Please use a unique 4-digit PIN.');
      return;
    }

    const newKeyObj: AccessKey = {
      id: Date.now().toString(),
      key: cleanKey,
      role: newKeyRole,
      name: newKeyName.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccessKeys([newKeyObj, ...accessKeys]);
    setNewKeyName('');
    setNewKeyValue('');
    alert(`4-digit access key (${cleanKey}) for ${newKeyRole} successfully created!`);
  };

  const handleDeleteAccessKey = (id: string) => {
    const target = accessKeys.find(k => k.id === id);
    if (target?.role === 'Admin' && accessKeys.filter(k => k.role === 'Admin').length <= 1) {
      alert('Cannot delete the last remaining Admin access key.');
      return;
    }
    const updated = accessKeys.filter(k => k.id !== id);
    setAccessKeys(updated);
    localStorage.setItem('workpulse_access_keys', JSON.stringify(updated));
  };

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const countries = [
    { name: 'United States', currency: '$', code: 'USD' },
    { name: 'United Kingdom', currency: '£', code: 'GBP' },
    { name: 'Canada', currency: 'CA$', code: 'CAD' },
    { name: 'India', currency: '₹', code: 'INR' },
    { name: 'Saudi Arabia', currency: 'SAR ', code: 'SAR' },
    { name: 'Dubai / Abu Dhabi (UAE)', currency: 'AED ', code: 'AED' },
  ];

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    const found = countries.find(c => c.name === countryName);
    if (found) {
      setCurrencySymbol(found.currency);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCompanyLogo(result);
        localStorage.setItem('workpulse_comp_logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('workpulse_comp_name', companyName);
    localStorage.setItem('workpulse_comp_email', companyEmail);
    localStorage.setItem('workpulse_comp_address', companyAddress);
    localStorage.setItem('workpulse_comp_phone', companyPhone);
    localStorage.setItem('workpulse_comp_logo', companyLogo);
    localStorage.setItem('workpulse_notif_email', String(emailNotifications));
    localStorage.setItem('workpulse_notif_push', String(pushNotifications));
    
    alert('Company settings successfully saved!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Settings & 4-Digit Access Key Management</h2>
        <p className="text-sm text-slate-500">Configure company profile, generate 4-digit PIN access keys, and manage regional preferences.</p>
      </div>

      {/* Admin Access Key Generation & Management Portal */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">4-Digit PIN Access Key Generation (Admin Panel)</h3>
              <p className="text-xs text-slate-500">Create and distribute secure 4-digit PIN keys (e.g. 2345) for Admin, Manager, and Employee roles.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
            {accessKeys.length} Active Keys
          </span>
        </div>

        {/* Create Key Form */}
        <form onSubmit={handleCreateAccessKey} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Generate New 4-Digit Login PIN</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
              <select
                value={newKeyRole}
                onChange={(e) => setNewKeyRole(e.target.value as UserRole)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Admin">Admin (Full Access)</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Holder Name / Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins (HR Mgr)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">4-Digit PIN (e.g. 2345)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  inputMode="numeric"
                  required
                  placeholder="2345"
                  value={newKeyValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setNewKeyValue(val);
                  }}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold tracking-widest text-center focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateRandomKey}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Auto Generate 4 Digits"
                >
                  Generate PIN
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create & Issue 4-Digit PIN</span>
            </button>
          </div>
        </form>

        {/* Existing Keys Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Active 4-Digit PIN Keys</h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {accessKeys.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                      item.role === 'Manager' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.role}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm truncate">{item.name}</h5>
                    <span className="text-[11px] text-slate-400">Created: {item.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-mono font-bold tracking-widest text-blue-700 border border-slate-200 select-all">
                      {item.key}
                    </code>
                    <button
                      onClick={() => handleCopyKey(item.key, item.id)}
                      className="text-slate-500 hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="Copy Key"
                    >
                      {copiedKeyId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy PIN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAccessKey(item.id);
                  }}
                  className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                  title="Delete PIN"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete PIN</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Region & Currency Selector */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-white text-base">Multi-Region & Currency Selector</h3>
          </div>
          <p className="text-xs text-blue-100">Select your operating country/region (USA, UK, Canada, India, Saudi Arabia, Dubai, Abu Dhabi). Salaries and reports adapt to local currency symbols ({currencySymbol}).</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-blue-100 mb-1">Operating Country / Region</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:bg-white/20 cursor-pointer font-semibold"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.name} className="text-slate-900">{c.name} ({c.code} - {c.currency})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-100 mb-1">Active Currency Symbol</label>
              <input
                type="text"
                readOnly
                value={`${currencySymbol} (${selectedCountry})`}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Company Profile & Logo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Company Information & Branding</h3>
          </div>

          {/* Company Logo Attachment */}
          <div className="flex items-center gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <img
              src={companyLogo}
              alt="Company Logo Preview"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0 bg-slate-200"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Company Logo Attachment</label>
              <div>
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo from Device</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrator Email</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile No.</label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={selectedCountry}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 font-semibold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Address</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Notification Preferences</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">Email notifications for leave requests & payroll</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">In-app push alerts for task deadlines</span>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Demo Data Reset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Reset Demo Workspace Data</h4>
            <p className="text-xs text-slate-500">Restore all initial employees, attendance logs, and sample tasks.</p>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Data
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
