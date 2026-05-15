import React, { useState } from 'react';
import axios from 'axios';
import { Image as ImageIcon, CheckSquare } from 'lucide-react';
import { API_URL, CLOUDINARY_URL, UPLOAD_PRESET } from './constants';

export const FormularioObra = ({ setToast, setView }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', descricao: '', tipo: 'Mangá', status: 'Lançamento', generos: '',
    isCarousel: false, isDestaque: false, isRecente: true, isAtualizado: false
  });

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setToast({ message: "É obrigatório enviar uma capa!", type: "error" });
    
    setLoading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      const resImg = await axios.post(CLOUDINARY_URL, uploadData);
      const capaUrl = resImg.data.secure_url;

      const payload = { ...formData, capaUrl, generos: formData.generos.split(',').map(g => g.trim()) };
      await axios.post(`${API_URL}/obras`, payload);
      
      setToast({ message: "Obra cadastrada com sucesso na API!", type: "success" });
      setView('obras');
    } catch (error) {
      setToast({ message: "Erro ao enviar dados para a API.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('obras')} className="text-gray-500 hover:text-white transition-colors">← Voltar</button>
        <h2 className="text-3xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>Adicionar Obra</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a0f] border border-gray-800/60 p-6 rounded-xl space-y-6">
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Título da Obra</label>
              <input required className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white focus:border-[#CC0000] outline-none" onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Solo Leveling" />
            </div>
            
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Sinopse / Descrição</label>
              <textarea required className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white focus:border-[#CC0000] outline-none min-h-[150px]" onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="Escreva a sinopse aqui..."></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Tipo</label>
                <select className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#CC0000]" onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option>Mangá</option><option>Manhwa</option><option>Manhua</option><option>Comic</option><option>Novel</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Status</label>
                <select className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#CC0000]" onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Lançamento</option><option>Concluído</option><option>Hiato</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Gêneros</label>
              <input required className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white focus:border-[#CC0000] outline-none" placeholder="Ação, Fantasia, Isekai (Separados por vírgula)" onChange={e => setFormData({...formData, generos: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-gray-800/60 p-6 rounded-xl">
            <label className="block text-gray-400 text-xs font-bold mb-4 uppercase">Capa (Cloudinary)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl bg-[#111116] flex flex-col items-center justify-center p-4 h-64 relative overflow-hidden group hover:border-[#CC0000] transition-colors cursor-pointer">
              <input type="file" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center text-gray-500 group-hover:text-[#CC0000] transition-colors">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                  <span className="text-sm font-bold">Clique ou arraste a capa</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0a0a0f] border border-gray-800/60 p-6 rounded-xl">
            <label className="block text-gray-400 text-xs font-bold mb-4 uppercase flex items-center gap-2"><CheckSquare size={16}/> Tags de Exibição</label>
            <div className="space-y-3">
              {[
                { id: 'isCarousel', label: 'Banner Gigante (Carousel)' },
                { id: 'isDestaque', label: 'Em Destaque' },
                { id: 'isRecente', label: 'Adicionados Recentemente' },
                { id: 'isAtualizado', label: 'Últimas Atualizações' }
              ].map(tag => (
                <label key={tag.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData[tag.id] ? 'bg-[#CC0000] border-[#CC0000]' : 'bg-[#111116] border-gray-600 group-hover:border-gray-400'}`}>
                    {formData[tag.id] && <CheckSquare size={14} className="text-white" />}
                  </div>
                  <span className="text-gray-300 text-sm">{tag.label}</span>
                  <input type="checkbox" className="hidden" checked={formData[tag.id]} onChange={e => setFormData({...formData, [tag.id]: e.target.checked})} />
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(204,0,0,0.3)] disabled:opacity-50 flex justify-center">
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "PUBLICAR OBRA"}
          </button>
        </div>
      </form>
    </div>
  );
};
