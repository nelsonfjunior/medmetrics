
import React, { useState, useMemo } from 'react';
import type { Page, StudySession } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ReviewsScreenProps {
    sessions: StudySession[];
    setCurrentPage: (page: Page) => void;
}

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

const ReviewListItem: React.FC<{
    review: StudySession & {
        reviewDate: Date;
        reviewStep: number;
        totalSteps: number;
    };
    setCurrentPage: (page: Page) => void;
}> = ({ review, setCurrentPage }) => {
    const { text, isUrgent } = formatDateDue(review.reviewDate);
    
    let reviewTip = '';
    const stepIndicator = review.totalSteps > 1 ? `(${review.reviewStep}ª de ${review.totalSteps} revisões)` : '';

    if (review.accuracy < 50) {
        reviewTip = review.reviewStep === 1
            ? `Dica: Refaça a base! Releia a teoria com calma.`
            : `Dica: Fixação! Tente explicar o tema em voz alta.`;
    } else if (review.accuracy < 80) {
        reviewTip = review.reviewStep === 1
            ? `Dica: Pontos fracos. Refaça as questões que errou.`
            : `Dica: Consolidação. Foque em velocidade e pegadinhas.`;
    } else { // >= 80
        reviewTip = `Dica: Manutenção. Leitura rápida de anotações.`;
    }

    return (
        <li className="flex flex-col items-start bg-light-gray dark:bg-gray-700/50 p-4 rounded-lg w-full">
            <div className="flex justify-between items-center w-full">
                <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">{review.subject}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.theme || 'Tópico geral'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sessão de {new Date(review.date).toLocaleDateString('pt-BR')} com {review.accuracy.toFixed(0)}% de acerto
                    </p>
                </div>
                <div className="text-right flex flex-col items-end min-w-[120px]">
                    <span className={`font-bold ${isUrgent ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{text}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stepIndicator}</span>
                    <button onClick={() => setCurrentPage('add-session')} className="mt-1 bg-primary-medium text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-primary-dark transition">
                        Registrar Revisão
                    </button>
                </div>
            </div>
            {reviewTip && (
                 <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 w-full">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">{reviewTip}</p>
                </div>
            )}
        </li>
    );
};

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ sessions, setCurrentPage }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const allReviews = useMemo(() => {
        const latestSessionByTopic: Record<string, StudySession> = {};
        sessions.forEach(session => {
            const topicKey = `${session.subject}-${session.theme || 'geral'}`;
            if (!latestSessionByTopic[topicKey] || new Date(session.date) > new Date(latestSessionByTopic[topicKey].date)) {
                latestSessionByTopic[topicKey] = session;
            }
        });

        return Object.values(latestSessionByTopic)
            .flatMap(session => {
                const sessionDate = new Date(session.date);
                let reviewIntervals: number[];
                if (session.accuracy < 50) {
                    reviewIntervals = [2, 7, 15];
                } else if (session.accuracy < 80) {
                    reviewIntervals = [7, 21];
                } else {
                    reviewIntervals = [30];
                }
        
                return reviewIntervals.map((days, index) => {
                    const reviewDate = new Date(sessionDate);
                    reviewDate.setDate(reviewDate.getDate() + days);
                    reviewDate.setHours(0, 0, 0, 0);
                    return { 
                        ...session, 
                        reviewDate,
                        id: `${session.id}-review-${index}`,
                        reviewStep: index + 1,
                        totalSteps: reviewIntervals.length,
                    };
                });
            })
            .sort((a, b) => a.reviewDate.getTime() - b.reviewDate.getTime());
    }, [sessions]);
    
    const reviewsByDate = useMemo(() => {
        return allReviews.reduce((acc, review) => {
            const dateKey = review.reviewDate.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(review);
            return acc;
        }, {} as Record<string, (StudySession & { reviewDate: Date; reviewStep: number; totalSteps: number; })[]>);
    }, [allReviews]);

    const handleDateClick = (date: Date) => {
        if (selectedDate?.getTime() === date.getTime()) {
            setSelectedDate(null); // Deselect if clicked again
        } else {
            setSelectedDate(date);
        }
    };

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toISOString().split('T')[0];
            const hasReviews = reviewsByDate[dateKey]?.length > 0;

            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            let dayClasses = "relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200";
            if (isSelected) {
                dayClasses += " bg-primary-medium text-white font-bold";
            } else if (isToday) {
                dayClasses += " ring-2 ring-primary-medium text-primary-medium font-bold";
            } else {
                dayClasses += " text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700";
            }

            days.push(
                <div key={day} className="flex justify-center items-center py-1">
                    <div className={dayClasses} onClick={() => handleDateClick(date)}>
                        {day}
                        {hasReviews && !isSelected && <span className="absolute bottom-1 w-1.5 h-1.5 bg-primary-medium rounded-full"></span>}
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate)}
                    </h3>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-center font-medium text-sm text-gray-500 dark:text-gray-400 pb-2">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    const reviewsForSelectedDate = selectedDate ? (reviewsByDate[selectedDate.toISOString().split('T')[0]] || []) : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueReviews = allReviews.filter(r => r.reviewDate <= today);

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Minhas Revisões</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    {renderCalendar()}
                </div>
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-4 px-2">
                            {selectedDate 
                                ? `Revisões para ${selectedDate.toLocaleDateString('pt-BR')}`
                                : 'Revisões Pendentes'}
                        </h3>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {selectedDate ? (
                                reviewsForSelectedDate.length > 0 ? (
                                    reviewsForSelectedDate.map(review => <ReviewListItem key={review.id} review={review} setCurrentPage={setCurrentPage} />)
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 dark:text-gray-400">Nenhuma revisão para esta data.</p>
                                    </div>
                                )
                            ) : (
                                dueReviews.length > 0 ? (
                                    dueReviews.map(review => <ReviewListItem key={review.id} review={review} setCurrentPage={setCurrentPage} />)
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 dark:text-gray-400">Você está em dia com as revisões!</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Selecione um dia no calendário para ver as próximas.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsScreen;
