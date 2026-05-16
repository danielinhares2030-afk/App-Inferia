import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import { Toast } from './Toast.jsx';
import { Layout } from './Layout.jsx';
import { Login } from './Login.jsx';
import { Dashboard } from './Dashboard.jsx';
import { GerenciarObras } from './GerenciarObras.jsx';
import { FormularioObra } from './FormularioObra.jsx';
import { UploadCapitulo } from './UploadCapitulo.jsx';

// O "export default" aqui é o que resolve o erro da Vercel!
export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [view, setView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (config) => {
    setToast(config);
    setTimeout(() => setToast(null), 4000);
  };

  if (loadingUser) {
    return (
      <div 
        className="min-h-screen bg-[#050508] flex items-center justify-center text-[#CC0000] font-black text-lg sm:text-xl animate-pulse tracking-widest uppercase text-center p-4" 
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        Verificando Portal...
      </div>
    );
  }

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      {!user ? (
        <Login setToast={showToast} />
      ) : (
        <Layout onLogout={() => signOut(auth)} currentView={view} setView={setView}>
          {view === 'dashboard' && <Dashboard setToast={showToast} />}
          {view === 'obras' && <GerenciarObras setToast={showToast} setView={setView} />}
          {view === 'nova-obra' && <FormularioObra setToast={showToast} setView={setView} />}
          {view === 'capitulos' && <UploadCapitulo setToast={showToast} />}
        </Layout>
      )}
    </>
  );
}
