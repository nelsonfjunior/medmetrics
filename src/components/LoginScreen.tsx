import React, { useState } from 'react';
import { ChartBarIcon } from './icons';

interface LoginScreenProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }) => {
  console.log('🔑 LoginScreen renderizando...');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 LoginScreen handleLogin chamado com:', { email, password: password ? '***' : 'VAZIO', rememberMe });

    // Validação rigorosa
    if (email.trim() === '') {
      console.log('❌ LoginScreen: Email vazio - bloqueando');
      alert('Por favor, insira um e-mail.');
      return;
    }

    if (password.trim() === '') {
      console.log('❌ LoginScreen: Senha vazia - bloqueando');
      alert('Por favor, insira uma senha.');
      return;
    }

    if (!email.includes('@')) {
      console.log('❌ LoginScreen: Email inválido - bloqueando');
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    console.log('✅ LoginScreen: Validações passaram - chamando onLogin');
    onLogin(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-light-gray dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-dark p-3 rounded-xl shadow-lg">
            <ChartBarIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">MedMetrics</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Acompanhe seu progresso e evolua todo dia.</p>

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
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
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-medium bg-gray-100 border-gray-300 rounded focus:ring-primary-medium dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2">Salvar senha</span>
            </label>
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline focus:outline-none"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-primary-medium hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            ENTRAR
          </button>

          <button
            type="button"
            onClick={onNavigateToRegister}
            className="w-full mt-4 bg-transparent border-2 border-primary-medium text-primary-medium font-bold py-3 px-4 rounded-lg hover:bg-primary-medium hover:text-white transition duration-300"
          >
            CADASTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;