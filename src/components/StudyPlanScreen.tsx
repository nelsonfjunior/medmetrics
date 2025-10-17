import React, { useState } from 'react';
import type { UserData, Page } from '../types';
import { ROTATION_STUDY_PLAN, SUBJECTS, STUDY_PLAN_DATA } from '../constants';
import { AcademicCapIcon, ChevronLeftIcon, ClipboardListIcon } from './icons';

interface StudyPlanScreenProps {
    userData: UserData;
    updateUserData: (updater: (userData: UserData) => Partial<UserData>) => void;
    setCurrentPage: (page: Page) => void;
    setPrefilledSession: (session: { subject: string; theme: string }) => void;
}

const StudyPlanScreen: React.FC<StudyPlanScreenProps> = (props) => {
    const [planType, setPlanType] = useState<'rotation' | 'ready-made' | null>(null);

    if (planType === 'rotation') {
        return <RotationPlanView {...props} onBack={() => setPlanType(null)} />;
    }

    if (planType === 'ready-made') {
        return <ReadyMadePlanView {...props} onBack={() => setPlanType(null)} />;
    }

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Plano de Estudos</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Escolha um modelo de cronograma para seguir.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div 
                    onClick={() => setPlanType('rotation')}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center"
                >
                    <div className="bg-primary-dark/10 dark:bg-primary-medium/20 p-4 rounded-full mb-4">
                        <AcademicCapIcon className="w-12 h-12 text-primary-medium" />
                    </div>
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white">Plano por Matéria</h3>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Sincronize seus estudos com o seu rodízio do internato.</p>
                </div>
                <div 
                    onClick={() => setPlanType('ready-made')}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center"
                >
                    <div className="bg-primary-dark/10 dark:bg-primary-medium/20 p-4 rounded-full mb-4">
                        <ClipboardListIcon className="w-12 h-12 text-primary-medium" />
                    </div>
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white">Cronograma Pronto</h3>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Um plano extensivo com 4 temas por semana para uma preparação completa.</p>
                </div>
            </div>
        </div>
    );
};


