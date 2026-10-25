import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { Employee, Department, Task, Attendance } from '../types';

interface AiAssistantTabProps {
  employees: Employee[];
  departments: Department[];
  tasks: Task[];
  attendance: Attendance[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({
  employees,
  departments,
  tasks,
  attendance
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello Sarah! I am your WorkPulse AI HR Advisor. How can I assist you today? You can ask me to draft policies, analyze employee performance, suggest team building activities, or summarize attendance trends.'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    'Analyze current team productivity and recommend optimization strategies',
    'Draft a professional remote work policy for Q4',
    'Suggest ideas for employee wellness and retention',
    'Summarize attendance bottlenecks and lateness trends'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setLoading(true);

    try {
      const context = {
        totalEmployees: employees.length,
        departments: departments.map(d => d.name),
        activeTasksCount: tasks.length,
        completedTasksCount: tasks.filter(t => t.status === 'Completed').length
      };

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context })
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `I encountered an issue connecting to Gemini AI: ${err.message || 'Please verify your API key in secrets.'}` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">WorkPulse AI HR Advisor</h2>
          <p className="text-sm text-slate-500">Powered by Gemini 2.5 Flash Lite for intelligent office management insights.</p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestedPrompts.map((sPrompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sPrompt)}
            className="text-left bg-white p-4 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-xs font-semibold text-slate-700 flex items-center justify-between group"
          >
            <span>{sPrompt}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[550px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3.5 items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>AI Advisor is analyzing workspace records...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask AI Advisor about office policies, employee productivity, HR insights..."
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-xs"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
