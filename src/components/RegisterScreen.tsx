import React, { useState } from 'react';
import { ChartBarIcon } from './icons';

interface RegisterScreenProps {
  onRegister: (name: string, email: string, password: string, securityAnswer: string) => void;
  onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '' || password.trim() === '' || securityAnswer.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    onRegister(name, email, password, securityAnswer);
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-light-gray dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-dark p-3 rounded-xl shadow-lg">
            <ChartBarIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Criar Conta</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Comece sua jornada para a aprovação.</p>
        
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
            />
            <input 
              type="email" 
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
            />
            <input 
              type="password" 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
            />
            <div className="text-left pt-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pergunta de Segurança</label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Isso será usado para recuperar sua conta se você esquecer a senha.</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Qual o nome do seu primeiro animal de estimação?</p>
                <input 
                    type="text" 
                    placeholder="Resposta de segurança"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                    />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full mt-8 bg-primary-medium hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            CADASTRAR
          </button>
        </form>
        
        <div className="mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Já tem uma conta?{' '}
                <button onClick={onNavigateToLogin} className="font-semibold text-primary-medium hover:underline">
                    Faça login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;