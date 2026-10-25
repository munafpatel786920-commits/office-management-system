import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Calendar,
  X,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Task, Employee, TaskPriority, TaskStatus } from '../types';

interface TasksTabProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  employees: Employee[];
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  setTasks,
  employees
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as TaskPriority,
    status: 'Todo' as TaskStatus,
    assignedTo: employees[0]?.id || '',
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [newTask, ...prev]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Todo',
      assignedTo: employees[0]?.id || '',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const columns: { id: TaskStatus; title: string; color: string; bg: string }[] = [
    { id: 'Todo', title: 'To Do', color: 'text-amber-600 border-amber-200', bg: 'bg-amber-50/50' },
    { id: 'InProgress', title: 'In Progress', color: 'text-blue-600 border-blue-200', bg: 'bg-blue-50/50' },
    { id: 'Completed', title: 'Completed', color: 'text-emerald-600 border-emerald-200', bg: 'bg-emerald-50/50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Task Management</h2>
          <p className="text-sm text-slate-500">Create, assign, and monitor projects and daily assignments.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="bg-slate-50/80 rounded-2xl border border-slate-200/60 p-4 flex flex-col h-[70vh]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">{col.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.color}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map(task => {
                    const assignee = employees.find(e => e.id === task.assignedTo);
                    return (
                      <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                            task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            {assignee ? (
                              <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full object-cover border" title={assignee.name} />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">?</div>
                            )}
                            <span className="text-xs text-slate-600 font-medium">{assignee?.name.split(' ')[0]}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {task.deadline}
                          </span>
                        </div>

                        {/* Status Quick Switch */}
                        <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-400">Move to:</span>
                          <div className="flex gap-1">
                            {col.id !== 'Todo' && (
                              <button onClick={() => updateTaskStatus(task.id, 'Todo')} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold">Todo</button>
                            )}
                            {col.id !== 'InProgress' && (
                              <button onClick={() => updateTaskStatus(task.id, 'InProgress')} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">In Progress</button>
                            )}
                            {col.id !== 'Completed' && (
                              <button onClick={() => updateTaskStatus(task.id, 'Completed')} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">Complete</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg">Create New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Implement OAuth login flow"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed instructions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assign To</label>
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Todo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
