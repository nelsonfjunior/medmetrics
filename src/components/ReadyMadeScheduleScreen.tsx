import React, { useState } from 'react';
import type { UserData } from '../types';
import { STUDY_PLAN_DATA } from '../constants';

interface ReadyMadeScheduleScreenProps {
    userData: UserData;
    updateUserData: (updater: (userData: UserData) => Partial<UserData>) => void;
}

const ReadyMadeScheduleScreen: React.FC<ReadyMadeScheduleScreenProps> = ({ userData, updateUserData }) => {
    const [openWeek, setOpenWeek] = useState<number | null>(1);
    
    const handleToggleTheme = (week: number, theme: string) => {
        const key = `ready-${week}-${theme}`; // Use a unique prefix
        updateUserData(data => {
            const currentProgress = data.studyPlanProgress || {};
            return {
                ...data,
                studyPlanProgress: {
                    ...currentProgress,
                    [key]: !currentProgress[key],
                }
            };
        });
    };

    const handleToggleWeek = (week: number) => {
        setOpenWeek(prev => prev === week ? null : week);
    }

    const studyPlanProgress = userData.studyPlanProgress || {};

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cronograma Pronto</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Um plano de estudos sequencial e direcionado para sua aprovação.</p>
            
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                    {STUDY_PLAN_DATA.map((weekData) => {
                        const totalAulas = weekData.themes.length;
                        const completedAulas = weekData.themes.filter(aula => studyPlanProgress[`ready-${weekData.week}-${aula.theme}`]).length;
                        const progress = totalAulas > 0 ? (completedAulas / totalAulas) * 100 : 0;
                        
                        const themesBySubject = weekData.themes.reduce((acc, themeObj) => {
                            if (!acc[themeObj.subject]) {
                                acc[themeObj.subject] = [];
                            }
                            acc[themeObj.subject].push(themeObj.theme);
                            return acc;
                        }, {} as Record<string, string[]>);

                        return (
                            <details key={weekData.week} open={openWeek === weekData.week} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <summary onClick={(e) => { e.preventDefault(); handleToggleWeek(weekData.week); }} className="p-4 cursor-pointer flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Semana {weekData.week}</h3>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2 max-w-xs">
                                            <div className="bg-primary-medium h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
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
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => handleToggleTheme(weekData.week, aula)}
                                                                    className="w-5 h-5 text-primary-medium bg-gray-100 border-gray-300 rounded focus:ring-primary-medium dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                />
                                                                <span className={`ml-3 text-gray-700 dark:text-gray-300 ${isChecked ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                                                                    {aula}
                                                                </span>
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
                </div>
            </div>
        </div>
    );
};

export default ReadyMadeScheduleScreen;