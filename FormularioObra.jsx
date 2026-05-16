import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase.js';
import { CLOUD_NAME, UPLOAD_PRESET } from './constants.js';
import { Image as ImageIcon, Flame, CheckSquare } from 'lucide-react';

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
    if (selected) { setFile(selected); setPreview(URL.createObjectURL(selected)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setToast({ message: "É obrigatório enviar uma capa!", type: "error" });
    setLoading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const resImg = await fetch(cloudinaryUrl, { method: 'POST', body: uploadData });
      const imgData = await resImg.json();
      
      const payload = { ...formData, capaUrl: imgData.secure_url, generos: formData.generos.split(',').map(g => g.trim()) };
      await addDoc(collection(db, "obras"), payload);
      
      setToast({ message: "Obra Invoca com Sucesso!", type: "success" });
      setView('obras');
    } catch (error) {
      setToast({ message: "Falha na invocação.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in w-full max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <button onClick={() => setView('obras')} className="text-gray-500 hover:text-[#CC0000] transition-colors font-bold uppercase tracking-widest text-xs self-start mt-2">← Retornar</button>
        <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-[0.1em] drop-shadow-[0_0_15px_rgba(204,0,0,0.3)] flex items-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}><Flame className="text-[#CC0000]" size={36}/> Forjar Obra</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Painel Principal */}
        <div className="lg:col-span-2 space-y-6 bg-[#0a0a0f] border border-[#CC0000]/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(204,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a0a0f] via-[#CC0000] to-[#0a0a0f]"></div>
          
          <div><label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Título da Obra</label><input required className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-white focus:border-[#CC0000] focus:shadow-[0_0_15px_rgba(204,0,0,0.2)] outline-none font-bold transition-all" onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Solo Leveling" /></div>
          
          <div><label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Sinopse</label><textarea required className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-gray-300 focus:border-[#CC0000] focus:shadow-[0_0_15px_rgba(204,0,0,0.2)] outline-none min-h-[160px] resize-none transition-all font-medium leading-relaxed" onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="A lenda começa aqui..."></textarea></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Tipo</label><select className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#CC0000] transition-all font-bold" onChange={e => setFormData({...formData, tipo: e.target.value})}><option>Mangá</option><option>Manhwa</option><option>Manhua</option><option>Comic</option><option>Novel</option></select></div>
            <div><label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Status</label><select className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#CC0000] transition-all font-bold" onChange={e => setFormData({...formData, status: e.target.value})}><option>Lançamento</option><option>Concluído</option><option>Hiato</option></select></div>
          </div>
          
          <div><label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Gêneros (Separados por vírgula)</label><input required className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-[#CC0000] focus:border-[#CC0000] outline-none font-black tracking-wider transition-all placeholder:text-gray-700" placeholder="AÇÃO, FANTASIA, GORE" onChange={e => setFormData({...formData, generos: e.target.value})} /></div>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-[#CC0000]/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(204,0,0,0.05)]">
            <label className="block text-[#CC0000] text-xs font-black mb-4 uppercase tracking-widest text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>Arte da Capa</label>
            <div className="border-2 border-dashed border-gray-800 rounded-2xl bg-[#050508] flex flex-col items-center justify-center p-2 h-72 relative overflow-hidden group hover:border-[#CC0000] transition-all cursor-pointer">
              <input type="file" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
              {preview ? <img src={preview} alt="Capa" className="w-full h-full object-cover rounded-xl" /> : <div className="text-center text-gray-600 group-hover:text-[#CC0000] transition-colors"><ImageIcon className="w-12 h-12 mx-auto mb-3 drop-shadow-[0_0_8px_rgba(204,0,0,0.5)]" /><span className="text-xs font-bold uppercase tracking-widest">Invoque a Imagem</span></div>}
            </div>
          </div>

          <div className="bg-[#0a0a0f] border border-[#CC0000]/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(204,0,0,0.05)] space-y-4">
            <label className="block text-[#CC0000] text-xs font-black mb-4 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Controle de Exibição</label>
            {[ { id: 'isCarousel', label: 'Banner Gigante' }, { id: 'isDestaque', label: 'Em Destaque' }, { id: 'isRecente', label: 'Mais Recentes' }, { id: 'isAtualizado', label: 'Atualizações' } ].map(tag => (
              <label key={tag.id} className="flex items-center gap-4 cursor-pointer group bg-[#050508] p-3 rounded-xl border border-gray-800 hover:border-[#CC0000]/50 transition-all">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData[tag.id] ? 'bg-[#CC0000] border-[#CC0000] shadow-[0_0_10px_rgba(204,0,0,0.5)]' : 'bg-transparent border-gray-600'}`}>{formData[tag.id] && <CheckSquare size={14} className="text-white" />}</div>
                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">{tag.label}</span>
                <input type="checkbox" className="hidden" checked={formData[tag.id]} onChange={e => setFormData({...formData, [tag.id]: e.target.checked})} />
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(204,0,0,0.5)] disabled:opacity-50 flex justify-center items-center text-sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "FORJAR OBRA NO BANCO"}
          </button>
        </div>
      </form>
    </div>
  );
};
