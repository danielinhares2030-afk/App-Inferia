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

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingUser) {
    return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-[#CC0000] font-bold">Verificando sessão...</div>;
  }

  if (!user) {
    return (
      <>
        <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
        <Login setToast={showToast} />
      </>
    );
  }

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <Layout onLogout={handleLogout} currentView={view} setView={setView}>
        {view === 'dashboard' && <Dashboard setToast={showToast} />}
        {view === 'obras' && <GerenciarObras setToast={showToast} setView={setView} />}
        {view === 'nova-obra' && <FormularioObra setToast={showToast} setView={setView} />}
        {view === 'capitulos' && <UploadCapitulo setToast={showToast} setView={setView} />}
      </Layout>
    </>
  );
}
