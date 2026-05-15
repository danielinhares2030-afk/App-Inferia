import React from 'react';
import { LayoutDashboard, Book, Upload, LogOut } from 'lucide-react';

export const Layout = ({ onLogout, children, currentView, setView }) => {
  return (
    <div className="flex min-h-screen bg-[#050508] font-sans text-gray-200">
      <aside className="w-64 bg-[#0a0a0f] border-r border-gray-800/50 p-6 flex flex-col relative z-20 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Admin</h1>
          <h1 className="text-2xl font-black text-[#CC0000] uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Inferia</h1>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#CC0000] to-transparent mx-auto mt-4"></div>
        </div>

        <nav className="flex-1 space-y-3">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${currentView === 'dashboard' ? 'bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setView('obras')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${currentView === 'obras' || currentView === 'nova-obra' ? 'bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <Book size={20} /> Acervo API
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-gray-500 hover:text-white hover:bg-white/5 opacity-50 cursor-not-allowed" title="Em breve">
            <Upload size={20} /> Capítulos
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 text-gray-600 hover:text-[#CC0000] p-3 rounded-xl transition-all mt-auto font-bold group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Encerrar Sessão
        </button>
      </aside>
      
      <main className="flex-1 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CC0000] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
};
