import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Upload } from 'lucide-react';
import { API_URL } from './constants';

export const Dashboard = ({ setToast }) => {
  const [stats, setStats] = useState({ obras: 0, capitulos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/estatisticas`);
        setStats(res.data);
      } catch (error) {
        setToast({ message: "Erro ao conectar com a API do site principal.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [setToast]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>Visão Geral</h2>
      
      {loading ? (
        <div className="text-gray-500 flex items-center gap-2"><div className="w-5 h-5 border-2 border-[#CC0000] border-t-transparent rounded-full animate-spin"></div> Conectando à API...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0f] border border-gray-800/60 p-6 rounded-2xl flex items-center space-x-6 relative overflow-hidden group hover:border-[#CC0000]/50 transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-red-900/10 rounded-bl-full pointer-events-none group-hover:bg-[#CC0000]/10 transition-all"></div>
            <div className="p-4 bg-[#1a0a0a] border border-[#CC0000]/30 rounded-xl text-[#CC0000] shadow-[0_0_15px_rgba(204,0,0,0.2)]">
              <Book size={32} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total de Obras</p>
              <p className="text-4xl font-black text-white">{stats.obras || 0}</p>
            </div>
          </div>

          <div className="bg-[#0a0a0f] border border-gray-800/60 p-6 rounded-2xl flex items-center space-x-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-900/10 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-all"></div>
            <div className="p-4 bg-[#0a051a] border border-purple-500/30 rounded-xl text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Capítulos Lançados</p>
              <p className="text-4xl font-black text-white">{stats.capitulos || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
