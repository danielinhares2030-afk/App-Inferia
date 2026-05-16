import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Search, Trash2 } from 'lucide-react';
import { API_URL } from './constants';

export const GerenciarObras = ({ setToast, setView }) => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchObras = async () => {
    try {
      const res = await axios.get(`${API_URL}/obras`);
      setObras(res.data);
    } catch (error) {
      setToast({ message: "Erro ao buscar obras da API.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchObras(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await axios.delete(`${API_URL}/obras/${id}`);
      setToast({ message: "Obra excluída", type: "success" });
      fetchObras();
    } catch (error) {
      setToast({ message: "Erro ao excluir", type: "error" });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white uppercase tracking-wider break-words" style={{ fontFamily: "'Orbitron', sans-serif" }}>Acervo</h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm">Lista do banco de dados.</p>
        </div>
        <button onClick={() => setView('nova-obra')} className="bg-[#CC0000] hover:bg-red-700 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all text-sm sm:text-base uppercase tracking-wider w-full sm:w-auto">
          <PlusCircle size={20} /> Nova Obra
        </button>
      </div>
      <div className="bg-[#0a0a0f] border border-gray-800/60 rounded-2xl overflow-hidden shadow-xl w-full">
        <div className="p-3 sm:p-5 border-b border-gray-800/60 bg-[#111116] flex items-center">
          <Search size={20} className="text-gray-500 mr-3 flex-shrink-0" />
          <input type="text" placeholder="Pesquisar..." className="bg-transparent border-none outline-none text-white w-full text-sm sm:text-base" />
        </div>
        <div className="overflow-x-auto max-w-[100vw]">
          <table className="w-full text-left text-sm sm:text-base text-gray-300 min-w-[600px]">
            <thead className="bg-[#050508] text-gray-500 uppercase tracking-wider border-b border-gray-800/60 text-[10px] sm:text-xs font-bold">
              <tr>
                <th className="p-3 sm:p-5">Capa</th>
                <th className="p-3 sm:p-5">Título</th>
                <th className="p-3 sm:p-5">Tipo</th>
                <th className="p-3 sm:p-5">Status</th>
                <th className="p-3 sm:p-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-600 text-sm">Carregando...</td></tr>
              ) : obras.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-600 text-sm">Nenhuma obra.</td></tr>
              ) : (
                obras.map(obra => (
                  <tr key={obra.id || obra._id} className="border-b border-gray-800/30 hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-5"><div className="w-10 h-14 bg-gray-900 rounded overflow-hidden border border-gray-700 flex-shrink-0"><img src={obra.capaUrl} alt="Capa" className="w-full h-full object-cover" /></div></td>
                    <td className="p-3 sm:p-5 font-bold text-white max-w-[150px] truncate">{obra.nome}</td>
                    <td className="p-3 sm:p-5"><span className="bg-gray-800/80 px-2 py-1 rounded text-[10px] sm:text-xs text-gray-300 border border-gray-700">{obra.tipo}</span></td>
                    <td className="p-3 sm:p-5"><span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-bold border ${obra.status === 'Lançamento' ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-orange-900/20 text-orange-400 border-orange-900/50'}`}>{obra.status}</span></td>
                    <td className="p-3 sm:p-5 text-right"><button onClick={() => handleDelete(obra.id || obra._id)} className="text-gray-500 hover:text-[#CC0000] p-2"><Trash2 size={18} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
