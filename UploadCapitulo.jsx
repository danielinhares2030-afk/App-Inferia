import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileArchive } from 'lucide-react';
import { API_URL, CLOUDINARY_URL, UPLOAD_PRESET } from './constants.js';

export const UploadCapitulo = ({ setToast }) => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ obraId: '', numero: '', titulo: '' });

  useEffect(() => {
    axios.get(`${API_URL}/obras`)
      .then(res => setObras(res.data))
      .catch(() => setToast({ message: "Aviso: Não foi possível carregar as obras.", type: "error" }));
  }, [setToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.obraId) return setToast({ message: "Selecione a obra antes de enviar o capítulo.", type: "error" });
    if (!file) return setToast({ message: "Selecione o arquivo .ZIP ou .CBZ!", type: "error" });
    
    setLoading(true);
    try {
      // O Cloudinary exige o endpoint 'raw' para arquivos zip/cbz, em vez de 'image'
      const rawUploadUrl = CLOUDINARY_URL.replace('/image/upload', '/raw/upload');
      
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      
      const res = await axios.post(rawUploadUrl, uploadData);
      const arquivoUrl = res.data.secure_url;
      
      // Envia a URL do ZIP para a sua API
      const payload = { ...formData, arquivoUrl: arquivoUrl };
      await axios.post(`${API_URL}/capitulos`, payload);
      
      setToast({ message: "Capítulo em ZIP enviado com sucesso!", type: "success" });
      setFormData({ obraId: formData.obraId, numero: '', titulo: '' });
      setFile(null);
    } catch (error) {
      setToast({ message: "Erro ao enviar capítulo para a API.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in w-full max-w-3xl space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-8 uppercase tracking-wider break-words" style={{ fontFamily: "'Orbitron', sans-serif" }}>Novo Capítulo</h2>
      
      <form onSubmit={handleSubmit} className="bg-[#0a0a0f] border border-gray-800/60 p-5 sm:p-8 rounded-2xl space-y-6 shadow-2xl w-full">
        <div>
          <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Vincular a qual Obra?</label>
          <select required className="w-full bg-[#111116] border border-gray-800 rounded-xl p-3 sm:p-4 text-white outline-none focus:border-purple-500 transition-colors text-sm sm:text-base" value={formData.obraId} onChange={e => setFormData({...formData, obraId: e.target.value})}>
            <option value="">-- Selecione uma obra --</option>
            {obras.map(obra => <option key={obra._id || obra.id} value={obra._id || obra.id}>{obra.nome}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Número do Cap.</label>
            <input type="number" required className="w-full bg-[#111116] border border-gray-800 rounded-xl p-3 sm:p-4 text-white outline-none focus:border-purple-500 transition-colors text-sm sm:text-base" onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Ex: 1" value={formData.numero} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Título (Opcional)</label>
            <input className="w-full bg-[#111116] border border-gray-800 rounded-xl p-3 sm:p-4 text-white outline-none focus:border-purple-500 transition-colors text-sm sm:text-base" onChange={e => setFormData({...formData, titulo: e.target.value})} placeholder="Ex: O Despertar" value={formData.titulo} />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Arquivo do Capítulo (.ZIP ou .CBZ)</label>
          <div className="border-2 border-dashed border-gray-700 rounded-2xl bg-[#111116] flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden group hover:border-purple-500 transition-colors cursor-pointer min-h-[160px] sm:h-56">
            {/* O accept agora força o celular a procurar arquivos ao invés da galeria de fotos */}
            <input type="file" required accept=".zip,.cbz,application/zip,application/x-zip-compressed" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files[0])} />
            <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 group-hover:text-purple-500 transition-colors mb-3 sm:mb-4" />
            <span className="text-xs sm:text-sm font-bold text-gray-300 text-center px-2">Toque para selecionar o arquivo compactado</span>
            {file && (
              <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-purple-400 font-bold bg-purple-900/20 px-3 py-1.5 rounded-lg break-all text-center">
                <FileArchive size={16} className="flex-shrink-0" /> {file.name}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_5px_15px_rgba(168,85,247,0.3)] disabled:opacity-50 flex justify-center mt-6 text-sm sm:text-base">
          {loading ? <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "FAZER UPLOAD DO ARQUIVO"}
        </button>
      </form>
    </div>
  );
};
