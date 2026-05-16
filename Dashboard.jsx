import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase.js';
import { Book, Upload } from 'lucide-react';

export const Dashboard = ({ setToast }) => {
  const [stats, setStats] = useState({ obras: 0, capitulos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const obrasSnap = await getDocs(collection(db, "obras"));
        const capitulosSnap = await getDocs(collection(db, "capitulos"));
        setStats({ obras: obrasSnap.size, capitulos: capitulosSnap.size });
      } catch (error) {
        setToast({ message: "Erro ao ler dados do banco de dados.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [setToast]);

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in w-full">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-8 uppercase tracking-wider break-words" style={{ fontFamily: "'Orbitron', sans-serif" }}>Visão Geral</h2>
      {loading ? (
        <div className="text-gray-500 text-sm sm:text-base flex items-center gap-3"><div className="w-5 h-5 border-2 border-[#CC0000] border-t-transparent rounded-full animate-spin"></div> Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#0a0a0f] border border-gray-800/60 p-5 sm:p-8 rounded-2xl flex items-center space-x-4 sm:space-x-6 shadow-lg">
            <div className="p-3 sm:p-5 bg-[#1a0a0a] border border-[#CC0000]/30 rounded-xl sm:rounded-2xl text-[#CC0000]">
              <Book size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 truncate">Total de Obras</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white truncate">{stats.obras}</p>
            </div>
          </div>
          <div className="bg-[#0a0a0f] border border-gray-800/60 p-5 sm:p-8 rounded-2xl flex items-center space-x-4 sm:space-x-6 shadow-lg">
            <div className="p-3 sm:p-5 bg-[#0a051a] border border-purple-500/30 rounded-xl sm:rounded-2xl text-purple-500">
              <Upload size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 truncate">Capítulos</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white truncate">{stats.capitulos}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
