import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { DashboardTab } from './components/DashboardTab';
import { EmployeesTab } from './components/EmployeesTab';
import { AttendanceTab } from './components/AttendanceTab';
import { TasksTab } from './components/TasksTab';
import { LeavesTab } from './components/LeavesTab';
import { DepartmentsTab } from './components/DepartmentsTab';
import { PayrollTab } from './components/PayrollTab';
import { AnnouncementsTab } from './components/AnnouncementsTab';
import { AssetsTab } from './components/AssetsTab';
import { AppraisalsTab } from './components/AppraisalsTab';
import { ReportsTab } from './components/ReportsTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { SettingsTab } from './components/SettingsTab';
import { SuperAdminPanel, BuyerAccount } from './components/SuperAdminPanel';
import { 
  initialEmployees, 
  initialDepartments, 
  initialAttendance, 
  initialTasks, 
  initialLeaveRequests, 
  initialPayroll, 
  initialNotifications,
  initialAnnouncements,
  initialAssets,
  initialAppraisals
} from './mockData';
import { 
  UserRole, 
  Employee, 
  Department, 
  Attendance, 
  Task, 
  LeaveRequest, 
  Payroll, 
  AppNotification, 
  Announcement, 
  CompanyAsset, 
  Appraisal,
  AccessKey 
} from './types';
import { Plus, X, Users, CheckSquare, CalendarDays, Receipt } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const defaultKeys: AccessKey[] = [
  { id: '1', key: '1234', role: 'Admin', name: 'Master Admin Key', createdAt: '2026-01-01' },
  { id: '2', key: '5678', role: 'Manager', name: 'Operations Manager Key', createdAt: '2026-01-01' },
  { id: '3', key: '9012', role: 'Employee', name: 'Standard Employee Key', createdAt: '2026-01-01' },
];

