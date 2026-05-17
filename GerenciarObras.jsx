import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase.js';
import { CLOUD_NAME, UPLOAD_PRESET } from './constants.js';
import { PlusCircle, Search, Trash2, Edit3, X, Image as ImageIcon, CheckSquare, Flame, Loader2 } from 'lucide-react';

export const GerenciarObras = ({ setToast, setView }) => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  
  // Estados para o Modal de Edição
  const [obraParaEditar, setObraParaEditar] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchObras = async () => {
    try {
      const snap = await getDocs(collection(db, "obras"));
      setObras(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      setToast({ message: "Erro ao buscar obras.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchObras(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta obra permanentemente?")) return;
    try {
      await deleteDoc(doc(db, "obras", id));
      setToast({ message: "💥 Obra banida do acervo com sucesso!", type: "success" });
      fetchObras();
    } catch (error) {
      setToast({ message: "Erro ao excluir.", type: "error" });
    }
  };

  // Abre o modal e preenche os campos com os dados atuais da obra
  const handleAbrirEditar = (obra) => {
    setObraParaEditar(obra);
    setEditPreview(obra.capaUrl);
    setEditFile(null);
    setEditFormData({
      nome: obra.nome || '',
      descricao: obra.descricao || '',
      tipo: obra.tipo || 'Mangá',
      status: obra.status || 'Lançamento',
      generos: Array.isArray(obra.generos) ? obra.generos.join(', ') : '',
      isCarousel: obra.isCarousel || false,
      isDestaque: obra.isDestaque || false,
      isRecente: obra.isRecente || false,
      isAtualizado: obra.isAtualizado || false
    });
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) { 
      setEditFile(selected); 
      setEditPreview(URL.createObjectURL(selected)); 
    }
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      let finalCapaUrl = obraParaEditar.capaUrl;

      // Se selecionou uma nova foto de capa, faz o upload pro Cloudinary
      if (editFile) {
        const uploadData = new FormData();
        uploadData.append("file", editFile);
        uploadData.append("upload_preset", UPLOAD_PRESET);
        
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const resImg = await fetch(cloudinaryUrl, { method: 'POST', body: uploadData });
        const imgData = await resImg.json();
        
        if (imgData.error) throw new Error(imgData.error.message);
        finalCapaUrl = imgData.secure_url;
      }

      const payload = {
        nome: editFormData.nome,
        descricao: editFormData.descricao,
        tipo: editFormData.tipo,
        status: editFormData.status,
        capaUrl: finalCapaUrl,
        generos: editFormData.generos.split(',').map(g => g.trim()).filter(g => g !== ''),
        isCarousel: editFormData.isCarousel,
        isDestaque: editFormData.isDestaque,
        isRecente: editFormData.isRecente,
        isAtualizado: editFormData.isAtualizado
      };

      await updateDoc(doc(db, "obras", obraParaEditar.id), payload);
      
      // 1. FECHA A TELA DE ALTERAÇÃO IMEDIATAMENTE
      setObraParaEditar(null);
      
      // 2. EXIBE A MENSAGEM BONITA E ESTILIZADA
      setToast({ message: "🔥 OBRA REFORJADA COM SUCESSO NO BANCO INFERIA!", type: "success" });
      
      // 3. ATUALIZA A LISTAGEM DE FUNDO
      fetchObras(); 
    } catch (error) {
      setToast({ message: `❌ Falha ao atualizar: ${error.message}`, type: "error" });
    } finally {
      // CORRIGIDO: O bloco finally agora está correto e impede a tela preta
      setEditLoading(false);
    }
  };

  const obrasFiltradas = obras.filter(obra => 
    obra.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in w-full max-w-full relative">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider break-words" style={{ fontFamily: "'Orbitron', sans-serif" }}>Acervo de Obras</h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm">Gerencie, edite ou remova conteúdos do banco de dados.</p>
        </div>
        <button onClick={() => setView('nova-obra')} className="bg-[#CC0000] hover:bg-red-700 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all text-sm sm:text-base uppercase tracking-wider w-full sm:w-auto" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          <PlusCircle size={20} /> Nova Obra
        </button>
      </div>

      <div className="bg-[#0a0a0f] border border-gray-800/60 rounded-2xl overflow-hidden shadow-xl w-full">
        <div className="p-3 sm:p-5 border-b border-gray-800/60 bg-[#111116] flex items-center">
          <Search size={20} className="text-gray-500 mr-3 flex-shrink-0" />
          <input type="text" placeholder="Buscar mangá pelo título..." value={pesquisa} onChange={e => setPesquisa(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-sm sm:text-base font-medium placeholder:text-gray-600" />
        </div>
        
        <div className="overflow-x-auto max-w-[100vw]">
          <table className="w-full text-left text-sm sm:text-base text-gray-300 min-w-[600px]">
            <thead className="bg-[#050508] text-gray-500 uppercase tracking-wider border-b border-gray-800/60 text-[10px] sm:text-xs font-black" style={{ fontFamily: "'Orbitron', sans-serif" }}>
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
                <tr><td colSpan="5" className="p-8 text-center text-gray-600 text-sm font-bold">Carregando dados do Firebase...</td></tr>
              ) : obrasFiltradas.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-600 text-sm font-bold">Nenhuma obra encontrada.</td></tr>
              ) : (
                obrasFiltradas.map(obra => (
                  <tr key={obra.id} className="border-b border-gray-800/30 hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 sm:p-5"><div className="w-10 h-14 bg-gray-950 rounded overflow-hidden border border-gray-800 flex-shrink-0"><img src={obra.capaUrl} alt="Capa" className="w-full h-full object-cover" /></div></td>
                    <td className="p-3 sm:p-5 font-bold text-white max-w-[200px] truncate">{obra.nome}</td>
                    <td className="p-3 sm:p-5"><span className="bg-[#050508] border border-gray-800 px-2 py-1 rounded text-[10px] sm:text-xs text-gray-400 font-bold uppercase">{obra.tipo}</span></td>
                    <td className="p-3 sm:p-5"><span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-black border uppercase ${obra.status === 'Lançamento' ? 'bg-green-900/10 text-green-400 border-green-900/30' : 'bg-orange-900/10 text-orange-400 border-orange-900/30'}`}>{obra.status}</span></td>
                    <td className="p-3 sm:p-5 text-right"><div className="flex justify-end gap-2">
                      <button onClick={() => handleAbrirEditar(obra)} className="text-gray-500 hover:text-blue-400 p-2 transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(obra.id)} className="text-gray-500 hover:text-[#CC0000] p-2 transition-colors"><Trash2 size={18} /></button>
                    </div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO CYBERPUNK DARK */}
      {obraParaEditar && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0f] border border-[#CC0000]/30 w-full max-w-5xl rounded-2xl shadow-[0_0_25px_rgba(204,0,0,0.15)] max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CC0000] to-transparent"></div>
            
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Orbitron', sans-serif" }}><Flame className="text-[#CC0000]" size={24}/> Alterar Registro</h3>
              <button onClick={() => setObraParaEditar(null)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Título</label>
                  <input type="text" required value={editFormData.nome} onChange={e => setEditFormData({...editFormData, nome: e.target.value})} className="w-full bg-[#050508] border border-gray-800 rounded-xl p-3.5 text-white focus:border-[#CC0000] outline-none font-bold transition-all text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Sinopse</label>
                  <textarea required value={editFormData.descricao} onChange={e => setEditFormData({...editFormData, descricao: e.target.value})} className="w-full bg-[#050508] border border-gray-800 rounded-xl p-3.5 text-gray-300 focus:border-[#CC0000] outline-none min-h-[140px] resize-none font-medium text-sm sm:text-base leading-relaxed" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Tipo</label>
                    <select value={editFormData.tipo} onChange={e => setEditFormData({...editFormData, tipo: e.target.value})} className="w-full bg-[#050508] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-[#CC0000] font-bold text-sm">
                      <option>Mangá</option><option>Manhwa</option><option>Manhua</option><option>Comic</option><option>Novel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Status</label>
                    <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="w-full bg-[#050508] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-[#CC0000] font-bold text-sm">
                      <option>Lançamento</option><option>Concluído</option><option>Hiato</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Gêneros (Separados por vírgula)</label>
                  <input type="text" required value={editFormData.generos} onChange={e => setEditFormData({...editFormData, generos: e.target.value})} className="w-full bg-[#050508] border border-gray-800 rounded-xl p-3.5 text-white focus:border-[#CC0000] outline-none font-bold text-sm tracking-wide" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>Capa da Obra</label>
                  <div className="border-2 border-dashed border-gray-800 rounded-2xl bg-[#050508] flex flex-col items-center justify-center p-2 h-60 relative overflow-hidden group hover:border-[#CC0000] transition-all cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {editPreview ? (
                      <img src={editPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center text-gray-600"><ImageIcon size={32} className="mx-auto mb-2"/><span className="text-xs font-bold">Alterar Mídia</span></div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 text-center block mt-2">Toque na imagem acima se desejar substituir a foto atual.</span>
                </div>

                <div className="bg-[#050508] p-4 rounded-xl border border-gray-800/80 space-y-3">
                  <label className="block text-[#CC0000] text-xs font-black mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Tags de Sistema</label>
                  
                  {[
                    { id: 'isCarousel', label: 'Banner Gigante' },
                    { id: 'isDestaque', label: 'Em Destaque' },
                    { id: 'isRecente', label: 'Mais Recentes' },
                    { id: 'isBBQ', label: 'Atualizações' } // Sincronizado perfeitamente com a estrutura booleana externa
                  ].map(tag => {
                    const dbId = tag.id === 'isBBQ' ? 'isAtualizado' : tag.id;
                    return (
                      <label key={tag.id} className="flex items-center gap-3 cursor-pointer group bg-[#0a0a0f] p-2.5 rounded-lg border border-gray-900 hover:border-gray-800 transition-all">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${editFormData[dbId] ? 'bg-[#CC0000] border-[#CC0000] shadow-[0_0_8px_rgba(204,0,0,0.5)]' : 'bg-transparent border-gray-700'}`}>
                          {editFormData[dbId] && <CheckSquare size={12} className="text-white" />}
                        </div>
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider select-none">{tag.label}</span>
                        <input type="checkbox" className="hidden" checked={editFormData[dbId] || false} onChange={e => setEditFormData({...editFormData, [dbId]: e.target.checked})} />
                      </label>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setObraParaEditar(null)} className="w-1/3 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-colors text-xs uppercase tracking-wider">Cancelar</button>
                  <button type="submit" disabled={editLoading} className="w-2/3 bg-[#CC0000] hover:bg-red-700 text-white font-black py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,0,0,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 text-xs uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {editLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirmar Forja"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
