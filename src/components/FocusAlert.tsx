
import React from 'react';
import { BrainIcon } from './icons';

interface FocusAlertProps {
  onClose: () => void;
}

const FocusAlert: React.FC<FocusAlertProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 dark:bg-yellow-500/20 p-4 rounded-full">
            <BrainIcon className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Hora de Focar!</h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Percebemos que seu desempenho nesta sessão foi um pouco abaixo do esperado. Não desanime! 
          Que tal fazer uma pequena pausa, respirar fundo e voltar com ainda mais determinação? Você consegue!
        </p>
        
        <button 
          onClick={onClose}
          className="w-full bg-primary-medium hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Entendi, vamos com tudo!
        </button>
      </div>
    </div>
  );
};

export default FocusAlert;