const defaultBuyers: BuyerAccount[] = [
  { id: '1', email: 'client@workpulse.com', password: 'password123', companyName: 'Acme Global Corp', plan: 'Enterprise Plan', createdAt: '2026-01-15' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('workpulse_logged_in') === 'true';
  });
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('workpulse_user_role') as UserRole) || 'Admin';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleLogin = (role: UserRole, keyUsed: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    localStorage.setItem('workpulse_logged_in', 'true');
    localStorage.setItem('workpulse_user_role', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('workpulse_logged_in');
  };

  useEffect(() => {
    localStorage.setItem('workpulse_user_role', userRole);
    if (userRole === 'Employee') {
      const allowed = ['dashboard', 'attendance', 'tasks', 'leaves', 'announcements', 'assets'];
      if (!allowed.includes(currentTab)) {
        setCurrentTab('dashboard');
      }
    } else if (userRole === 'Manager') {
      const restricted = ['payroll', 'settings'];
      if (restricted.includes(currentTab)) {
        setCurrentTab('dashboard');
      }
    }
  }, [userRole]);

  // Multi-region & Currency state
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem('workpulse_country') || 'Dubai / Abu Dhabi (UAE)';
  });
  const [currencySymbol, setCurrencySymbol] = useState(() => {
    return localStorage.getItem('workpulse_currency') || 'AED ';
  });

  // Company Name & Logo state
  const [companyName, setCompanyName] = useState(() => {
    return localStorage.getItem('workpulse_comp_name') || 'WorkPulse Global Inc.';
  });
  const [companyLogo, setCompanyLogo] = useState(() => {
    return localStorage.getItem('workpulse_comp_logo') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80';
  });

  useEffect(() => {
    localStorage.setItem('workpulse_country', selectedCountry);
    localStorage.setItem('workpulse_currency', currencySymbol);
  }, [selectedCountry, currencySymbol]);

  // Firestore-backed state
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments] = useState<Department[]>(initialDepartments);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [payroll, setPayroll] = useState<Payroll[]>(initialPayroll);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [assets, setAssets] = useState<CompanyAsset[]>(initialAssets);
  const [appraisals, setAppraisals] = useState<Appraisal[]>(initialAppraisals);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [buyerAccounts, setBuyerAccounts] = useState<BuyerAccount[]>(defaultBuyers);
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>(defaultKeys);

  // Sync with Firestore directly
  useEffect(() => {
    const unsubEmp = onSnapshot(collection(db, 'employees'), (snap) => {
      if (!snap.empty) {
        setEmployees(snap.docs.map(d => d.data() as Employee));
      } else {
        initialEmployees.forEach(item => {
          setDoc(doc(db, 'employees', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `employees/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'employees'));

    const unsubAtt = onSnapshot(collection(db, 'attendance'), (snap) => {
      if (!snap.empty) {
        setAttendance(snap.docs.map(d => d.data() as Attendance));
      } else {
        initialAttendance.forEach(item => {
          setDoc(doc(db, 'attendance', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `attendance/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'attendance'));

    const unsubTask = onSnapshot(collection(db, 'tasks'), (snap) => {
      if (!snap.empty) {
        setTasks(snap.docs.map(d => d.data() as Task));
      } else {
        initialTasks.forEach(item => {
          setDoc(doc(db, 'tasks', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `tasks/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'tasks'));

    const unsubLeave = onSnapshot(collection(db, 'leaveRequests'), (snap) => {
      if (!snap.empty) {
        setLeaveRequests(snap.docs.map(d => d.data() as LeaveRequest));
      } else {
        initialLeaveRequests.forEach(item => {
          setDoc(doc(db, 'leaveRequests', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `leaveRequests/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'leaveRequests'));

    const unsubPay = onSnapshot(collection(db, 'payroll'), (snap) => {
      if (!snap.empty) {
        setPayroll(snap.docs.map(d => d.data() as Payroll));
      } else {
        initialPayroll.forEach(item => {
          setDoc(doc(db, 'payroll', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `payroll/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'payroll'));

    const unsubAnn = onSnapshot(collection(db, 'announcements'), (snap) => {
      if (!snap.empty) {
        setAnnouncements(snap.docs.map(d => d.data() as Announcement));
      } else {
        initialAnnouncements.forEach(item => {
          setDoc(doc(db, 'announcements', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `announcements/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'announcements'));

    const unsubAst = onSnapshot(collection(db, 'assets'), (snap) => {
      if (!snap.empty) {
        setAssets(snap.docs.map(d => d.data() as CompanyAsset));
      } else {
        initialAssets.forEach(item => {
          setDoc(doc(db, 'assets', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `assets/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'assets'));

    const unsubApp = onSnapshot(collection(db, 'appraisals'), (snap) => {
      if (!snap.empty) {
        setAppraisals(snap.docs.map(d => d.data() as Appraisal));
      } else {
        initialAppraisals.forEach(item => {
          setDoc(doc(db, 'appraisals', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `appraisals/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'appraisals'));

    const unsubNotif = onSnapshot(collection(db, 'notifications'), (snap) => {
      if (!snap.empty) {
        setNotifications(snap.docs.map(d => d.data() as AppNotification));
      } else {
        initialNotifications.forEach(item => {
          setDoc(doc(db, 'notifications', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `notifications/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'notifications'));

    const unsubBuyers = onSnapshot(collection(db, 'buyerAccounts'), (snap) => {
      if (!snap.empty) {
        setBuyerAccounts(snap.docs.map(d => d.data() as BuyerAccount));
      } else {
        defaultBuyers.forEach(item => {
          setDoc(doc(db, 'buyerAccounts', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `buyerAccounts/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'buyerAccounts'));

    const unsubKeys = onSnapshot(collection(db, 'accessKeys'), (snap) => {
      if (!snap.empty) {
        setAccessKeys(snap.docs.map(d => d.data() as AccessKey));
      } else {
        defaultKeys.forEach(item => {
          setDoc(doc(db, 'accessKeys', item.id), item).catch(err => handleFirestoreError(err, OperationType.CREATE, `accessKeys/${item.id}`));
        });
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'accessKeys'));

    return () => {
      unsubEmp();
      unsubAtt();
      unsubTask();
      unsubLeave();
      unsubPay();
      unsubAnn();
      unsubAst();
      unsubApp();
      unsubNotif();
      unsubBuyers();
      unsubKeys();
    };
  }, []);

  // Helper updaters with Firestore sync
  const updateEmployees = (newEmployees: Employee[] | ((prev: Employee[]) => Employee[])) => {
    const updated = typeof newEmployees === 'function' ? newEmployees(employees) : newEmployees;
    setEmployees(updated);
    updated.forEach(emp => {
      setDoc(doc(db, 'employees', emp.id), emp).catch(err => handleFirestoreError(err, OperationType.WRITE, `employees/${emp.id}`));
    });
  };

  const updateAttendance = (newAtt: Attendance[] | ((prev: Attendance[]) => Attendance[])) => {
    const updated = typeof newAtt === 'function' ? newAtt(attendance) : newAtt;
    setAttendance(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'attendance', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `attendance/${item.id}`));
    });
  };

  const updateTasks = (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    const updated = typeof newTasks === 'function' ? newTasks(tasks) : newTasks;
    setTasks(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'tasks', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `tasks/${item.id}`));
    });
  };

  const updateLeaveRequests = (newLeaves: LeaveRequest[] | ((prev: LeaveRequest[]) => LeaveRequest[])) => {
    const updated = typeof newLeaves === 'function' ? newLeaves(leaveRequests) : newLeaves;
    setLeaveRequests(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'leaveRequests', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `leaveRequests/${item.id}`));
    });
  };

  const updatePayroll = (newPay: Payroll[] | ((prev: Payroll[]) => Payroll[])) => {
    const updated = typeof newPay === 'function' ? newPay(payroll) : newPay;
    setPayroll(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'payroll', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `payroll/${item.id}`));
    });
  };

  const updateAnnouncements = (newAnn: Announcement[] | ((prev: Announcement[]) => Announcement[])) => {
    const updated = typeof newAnn === 'function' ? newAnn(announcements) : newAnn;
    setAnnouncements(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'announcements', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `announcements/${item.id}`));
    });
  };

  const updateAssets = (newAst: CompanyAsset[] | ((prev: CompanyAsset[]) => CompanyAsset[])) => {
    const updated = typeof newAst === 'function' ? newAst(assets) : newAst;
    setAssets(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'assets', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `assets/${item.id}`));
    });
  };

  const updateAppraisals = (newApp: Appraisal[] | ((prev: Appraisal[]) => Appraisal[])) => {
    const updated = typeof newApp === 'function' ? newApp(appraisals) : newApp;
    setAppraisals(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'appraisals', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `appraisals/${item.id}`));
    });
  };

  const updateNotifications = (newNotif: AppNotification[] | ((prev: AppNotification[]) => AppNotification[])) => {
    const updated = typeof newNotif === 'function' ? newNotif(notifications) : newNotif;
    setNotifications(updated);
    updated.forEach(item => {
      setDoc(doc(db, 'notifications', item.id), item).catch(err => handleFirestoreError(err, OperationType.WRITE, `notifications/${item.id}`));
    });
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all demo workspace data in Firebase?')) {
      initialEmployees.forEach(i => setDoc(doc(db, 'employees', i.id), i));
      initialAttendance.forEach(i => setDoc(doc(db, 'attendance', i.id), i));
      initialTasks.forEach(i => setDoc(doc(db, 'tasks', i.id), i));
      initialLeaveRequests.forEach(i => setDoc(doc(db, 'leaveRequests', i.id), i));
      initialPayroll.forEach(i => setDoc(doc(db, 'payroll', i.id), i));
      initialAnnouncements.forEach(i => setDoc(doc(db, 'announcements', i.id), i));
      initialAssets.forEach(i => setDoc(doc(db, 'assets', i.id), i));
      initialAppraisals.forEach(i => setDoc(doc(db, 'appraisals', i.id), i));
      initialNotifications.forEach(i => setDoc(doc(db, 'notifications', i.id), i));
      localStorage.clear();
      alert('Workspace data successfully reset to defaults in Firebase.');
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        companyName={companyName} 
        companyLogo={companyLogo}
        buyerAccounts={buyerAccounts}
        accessKeys={accessKeys}
      />
    );
  }

  if (userRole === 'SuperAdmin') {
    return (
      <SuperAdminPanel
        onLogout={handleLogout}
        onResetData={handleResetData}
        buyerAccounts={buyerAccounts}
        setBuyerAccounts={setBuyerAccounts}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        userRole={userRole} 
        onLogout={handleLogout} 
        companyName={companyName}
        companyLogo={companyLogo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          notifications={notifications} 
          setNotifications={updateNotifications} 
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          companyName={companyName}
          companyLogo={companyLogo}
          setCurrentTab={setCurrentTab}
          employees={employees}
          tasks={tasks}
        />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Active Role Status Banner */}
          <div className={`mb-6 p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold shadow-xs ${
            userRole === 'Admin' ? 'bg-blue-50/80 border-blue-200 text-blue-900' :
            userRole === 'Manager' ? 'bg-purple-50/80 border-purple-200 text-purple-900' :
            'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                userRole === 'Admin' ? 'bg-blue-600' :
                userRole === 'Manager' ? 'bg-purple-600' :
                'bg-emerald-600'
              }`} />
              <span>
                Active Session Role: <strong>{userRole}</strong> (Cloud Firebase Synced) — {
                  userRole === 'Admin' ? 'Full administrative access across all corporate modules (Add, Edit, Delete, Payroll).' :
                  userRole === 'Manager' ? 'HR & Operations management mode (Attendance, Tasks, Leave approvals).' :
                  'Employee self-service & view-only portal mode.'
                }
              </span>
            </div>
            <span className="text-[11px] opacity-75 hidden sm:inline">Switch role anytime from the sidebar</span>
          </div>

          {currentTab === 'dashboard' && (
            <DashboardTab 
              employees={employees}
              attendance={attendance}
              tasks={tasks}
              leaveRequests={leaveRequests}
              departments={departments}
              setCurrentTab={setCurrentTab}
              companyName={companyName}
              companyLogo={companyLogo}
              selectedCountry={selectedCountry}
              currencySymbol={currencySymbol}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeesTab 
              employees={employees}
              setEmployees={updateEmployees}
              departments={departments}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              userRole={userRole}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceTab 
              attendance={attendance}
              setAttendance={updateAttendance}
              employees={employees}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksTab 
              tasks={tasks}
              setTasks={updateTasks}
              employees={employees}
            />
          )}

          {currentTab === 'leaves' && (
            <LeavesTab 
              leaveRequests={leaveRequests}
              setLeaveRequests={updateLeaveRequests}
              employees={employees}
            />
          )}

          {currentTab === 'departments' && (
            <DepartmentsTab 
              departments={departments}
              employees={employees}
            />
          )}

          {currentTab === 'payroll' && (
            <PayrollTab 
              payroll={payroll}
              setPayroll={updatePayroll}
              employees={employees}
              currencySymbol={currencySymbol}
              companyName={companyName}
              companyLogo={companyLogo}
            />
          )}

          {currentTab === 'announcements' && (
            <AnnouncementsTab 
              announcements={announcements}
              setAnnouncements={updateAnnouncements}
            />
          )}

          {currentTab === 'assets' && (
            <AssetsTab 
              assets={assets}
              setAssets={updateAssets}
              employees={employees}
            />
          )}

          {currentTab === 'appraisals' && (
            <AppraisalsTab 
              appraisals={appraisals}
              setAppraisals={updateAppraisals}
              employees={employees}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsTab 
              employees={employees}
              attendance={attendance}
              tasks={tasks}
              leaveRequests={leaveRequests}
              payroll={payroll}
              departments={departments}
              assets={assets}
              appraisals={appraisals}
              currencySymbol={currencySymbol}
              companyName={companyName}
              companyLogo={companyLogo}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistantTab 
              employees={employees}
              departments={departments}
              tasks={tasks}
              attendance={attendance}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab 
              userRole={userRole}
              setUserRole={setUserRole}
              onResetData={handleResetData}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              currencySymbol={currencySymbol}
              setCurrencySymbol={setCurrencySymbol}
              companyName={companyName}
              setCompanyName={setCompanyName}
              companyLogo={companyLogo}
              setCompanyLogo={setCompanyLogo}
            />
          )}
        </main>
      </div>

      {/* Quick Action Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Quick Actions</h3>
              <button onClick={() => setIsQuickAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { setIsQuickAddOpen(false); setCurrentTab('employees'); }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all border border-slate-100 group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span>Add New Employee</span>
              </button>

              <button
                onClick={() => { setIsQuickAddOpen(false); setCurrentTab('tasks'); }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-600 font-semibold text-xs transition-all border border-slate-100 group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span>Assign New Task</span>
              </button>

              <button
                onClick={() => { setIsQuickAddOpen(false); setCurrentTab('announcements'); }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-semibold text-xs transition-all border border-slate-100 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span>Post Announcement</span>
              </button>

              <button
                onClick={() => { setIsQuickAddOpen(false); setCurrentTab('payroll'); }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs transition-all border border-slate-100 group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-4 h-4" />
                </div>
                <span>Run Monthly Payroll</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
