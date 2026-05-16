import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';
import { API_URL, CLOUDINARY_URL, UPLOAD_PRESET } from './constants.js';

export const UploadCapitulo = ({ setToast, setView }) => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ obraId: '', numero: '', titulo: '' });

  useEffect(() => {
    axios.get(`${API_URL}/obras`)
      .then(res => setObras(res.data))
      .catch(() => setToast({ message: "Aviso: Não foi possível carregar as obras da API.", type: "error" }));
  }, [setToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.obraId) return setToast({ message: "Selecione a obra antes de enviar o capítulo.", type: "error" });
    if (files.length === 0) return setToast({ message: "Selecione as páginas!", type: "error" });

    setLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", UPLOAD_PRESET);
        const res = await axios.post(CLOUDINARY_URL, uploadData);
        return res.data.secure_url;
      });
      
      const pagesUrls = await Promise.all(uploadPromises);

      const payload = { ...formData, pages: pagesUrls };
      await axios.post(`${API_URL}/capitulos`, payload);
      
      setToast({ message: "Capítulo enviado com sucesso!", type: "success" });
      setFormData({ obraId: formData.obraId, numero: '', titulo: '' });
      setFiles([]);
    } catch (error) {
      setToast({ message: "Erro ao enviar capítulo para a API.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>Novo Capítulo</h2>
      
      <form onSubmit={handleSubmit} className="bg-[#0a0a0f] border border-gray-800/60 p-8 rounded-xl space-y-6 shadow-xl">
        <div>
          <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Vincular a qual Obra?</label>
          <select required className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-purple-500 transition-colors" value={formData.obraId} onChange={e => setFormData({...formData, obraId: e.target.value})}>
            <option value="">-- Selecione uma obra existente --</option>
            {obras.map(obra => <option key={obra._id || obra.id} value={obra._id || obra.id}>{obra.nome}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Número do Cap.</label>
            <input type="number" required className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-purple-500 transition-colors" onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Ex: 1" value={formData.numero} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Título (Opcional)</label>
            <input className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-purple-500 transition-colors" onChange={e => setFormData({...formData, titulo: e.target.value})} placeholder="Ex: O Despertar" value={formData.titulo} />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">Páginas do Capítulo (Múltiplas Imagens)</label>
          <div className="border-2 border-dashed border-gray-700 rounded-xl bg-[#111116] flex flex-col items-center justify-center p-8 relative overflow-hidden group hover:border-purple-500 transition-colors cursor-pointer">
            <input type="file" multiple required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setFiles(e.target.files)} />
            <UploadCloud className="w-12 h-12 text-gray-500 group-hover:text-purple-500 transition-colors mb-4" />
            <span className="text-sm font-bold text-gray-300">Clique ou arraste as páginas aqui</span>
            {files.length > 0 && (
              <span className="mt-2 text-xs text-purple-400 font-bold">{files.length} página(s) selecionada(s)</span>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex justify-center mt-6">
          {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "PUBLICAR CAPÍTULO"}
        </button>
      </form>
    </div>
  );
};
