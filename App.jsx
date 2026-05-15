import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Toast } from './Toast';
import { Layout } from './Layout';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { GerenciarObras } from './GerenciarObras';
import { FormularioObra } from './FormularioObra';

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
      </Layout>
    </>
  );
}