// --- ROTAION PLAN VIEW ---
const RotationPlanView: React.FC<StudyPlanScreenProps & { onBack: () => void }> = ({ userData, updateUserData, setCurrentPage, setPrefilledSession, onBack }) => {
    const [openWeek, setOpenWeek] = useState<number | null>(1);
    
    const currentRotation = userData.studyPlanRotation?.subject;

    const handleSelectRotation = (subject: string) => {
        updateUserData(data => ({ ...data, studyPlanRotation: { subject } }));
    };

    const handleClearRotation = () => {
        updateUserData(data => ({ ...data, studyPlanRotation: { subject: null } }));
    };

    const handleToggleTheme = (week: number, theme: string) => {
        if (!currentRotation) return;
        const key = `rotation-${currentRotation}-${week}-${theme}`;
        updateUserData(data => {
            const currentProgress = data.studyPlanProgress || {};
            return { ...data, studyPlanProgress: { ...currentProgress, [key]: !currentProgress[key] } };
        });
    };

    const studyPlanProgress = userData.studyPlanProgress || {};

    if (!currentRotation) {
        return (
            <div className="p-4 md:p-8">
                <button onClick={onBack} className="flex items-center text-primary-medium font-semibold mb-6 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Voltar
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Plano por Matéria</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Escolha a matéria que você está estudando agora.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SUBJECTS.map(subject => (
                        <div key={subject} onClick={() => handleSelectRotation(subject)} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                            <div className="bg-primary-dark/10 dark:bg-primary-medium/20 p-4 rounded-full mb-4"><AcademicCapIcon className="w-10 h-10 text-primary-medium" /></div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-white">{subject}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ROTATION_STUDY_PLAN[subject]?.length || 0} semanas</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const planForRotation = ROTATION_STUDY_PLAN[currentRotation] || [];
    return (
        <div className="p-4 md:p-8">
            <button onClick={onBack} className="flex items-center text-primary-medium font-semibold mb-6 hover:underline"><ChevronLeftIcon className="w-5 h-5 mr-1" />Voltar</button>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div><h2 className="text-3xl font-bold text-gray-800 dark:text-white">Plano de {currentRotation}</h2><p className="text-gray-600 dark:text-gray-400">Seu cronograma de estudos focado.</p></div>
                <button onClick={handleClearRotation} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">Mudar Matéria</button>
            </div>
            <div className="max-w-4xl mx-auto"><div className="space-y-4">
                {planForRotation.map((weekData) => {
                    const totalAulas = weekData.themes.length;
                    const completedAulas = weekData.themes.filter(aula => studyPlanProgress[`rotation-${currentRotation}-${weekData.week}-${aula}`]).length;
                    const progress = totalAulas > 0 ? (completedAulas / totalAulas) * 100 : 0;
                    return (
                        <details key={weekData.week} open={openWeek === weekData.week} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <summary onClick={(e) => { e.preventDefault(); setOpenWeek(prev => prev === weekData.week ? null : weekData.week); }} className="p-4 cursor-pointer flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Semana {weekData.week}</h3>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2 max-w-xs"><div className="bg-primary-medium h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{completedAulas}/{totalAulas} Aulas</span>
                            </summary>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700"><ul className="space-y-3">
                                {weekData.themes.map(aula => {
                                    const isChecked = studyPlanProgress[`rotation-${currentRotation}-${weekData.week}-${aula}`] || false;
                                    return (
                                        <li key={aula} className="flex items-center justify-between">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" checked={isChecked} onChange={() => handleToggleTheme(weekData.week, aula)} className="w-5 h-5 text-primary-medium bg-gray-100 border-gray-300 rounded focus:ring-primary-medium dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <span className={`ml-3 text-gray-700 dark:text-gray-300 ${isChecked ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{aula}</span>
                                            </label>
                                            {isChecked && (<button onClick={() => { setPrefilledSession({ subject: currentRotation, theme: aula }); setCurrentPage('add-session'); }} className="ml-4 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 animate-fade-in">Adicionar Questões</button>)}
                                        </li>
                                    )
                                })}
                            </ul></div>
                        </details>
                    )
                })}
            </div></div>
        </div>
    );
};


// --- READY-MADE PLAN VIEW ---
const ReadyMadePlanView: React.FC<StudyPlanScreenProps & { onBack: () => void }> = ({ userData, updateUserData, onBack }) => {
    const [openWeek, setOpenWeek] = useState<number | null>(1);
    
    const handleToggleTheme = (week: number, theme: string) => {
        const key = `ready-${week}-${theme}`;
        updateUserData(data => {
            const currentProgress = data.studyPlanProgress || {};
            return { ...data, studyPlanProgress: { ...currentProgress, [key]: !currentProgress[key] } };
        });
    };

    const studyPlanProgress = userData.studyPlanProgress || {};

    return (
        <div className="p-4 md:p-8">
            <button onClick={onBack} className="flex items-center text-primary-medium font-semibold mb-6 hover:underline"><ChevronLeftIcon className="w-5 h-5 mr-1" />Voltar</button>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cronograma Pronto</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Um plano de estudos sequencial e direcionado para sua aprovação.</p>
            <div className="max-w-4xl mx-auto"><div className="space-y-4">
                {STUDY_PLAN_DATA.map((weekData) => {
                    const totalAulas = weekData.themes.length;
                    const completedAulas = weekData.themes.filter(aula => studyPlanProgress[`ready-${weekData.week}-${aula.theme}`]).length;
                    const progress = totalAulas > 0 ? (completedAulas / totalAulas) * 100 : 0;
                    const themesBySubject = weekData.themes.reduce((acc, themeObj) => {
                        if (!acc[themeObj.subject]) acc[themeObj.subject] = [];
                        acc[themeObj.subject].push(themeObj.theme);
                        return acc;
                    }, {} as Record<string, string[]>);

                    return (
                        <details key={weekData.week} open={openWeek === weekData.week} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <summary onClick={(e) => { e.preventDefault(); setOpenWeek(prev => prev === weekData.week ? null : weekData.week); }} className="p-4 cursor-pointer flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Semana {weekData.week}</h3>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2 max-w-xs"><div className="bg-primary-medium h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{completedAulas}/{totalAulas} Aulas</span>
                            </summary>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                {Object.entries(themesBySubject).map(([subject, themes]) => (
                                    <div key={subject} className="mb-4 last:mb-0">
                                        <h4 className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-2">{subject}</h4>
                                        <ul className="space-y-3">
                                            {themes.map(aula => {
                                                const isChecked = studyPlanProgress[`ready-${weekData.week}-${aula}`] || false;
                                                return (
                                                    <li key={aula} className="flex items-center">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input type="checkbox" checked={isChecked} onChange={() => handleToggleTheme(weekData.week, aula)} className="w-5 h-5 text-primary-medium bg-gray-100 border-gray-300 rounded focus:ring-primary-medium dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                            <span className={`ml-3 text-gray-700 dark:text-gray-300 ${isChecked ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{aula}</span>
                                                        </label>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </details>
                    )
                })}
            </div></div>
        </div>
    );
};

export default StudyPlanScreen;