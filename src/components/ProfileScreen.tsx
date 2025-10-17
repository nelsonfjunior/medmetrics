import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { SunIcon, MoonIcon, LogoutIcon, UserCircleIcon } from './icons';
import type { UserProfile } from '../types';

interface ProfileScreenProps {
    onLogout: () => void;
    profile: UserProfile;
    updateProfile: (data: Partial<UserProfile>) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, profile, updateProfile }) => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Perfil / Configurações</h2>
            
            <div className="max-w-2xl mx-auto space-y-6">

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-light-gray dark:bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">Minhas Metas de Estudo</h4>
                    <textarea 
                        value={profile.studyGoal}
                        onChange={(e) => updateProfile({ studyGoal: e.target.value })}
                        rows={2}
                        className="w-full p-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                        placeholder="Defina sua meta aqui..."
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">Local Aonde Quero Passar</h4>
                    <input 
                        type="text"
                        value={profile.residencyLocation}
                        onChange={(e) => updateProfile({ residencyLocation: e.target.value })}
                        className="w-full p-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                        placeholder="Ex: Hospital das Clínicas - USP"
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Opções</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">Modo Escuro</span>
                            <button onClick={toggleDarkMode} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-600">
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                {isDarkMode ? <MoonIcon className="absolute right-1 w-4 h-4 text-yellow-300"/> : <SunIcon className="absolute left-1 w-4 h-4 text-yellow-500"/>}
                            </button>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <button className="w-full text-left text-gray-600 dark:text-gray-300 hover:text-primary-medium transition">
                            Exportar Dados (PDF/Excel)
                        </button>
                    </div>
                </div>

                <button 
                    onClick={onLogout}
                    className="w-full mt-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
                >
                    <LogoutIcon className="w-5 h-5 mr-2" />
                    Sair da Conta
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;