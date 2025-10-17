

import React, { useState, useMemo } from 'react';
import type { StudySession } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChevronLeftIcon } from './icons';

interface PerformanceAnalysisScreenProps {
    sessions: StudySession[];
}

const PerformanceAnalysisScreen: React.FC<PerformanceAnalysisScreenProps> = ({ sessions }) => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const performanceBySubject = useMemo(() => {
        // FIX: Correctly type the accumulator in the `reduce` function to ensure type safety.
        const subjectData = sessions.reduce<Record<string, { questions: number; correct: number }>>((acc, session) => {
            if (!acc[session.subject]) {
                acc[session.subject] = { questions: 0, correct: 0 };
            }
            acc[session.subject].questions += session.questions;
            acc[session.subject].correct += session.correct;
            return acc;
        }, {});

        return Object.entries(subjectData).map(([name, data]) => ({
            name,
            accuracy: data.questions > 0 ? (data.correct / data.questions) * 100 : 0,
            questionCount: data.questions
        })).sort((a, b) => b.accuracy - a.accuracy);
    }, [sessions]);

    const performanceByTheme = useMemo(() => {
        if (!selectedSubject) return [];
        
        const subjectSessions = sessions.filter(s => s.subject === selectedSubject);
        // FIX: Correctly type the accumulator in the `reduce` function to ensure type safety.
        const themeData = subjectSessions.reduce<Record<string, { questions: number; correct: number }>>((acc, session) => {
            const theme = session.theme || 'Tópico Geral';
            if (!acc[theme]) {
                acc[theme] = { questions: 0, correct: 0 };
            }
            acc[theme].questions += session.questions;
            acc[theme].correct += session.correct;
            return acc;
        }, {});
        
        return Object.entries(themeData).map(([name, data]) => ({
            name,
            accuracy: data.questions > 0 ? (data.correct / data.questions) * 100 : 0,
            questionCount: data.questions
        })).sort((a, b) => a.accuracy - b.accuracy); // Sort by lowest accuracy first
    }, [sessions, selectedSubject]);

    const AccuracyIndicator: React.FC<{ accuracy: number }> = ({ accuracy }) => {
        const color = accuracy < 70 ? 'text-red-500' : accuracy < 85 ? 'text-yellow-500' : 'text-green-500';
        return <span className={`font-bold text-xl ${color}`}>{accuracy.toFixed(1)}%</span>;
    };
    
    const MiniThemeChart: React.FC<{ theme: string }> = ({ theme }) => {
        const chartData = useMemo(() => {
            return sessions
                .filter(s => s.subject === selectedSubject && s.theme === theme)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(s => ({
                    date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                    acertos: s.accuracy,
                }));
        }, [sessions, selectedSubject, theme]);

        if (chartData.length < 2) {
            return <div className="h-[80px] flex items-center justify-center text-xs text-gray-400">Dados insuficientes para gráfico.</div>;
        }

        return (
            <div className="h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                         <Tooltip contentStyle={{ fontSize: 12, padding: '2px 8px' }}/>
                         <Line type="monotone" dataKey="acertos" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (selectedSubject) {
        return (
            <div className="p-4 md:p-8">
                <button onClick={() => setSelectedSubject(null)} className="flex items-center text-primary-medium font-semibold mb-6 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Voltar para Matérias
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Desempenho em {selectedSubject}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Análise detalhada por tema, ordenado pelos seus pontos mais fracos.</p>
                
                <div className="space-y-4">
                    {performanceByTheme.map(theme => (
                        <div key={theme.name} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-1">
                                <p className="font-bold text-gray-800 dark:text-white">{theme.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{theme.questionCount} questões</p>
                            </div>
                            <div className="md:col-span-1 text-center">
                                <AccuracyIndicator accuracy={theme.accuracy} />
                            </div>
                             <div className="md:col-span-1">
                                <MiniThemeChart theme={theme.name} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Análise de Desempenho</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Clique em uma matéria para ver um relatório detalhado por tema.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceBySubject.map(subject => (
                    <div 
                        key={subject.name} 
                        onClick={() => setSelectedSubject(subject.name)}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    >
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">{subject.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{subject.questionCount} questões totais</p>
                        <div className="text-right">
                           <AccuracyIndicator accuracy={subject.accuracy} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceAnalysisScreen;