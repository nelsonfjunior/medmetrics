

import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { StudySession, Badge } from '../types';
import { TrophyIcon, LightBulbIcon, BellIcon } from './icons';
import { SUBJECTS } from '../constants';

interface DashboardProps {
  sessions: StudySession[];
  badges: Badge[];
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="bg-primary-dark text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
    <p className="text-sm text-blue-200">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
        <div className="h-64">
            {children}
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ sessions, badges }) => {
  const [selectedSubject, setSelectedSubject] = useState('Geral');

  const filteredSessions = useMemo(() => {
    if (selectedSubject === 'Geral') {
      return sessions;
    }
    return sessions.filter(s => s.subject === selectedSubject);
  }, [sessions, selectedSubject]);

  const totalQuestions = filteredSessions.reduce((sum, s) => sum + s.questions, 0);
  const totalCorrect = filteredSessions.reduce((sum, s) => sum + s.correct, 0);
  const totalErrors = totalQuestions - totalCorrect;
  const totalAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) + '%' : '0%';
  const totalSessions = filteredSessions.length;

  const weeklyData = filteredSessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
      date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      acertos: s.accuracy,
    }));

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
      acertos: data.questions > 0 ? parseFloat(((data.correct / data.questions) * 100).toFixed(1)) : 0,
    }));
  }, [sessions]);

  const focusAreas = useMemo(() => {
    return [...performanceBySubject].sort((a, b) => a.acertos - b.acertos);
  }, [performanceBySubject]);

  const scheduledReviews = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allReviews = sessions
      .map(session => {
        const sessionDate = new Date(session.date);
        let reviewInDays: number;

        if (session.accuracy < 60) {
          reviewInDays = 1;
        } else if (session.accuracy < 80) {
          reviewInDays = 3;
        } else if (session.accuracy < 90) {
          reviewInDays = 7;
        } else {
          reviewInDays = 30;
        }

        const reviewDate = new Date(sessionDate);
        reviewDate.setDate(reviewDate.getDate() + reviewInDays);
        reviewDate.setHours(0, 0, 0, 0);
        return { ...session, reviewDate };
      })
      .sort((a, b) => a.reviewDate.getTime() - b.reviewDate.getTime());

    const dueReviews = allReviews.filter(review => review.reviewDate <= today);
    const upcomingReviews = allReviews.filter(review => review.reviewDate > today);

    return { dueReviews, upcomingReviews };
  }, [sessions]);

  const formatDateDue = (date: Date): { text: string; isUrgent: boolean } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewDate = new Date(date);
    reviewDate.setHours(0, 0, 0, 0);

    const diffTime = reviewDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        const days = Math.abs(diffDays);
        return { text: `Atrasado ${days} ${days === 1 ? 'dia' : 'dias'}`, isUrgent: true };
    }
    if (diffDays === 0) {
        return { text: "Revisar hoje", isUrgent: true };
    }
    if (diffDays === 1) {
        return { text: "Revisar amanhã", isUrgent: false };
    }
    return { text: `Revisar em ${diffDays} dias`, isUrgent: false };
  };

  const ReviewListItem: React.FC<{review: StudySession & {reviewDate: Date}, isUpcoming?: boolean}> = ({ review, isUpcoming }) => {
    const { text, isUrgent } = formatDateDue(review.reviewDate);
    return (
        <li className={`flex justify-between items-center bg-light-gray dark:bg-gray-700/50 p-3 rounded-lg ${isUpcoming ? 'opacity-80' : ''}`}>
            <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">{review.subject}</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.theme || 'Tópico geral'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isUpcoming 
                        ? `Agendado para ${new Date(review.reviewDate).toLocaleDateString('pt-BR')}`
                        : `Sessão de ${new Date(review.date).toLocaleDateString('pt-BR')} com ${review.accuracy.toFixed(0)}% de acerto`
                    }
                </p>
            </div>
            <div className="text-right flex flex-col items-end min-w-[120px]">
                <span className={`font-bold ${isUrgent ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{text}</span>
                {!isUpcoming && (
                    <button className="mt-1 bg-primary-medium text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-primary-dark transition">
                        Revisar
                    </button>
                )}
            </div>
        </li>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <select 
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-medium focus:outline-none transition"
        >
          <option value="Geral">Visão Geral</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total de Questões" value={totalQuestions} />
        <StatCard title="Acertos Totais" value={totalCorrect} />
        <StatCard title="Erros Totais" value={totalErrors} />
        <StatCard title="% de Acertos" value={totalAccuracy} />
        <StatCard title="Sessões Concluídas" value={totalSessions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Evolução Semanal">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs text-gray-600 dark:text-gray-400" />
              <YAxis unit="%" className="text-xs text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  color: '#333'
                }}
              />
              <Line type="monotone" dataKey="acertos" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        
        {selectedSubject === 'Geral' && (
            <ChartCard title="Desempenho por Matéria">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceBySubject} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" className="text-xs text-gray-600 dark:text-gray-400" />
                    <YAxis unit="%" className="text-xs text-gray-600 dark:text-gray-400" />
                    <Tooltip 
                        contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        color: '#333'
                        }}
                    />
                    <Bar dataKey="acertos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        )}
      </div>
      
      {selectedSubject === 'Geral' && (scheduledReviews.dueReviews.length > 0 || scheduledReviews.upcomingReviews.length > 0) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <BellIcon className="w-6 h-6 mr-3 text-primary-medium" />
                Revisões Agendadas
            </h3>
            {scheduledReviews.dueReviews.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-bold text-red-500 mb-2">Para Hoje / Atrasadas</h4>
                    <ul className="space-y-3">
                        {scheduledReviews.dueReviews.map((review) => (
                           <ReviewListItem key={review.id} review={review} />
                        ))}
                    </ul>
                </div>
            )}
            {scheduledReviews.upcomingReviews.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-bold text-gray-600 dark:text-gray-300 mb-2">Próximas Revisões</h4>
                    <ul className="space-y-3">
                        {scheduledReviews.upcomingReviews.slice(0, 5).map((review) => (
                           <ReviewListItem key={review.id} review={review} isUpcoming />
                        ))}
                        {scheduledReviews.upcomingReviews.length > 5 && (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                                ...e mais {scheduledReviews.upcomingReviews.length - 5} agendadas.
                            </p>
                        )}
                    </ul>
                </div>
            )}
        </div>
      )}

      {selectedSubject === 'Geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-400" />
                    Áreas para Foco
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Matérias ordenadas pelo menor percentual de acertos.</p>
                <ul className="space-y-3">
                    {focusAreas.map(({ name, acertos }) => (
                        <li key={name} className="flex justify-between items-center bg-light-gray dark:bg-gray-700/50 p-3 rounded-lg">
                            <span className="font-medium text-gray-700 dark:text-gray-200">{name}</span>
                            <span className={`font-bold text-lg ${acertos < 70 ? 'text-red-500' : acertos < 85 ? 'text-yellow-500' : 'text-green-500'}`}>{acertos}%</span>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Badges de Progresso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.filter(b => b.achieved).map(badge => (
                        <div key={badge.id} className="bg-success text-white p-4 rounded-xl shadow-lg flex items-center">
                        <div className="bg-white/20 p-2 rounded-full">
                            {badge.icon}
                        </div>
                        <div className="ml-3">
                            <p className="font-bold text-sm">{badge.title}</p>
                            <p className="text-xs opacity-90">{badge.description}</p>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;