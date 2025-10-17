
import React, { useState, useMemo } from 'react';
import type { PlannerEvent } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, TrashIcon } from './icons';
import EditEventModal from './EditEventModal';

interface PlannerScreenProps {
    events: PlannerEvent[];
    addEvent: (event: Omit<PlannerEvent, 'id'>) => void;
    updateEvent: (event: PlannerEvent) => void;
    deleteEvent: (id: string) => void;
}

const PlannerScreen: React.FC<PlannerScreenProps> = ({ events, addEvent, updateEvent, deleteEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        event?: PlannerEvent;
        date?: string;
    }>({ isOpen: false });

    const startOfWeek = useMemo(() => {
        const date = new Date(currentDate);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
    }, [currentDate]);
    
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [startOfWeek]);

    const eventsByDate = useMemo(() => {
        const grouped = events.reduce((acc, event) => {
            const date = event.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, PlannerEvent[]>);

        // Sort events within each day by start time
        for (const date in grouped) {
            grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
        }
        return grouped;
    }, [events]);

    const changeWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(startOfWeek);
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
        setCurrentDate(newDate);
    };

    const handleOpenModalForNew = (date: Date) => {
        setModalState({ isOpen: true, date: date.toISOString().split('T')[0] });
    };
    
    const handleOpenModalForEdit = (event: PlannerEvent) => {
        setModalState({ isOpen: true, event });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false });
    };

    const handleDelete = (id: string) => {
        if(window.confirm("Tem certeza que deseja excluir este evento?")) {
            deleteEvent(id);
            handleCloseModal();
        }
    }

    const weekFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

    const colorMap: Record<string, string> = {
        blue: 'bg-blue-500 border-blue-600',
        green: 'bg-green-500 border-green-600',
        red: 'bg-red-500 border-red-600',
        yellow: 'bg-yellow-400 border-yellow-500',
        purple: 'bg-purple-500 border-purple-600',
        pink: 'bg-pink-500 border-pink-600',
    };

    return (
        <div className="p-4 md:p-8 h-full flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Planner Semanal</h2>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex-none mb-6">
                <div className="flex justify-between items-center">
                    <button onClick={() => changeWeek('prev')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="text-center">
                         <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                            {weekFormatter.format(startOfWeek)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {startOfWeek.toLocaleDateString('pt-BR', {day: '2-digit'})} - {weekDays[6].toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                        </p>
                    </div>
                    <button onClick={() => changeWeek('next')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                 <button onClick={() => setCurrentDate(new Date())} className="w-full mt-4 text-sm font-semibold text-primary-medium hover:underline">
                    Voltar para Hoje
                </button>
            </div>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-7 gap-2 overflow-y-auto">
                {weekDays.map(day => {
                    const dateKey = day.toISOString().split('T')[0];
                    const dayEvents = eventsByDate[dateKey] || [];
                    const isToday = new Date().toDateString() === day.toDateString();

                    return (
                        <div key={dateKey} className={`bg-light-gray/50 dark:bg-gray-800/50 rounded-lg p-2 flex flex-col ${isToday ? 'border-2 border-primary-medium' : ''}`}>
                            <div className="flex justify-between items-center mb-3">
                                <div className="text-center">
                                    <p className={`font-bold text-sm ${isToday ? 'text-primary-medium' : 'text-gray-600 dark:text-gray-300'}`}>{day.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</p>
                                    <p className={`text-2xl font-bold ${isToday ? 'text-primary-medium' : 'text-gray-800 dark:text-white'}`}>{day.getDate()}</p>
                                </div>
                                <button onClick={() => handleOpenModalForNew(day)} className="p-1 text-gray-500 hover:text-primary-medium transition">
                                    <PlusCircleIcon className="w-7 h-7" />
                                </button>
                            </div>
                            <div className="space-y-2 overflow-y-auto flex-grow">
                                {dayEvents.map(event => (
                                    <div key={event.id} onClick={() => handleOpenModalForEdit(event)} className={`p-2 rounded-lg text-white shadow-sm cursor-pointer border-l-4 ${colorMap[event.color] || 'bg-gray-500 border-gray-600'}`}>
                                        <p className="font-bold text-sm">{event.title}</p>
                                        <p className="text-xs opacity-90">{event.startTime} - {event.endTime}</p>
                                    </div>
                                ))}
                                {dayEvents.length === 0 && (
                                     <div className="text-center pt-8 text-xs text-gray-400 dark:text-gray-500">
                                        Nenhum evento.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {modalState.isOpen && (
                <EditEventModal 
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    addEvent={addEvent}
                    updateEvent={updateEvent}
                    deleteEvent={handleDelete}
                    eventToEdit={modalState.event}
                    selectedDate={modalState.date}
                />
            )}
        </div>
    );
};

export default PlannerScreen;
