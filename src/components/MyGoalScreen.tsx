
import React from 'react';
import type { Goal } from '../types';

const GoalCard: React.FC<{ 
    goal: Goal; 
    index: number; 
    onGoalChange: (index: number, field: 'name' | 'date', value: string) => void 
}> = ({ goal, index, onGoalChange }) => {
    
    const calculateCountdown = (examDate: string) => {
        if (!examDate) {
            return { days: null, message: "Defina a data da sua prova!" };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Adjust for timezone differences by parsing date as UTC
        const parts = examDate.split('-');
        const targetDate = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { days: null, message: "O grande dia já passou! Parabéns pela jornada." };
        }
        if (diffDays === 0) {
            return { days: 0, message: "É HOJE! O grande dia chegou!" };
        }

        return { days: diffDays, message: `Faltam ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}` };
    };
    
    const countdown = calculateCountdown(goal.date);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col">
            <div className="text-center mb-6">
                {countdown.days !== null && countdown.days >= 0 ? (
                    <>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">{countdown.days === 0 ? 'Boa prova!' : 'Contagem Regressiva'}</p>
                        <div className="text-6xl font-bold text-primary-medium my-2">{countdown.days}</div>
                        <p className="text-md text-gray-700 dark:text-gray-200">{countdown.message}</p>
                    </>
                ) : (
                    <p className="text-lg text-gray-700 dark:text-gray-200 h-[100px] flex items-center justify-center">{countdown.message}</p>
                )}
            </div>
            
            <div className="space-y-4 mt-auto">
                 <div>
                    <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1 text-sm">Hospital / Instituição</label>
                    <input
                        type="text"
                        value={goal.name}
                        onChange={(e) => onGoalChange(index, 'name', e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                        className="w-full p-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                    />
                </div>
                 <div>
                    <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1 text-sm">Data da Prova</label>
                    <input
                        type="date"
                        value={goal.date}
                        onChange={(e) => onGoalChange(index, 'date', e.target.value)}
                        className="w-full p-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                    />
                </div>
            </div>
        </div>
    );
}

interface MyGoalScreenProps {
    goals: Goal[];
    setGoals: (goals: Goal[]) => void;
}

const MyGoalScreen: React.FC<MyGoalScreenProps> = ({ goals, setGoals }) => {
    
    const handleGoalChange = (index: number, field: 'name' | 'date', value: string) => {
        const newGoals = goals.map((goal, i) =>
            i === index ? { ...goal, [field]: value } : goal
        );
        setGoals(newGoals);
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Minha Meta: Rumo à Aprovação</h2>
            
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {goals.map((goal, index) => (
                        <GoalCard 
                            key={index} 
                            goal={goal}
                            index={index}
                            onGoalChange={handleGoalChange}
                        />
                    ))}
                </div>
                <button className="w-full max-w-xs mx-auto block bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg cursor-default">
                    Salvo Automaticamente
                </button>
            </div>
        </div>
    );
};

export default MyGoalScreen;
