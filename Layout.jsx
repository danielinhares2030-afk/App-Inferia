import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, UploadCloud, LogOut, Menu, X } from 'lucide-react';

export const Layout = ({ onLogout, children, currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'obras', label: 'Obras', icon: BookOpen }, // Tirei o nome Acervo!
    { id: 'capitulos', label: 'Capítulos', icon: UploadCloud },
  ];

  return (
    <div className="flex min-h-screen bg-[#050508] font-sans text-gray-200 overflow-x-hidden relative selection:bg-[#CC0000] selection:text-white">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/90 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <aside className={`w-[80vw] max-w-[280px] lg:w-72 bg-[#0a0a0f] border-r border-[#CC0000]/20 p-6 lg:p-8 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-[10px_0_30px_rgba(204,0,0,0.05)] ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden absolute top-5 right-5 text-gray-500 hover:text-[#CC0000] transition-colors"><X size={28} /></button>

        <div className="mb-12 lg:mb-16 text-center mt-6 lg:mt-0">
          <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-[0.2em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>Admin</h1>
          <h1 className="text-3xl lg:text-4xl font-black text-[#CC0000] uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]" style={{ fontFamily: "'Orbitron', sans-serif" }}>Inferia</h1>
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#CC0000] to-transparent mx-auto mt-5"></div>
        </div>
        
        <nav className="flex-1 space-y-3 lg:space-y-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold tracking-wider uppercase text-xs lg:text-sm ${currentView === item.id || (item.id === 'obras' && currentView === 'nova-obra') ? 'bg-[#CC0000] text-white shadow-[0_0_20px_rgba(204,0,0,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        
        <button onClick={onLogout} className="flex items-center gap-4 text-gray-600 hover:text-[#CC0000] p-4 rounded-xl transition-all mt-auto font-bold uppercase tracking-widest text-xs lg:text-sm group">
          <LogOut size={20} className="group-hover:-translate-x-2 transition-transform" /> Sair
        </button>
      </aside>
      
      <main className="flex-1 p-4 sm:p-8 lg:p-12 relative w-full max-w-full min-w-0">
        <div className="lg:hidden flex justify-between items-center mb-6 sm:mb-8 bg-[#0a0a0f] p-4 rounded-2xl border border-[#CC0000]/20 shadow-lg relative z-20">
          <div className="text-xl font-black text-white tracking-[0.2em] uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>ADMIN <span className="text-[#CC0000] drop-shadow-[0_0_8px_rgba(204,0,0,0.8)]">INFERIA</span></div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-[#CC0000] p-2"><Menu size={28} /></button>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#CC0000] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
};
