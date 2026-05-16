import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from './firebase.js';
import { CLOUD_NAME, UPLOAD_PRESET } from './constants.js';
import { UploadCloud, FileArchive } from 'lucide-react';

export const UploadCapitulo = ({ setToast }) => {
  const [obras, setObras] = useState([]);
  const [obraSelecionada, setObraSelecionada] = useState('');
  const [proximoNumero, setProximoNumero] = useState(1);
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // 1. Puxa a lista de obras
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const snap = await getDocs(collection(db, "obras"));
        setObras(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setToast({ message: "Erro ao carregar obras.", type: "error" });
      }
    };
    fetchObras();
  }, [setToast]);

  // 2. Quando seleciona a obra, descobre automaticamente o último capítulo!
  useEffect(() => {
    const fetchUltimoCapitulo = async () => {
      if (!obraSelecionada) return setProximoNumero(1);
      try {
        const q = query(collection(db, "capitulos"), where("obraId", "==", obraSelecionada));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          // Pega todos os números, transforma em int e acha o maior
          const numeros = snap.docs.map(d => parseFloat(d.data().numero) || 0);
          const maior = Math.max(...numeros);
          setProximoNumero(maior + 1); // Sugere o próximo!
        } else {
          setProximoNumero(1);
        }
      } catch (error) {
        setProximoNumero(1);
      }
    };
    fetchUltimoCapitulo();
  }, [obraSelecionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!obraSelecionada) return setToast({ message: "Selecione uma obra!", type: "error" });
    if (arquivos.length === 0) return setToast({ message: "Selecione os arquivos ZIP!", type: "error" });
    
    setLoading(true);
    let numeroAtual = parseFloat(proximoNumero);

    try {
      // Loop pelos ZIPs selecionados (Batch Upload de arquivos RAW)
      for (let i = 0; i < arquivos.length; i++) {
        const file = arquivos[i];
        setStatusMsg(`Cap. ${numeroAtual}: Enviando ZIP pro Cloudinary...`);
        
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", UPLOAD_PRESET);

        // Volta a usar a rota RAW para ZIPs/CBZs
        const rawUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;
        
        const res = await fetch(rawUploadUrl, { method: 'POST', body: uploadData });
        const cloudinaryData = await res.json();
        
        if (cloudinaryData.error) {
          throw new Error(cloudinaryData.error.message);
        }

        setStatusMsg(`Cap. ${numeroAtual}: Salvando no banco de dados...`);
        
        // Salva o link do ZIP inteiro no banco de dados
        await addDoc(collection(db, "capitulos"), {
          obraId: obraSelecionada,
          numero: numeroAtual,
          arquivoUrl: cloudinaryData.secure_url, // Link do ZIP no Cloudinary
          dataUpload: new Date().toISOString()
        });

        numeroAtual++; // Próximo arquivo recebe o número seguinte
      }
      
      setToast({ message: `${arquivos.length} Capítulo(s) upado(s) com sucesso!`, type: "success" });
      setArquivos([]);
      setProximoNumero(numeroAtual);
      document.getElementById('file-upload').value = ''; 
      
    } catch (error) {
      setToast({ message: `Erro: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="animate-in fade-in w-full max-w-4xl space-y-8">
      <h2 className="text-3xl lg:text-4xl font-black text-white tracking-[0.1em] uppercase drop-shadow-[0_0_15px_rgba(204,0,0,0.3)]" style={{ fontFamily: "'Orbitron', sans-serif" }}>Upload em Lote</h2>
      
      <form onSubmit={handleSubmit} className="bg-[#0a0a0f] border border-[#CC0000]/30 p-6 sm:p-8 rounded-2xl space-y-8 shadow-[0_0_30px_rgba(204,0,0,0.05)] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Obra Destino</label>
            <select required className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#CC0000] focus:shadow-[0_0_15px_rgba(204,0,0,0.2)] transition-all font-bold" value={obraSelecionada} onChange={e => setObraSelecionada(e.target.value)}>
              <option value="">-- Selecione o Mangá --</option>
              {obras.map(obra => <option key={obra.id} value={obra.id}>{obra.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Capítulo Inicial</label>
            <input type="number" step="0.1" required className="w-full bg-[#050508] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#CC0000] focus:shadow-[0_0_15px_rgba(204,0,0,0.2)] transition-all font-black text-xl" value={proximoNumero} onChange={e => setProximoNumero(e.target.value)} />
            <span className="text-xs text-gray-500 mt-2 block font-bold">Autopreenchido! Se upar múltiplos ZIPs, eles seguirão esta sequência (Ex: 5, 6, 7...)</span>
          </div>
        </div>

        <div>
          <label className="block text-[#CC0000] text-xs font-black mb-3 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Arquivos dos Capítulos (.ZIP / .CBZ)</label>
          <div className="border-2 border-dashed border-gray-800 rounded-2xl bg-[#050508] flex flex-col items-center justify-center p-8 sm:p-10 relative overflow-hidden group hover:border-[#CC0000] transition-all cursor-pointer min-h-[200px]">
            {/* INPUT MULTIPLE PARA SELECIONAR VÁRIOS ZIPS AO MESMO TEMPO */}
            <input id="file-upload" type="file" required multiple accept=".zip,.cbz" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setArquivos(Array.from(e.target.files))} />
            
            <UploadCloud className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 group-hover:text-[#CC0000] transition-colors mb-4 drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]" />
            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest text-center px-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Arraste os arquivos ou Toque aqui</span>
            
            {arquivos.length > 0 && (
              <div className="mt-6 w-full max-w-md bg-[#0a0a0f] p-4 rounded-xl border border-gray-800 max-h-32 overflow-y-auto">
                <p className="text-xs text-[#CC0000] font-bold mb-2 uppercase tracking-wider">{arquivos.length} Arquivo(s) Selecionado(s):</p>
                {arquivos.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300 font-bold mb-1 truncate"><FileArchive size={14} className="text-[#CC0000] flex-shrink-0"/> {file.name}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(204,0,0,0.4)] disabled:opacity-50 flex flex-col items-center justify-center gap-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          {loading ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
              <span className="text-xs tracking-widest">{statusMsg}</span>
            </>
          ) : "INICIAR UPLOAD"}
        </button>
      </form>
    </div>
  );
};
