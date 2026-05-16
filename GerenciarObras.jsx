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
    if (!window.confirm("Tem certeza que deseja excluir esta obra definitivamente?")) return;
    try {
      await axios.delete(`${API_URL}/obras/${id}`);
      setToast({ message: "Obra excluída com sucesso", type: "success" });
      fetchObras();
    } catch (error) {
      setToast({ message: "Erro ao excluir obra", type: "error" });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>Acervo API</h2>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">Gerenciamento real do banco de dados.</p>
        </div>
        <button onClick={() => setView('nova-obra')} className="bg-[#CC0000] hover:bg-red-700 text-white px-5 py-3 sm:px-7 sm:py-4 rounded-xl flex items-center justify-center gap-3 font-bold shadow-[0_8px_20px_rgba(204,0,0,0.3)] transition-all text-base sm:text-lg uppercase tracking-wider w-full sm:w-auto">
          <PlusCircle size={22} /> Cadastrar Nova
        </button>
      </div>
      <div className="bg-[#0a0a0f] border border-gray-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-gray-800/60 bg-[#111116] flex items-center">
          <Search size={22} className="text-gray-500 mr-4" />
          <input type="text" placeholder="Pesquisar obra pelo nome..." className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 text-base" />
        </div>
        
        {/* Div que resolve o problema da tabela cortar no celular */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base text-gray-300 min-w-[700px]">
            <thead className="bg-[#050508] text-gray-500 uppercase tracking-wider border-b border-gray-800/60 text-xs font-bold">
              <tr>
                <th className="p-4 sm:p-5">Capa</th>
                <th className="p-4 sm:p-5">Título</th>
                <th className="p-4 sm:p-5">Tipo</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-600 text-lg">Carregando da API real...</td></tr>
              ) : obras.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-600 text-lg">Nenhuma obra cadastrada no banco.</td></tr>
              ) : (
                obras.map(obra => (
                  <tr key={obra.id || obra._id} className="border-b border-gray-800/30 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5"><div className="w-12 h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0"><img src={obra.capaUrl} alt="Capa" className="w-full h-full object-cover" /></div></td>
                    <td className="p-4 sm:p-5 font-bold text-white text-base sm:text-lg">{obra.nome}</td>
                    <td className="p-4 sm:p-5"><span className="bg-gray-800/80 px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-gray-700 whitespace-nowrap">{obra.tipo}</span></td>
                    <td className="p-4 sm:p-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${obra.status === 'Lançamento' ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-orange-900/20 text-orange-400 border-orange-900/50'}`}>{obra.status}</span></td>
                    <td className="p-4 sm:p-5 text-right"><button onClick={() => handleDelete(obra.id || obra._id)} className="text-gray-500 hover:text-[#CC0000] p-3 transition-colors"><Trash2 size={20} /></button></td>
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
