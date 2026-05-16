import React, { useState } from 'react';
import { LayoutDashboard, Book, Upload, Settings, LogOut, Menu, X } from 'lucide-react';

export const Layout = ({ onLogout, children, currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'obras', label: 'Acervo API', icon: Book },
    { id: 'capitulos', label: 'Capítulos', icon: Upload },
    { id: 'config', label: 'Configurações', icon: Settings, disabled: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#050508] font-sans text-gray-200 overflow-x-hidden relative">
      
      {/* Fundo escuro quando o menu mobile está aberto */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar Responsiva */}
      <aside className={`w-72 bg-[#0a0a0f] border-r border-gray-800/50 p-8 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)] ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden absolute top-6 right-6 text-gray-500 hover:text-[#CC0000] transition-colors">
          <X size={28} />
        </button>

        <div className="mb-16 text-center mt-4 lg:mt-0">
          <h1 className="text-3xl font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Admin</h1>
          <h1 className="text-3xl font-black text-[#CC0000] uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Inferia</h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#CC0000] to-transparent mx-auto mt-5"></div>
        </div>
        <nav className="flex-1 space-y-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { if(!item.disabled) { setView(item.id); setIsMobileMenuOpen(false); } }} disabled={item.disabled} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold text-base ${currentView === item.id || (item.id === 'obras' && currentView === 'nova-obra') ? 'bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/20 shadow-[0_0_15px_rgba(204,0,0,0.1)]' : item.disabled ? 'text-gray-700 cursor-not-allowed opacity-50' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={22} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="flex items-center gap-4 text-gray-600 hover:text-[#CC0000] p-4 rounded-xl transition-all mt-auto font-bold group text-base">
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" /> Encerrar Sessão
        </button>
      </aside>
      
      {/* Área Principal */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 relative w-full max-w-full min-w-0">
        
        {/* Header Mobile */}
        <div className="lg:hidden flex justify-between items-center mb-8 bg-[#0a0a0f] p-4 sm:p-5 rounded-2xl border border-gray-800/60 shadow-lg relative z-20">
          <div className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            ADMIN <span className="text-[#CC0000]">INFERIA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white p-2">
            <Menu size={30} />
          </button>
        </div>

        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[#CC0000] rounded-full blur-[100px] sm:blur-[180px] opacity-[0.03] pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
};
