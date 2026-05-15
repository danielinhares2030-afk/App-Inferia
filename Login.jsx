import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const Login = ({ setToast }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O App.jsx escuta a mudança de estado e loga automaticamente
    } catch (error) {
      setToast({ message: "Credenciais inválidas. Acesso negado.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 font-sans text-gray-200">
      <div className="w-full max-w-md bg-[#0a0a0f] border border-[#CC0000]/30 p-8 rounded-2xl shadow-[0_0_40px_rgba(204,0,0,0.15)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#CC0000] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <h1 className="text-4xl font-black text-center text-white mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          INFERIA
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">Painel Administrativo do Sistema</p>
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" required
              className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] outline-none transition-all"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@inferia.com"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Senha</label>
            <input 
              type="password" required
              className="w-full bg-[#111116] border border-gray-800 rounded-lg p-3 text-white focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] outline-none transition-all"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#880000] to-[#CC0000] hover:from-[#CC0000] hover:to-[#ff1a1a] text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] shadow-[0_4px_15px_rgba(204,0,0,0.3)] disabled:opacity-50">
            {loading ? "AUTENTICANDO..." : "ENTRAR NO PORTAL"}
          </button>
        </form>
      </div>
    </div>
  );
};
