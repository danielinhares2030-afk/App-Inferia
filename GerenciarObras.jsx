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

  useEffect(() => {
    fetchObras();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta obra?")) return;
    try {
      await axios.delete(`${API_URL}/obras/${id}`);
      setToast({ message: "Obra excluída com sucesso", type: "success" });
      fetchObras();
    } catch (error) {
      setToast({ message: "Erro ao excluir obra", type: "error" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>Gerenciar Obras</h2>
          <p className="text-gray-500 mt-1">Lista de mangás e manhwas puxada do banco de dados real.</p>
        </div>
        <button onClick={() => setView('nova-obra')} className="bg-[#CC0000] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(204,0,0,0.3)] transition-all">
          <PlusCircle size={20} /> Cadastrar Nova
        </button>
      </div>

      <div className="bg-[#0a0a0f] border border-gray-800/60 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800/60 bg-[#111116] flex items-center">
          <Search size={18} className="text-gray-500 mr-3" />
          <input type="text" placeholder="Pesquisar obra pelo nome..." className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600" />
        </div>
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#050508] text-gray-500 uppercase tracking-wider border-b border-gray-800/60 text-xs">
            <tr>
              <th className="p-4 font-bold">Capa</th>
              <th className="p-4 font-bold">Título</th>
              <th className="p-4 font-bold">Tipo</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-600">Carregando da API...</td></tr>
            ) : obras.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-600">Nenhuma obra encontrada.</td></tr>
            ) : (
              obras.map(obra => (
                <tr key={obra.id || obra._id} className="border-b border-gray-800/30 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="w-10 h-14 bg-gray-900 rounded overflow-hidden border border-gray-700">
                      <img src={obra.capaUrl} alt="Capa" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white text-base">{obra.nome}</td>
                  <td className="p-4"><span className="bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-300 border border-gray-700">{obra.tipo}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${obra.status === 'Lançamento' ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-orange-900/20 text-orange-400 border-orange-900/50'}`}>
                      {obra.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(obra.id || obra._id)} className="text-gray-500 hover:text-[#CC0000] p-2 transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
