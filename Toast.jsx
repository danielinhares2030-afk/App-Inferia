import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-5 ${
      type === 'error' ? 'bg-[#1a0505] border-[#CC0000] text-red-400' : 
      type === 'success' ? 'bg-[#051a0a] border-green-800 text-green-400' : 
      'bg-[#111116] border-gray-700 text-blue-400'
    }`}>
      <AlertCircle className="w-5 h-5 mr-3" />
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-white">&times;</button>
    </div>
  );
};
