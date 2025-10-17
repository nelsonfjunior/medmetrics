import React, { useState } from 'react';
import type { UserData } from '../types';
import { ChartBarIcon } from './icons';

interface ForgotPasswordScreenProps {
    allUsersData: Record<string, UserData>;
    onResetPassword: (email: string, newPassword: string) => void;
    onNavigateToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ allUsersData, onResetPassword, onNavigateToLogin }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const user = allUsersData[email];

    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!user) {
            setError('Nenhum usuário encontrado com este e-mail.');
            return;
        }
        setStep(2);
    };

    const handleStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Case-insensitive and trim comparison for user-friendliness
        if (user.securityAnswer.trim().toLowerCase() !== securityAnswer.trim().toLowerCase()) {
            setError('Resposta de segurança incorreta.');
            return;
        }
        setStep(3);
    };

    const handleStep3 = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        onResetPassword(email, newPassword);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-light-gray dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary-dark p-3 rounded-xl shadow-lg">
                        <ChartBarIcon className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Recuperar Senha</h1>
                {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm">{error}</p>}

                {step === 1 && (
                    <form onSubmit={handleStep1}>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Insira seu e-mail para começar.</p>
                        <input 
                            type="email" 
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 rounded-lg mb-4"
                            required
                        />
                        <button type="submit" className="w-full bg-primary-medium hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition">Avançar</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleStep2}>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Responda sua pergunta de segurança.</p>
                        <div className="text-left mb-4">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Qual o nome do seu primeiro animal de estimação?</p>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Sua resposta"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 rounded-lg mb-4"
                            required
                        />
                        <button type="submit" className="w-full bg-primary-medium hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition">Verificar</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleStep3}>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Crie uma nova senha.</p>
                        <div className="space-y-4">
                             <input 
                                type="password" 
                                placeholder="Nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 rounded-lg"
                                required
                            />
                            <input 
                                type="password" 
                                placeholder="Confirme a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 rounded-lg"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full mt-6 bg-primary-medium hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition">Redefinir Senha</button>
                    </form>
                )}
                
                <div className="mt-6">
                    <button onClick={onNavigateToLogin} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                        Voltar para o Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;