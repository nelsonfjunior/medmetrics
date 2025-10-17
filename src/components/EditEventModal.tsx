
import React, { useState, useEffect } from 'react';
import type { PlannerEvent } from '../types';
import { XIcon, TrashIcon } from './icons';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    addEvent: (event: Omit<PlannerEvent, 'id'>) => void;
    updateEvent: (event: PlannerEvent) => void;
    deleteEvent: (id: string) => void;
    eventToEdit?: PlannerEvent;
    selectedDate?: string;
}

const colors: { name: string; value: PlannerEvent['color'] }[] = [
    { name: 'Estudo', value: 'blue' },
    { name: 'Pessoal', value: 'purple' },
    { name: 'Academia', value: 'green' },
    { name: 'Trabalho', value: 'red' },
    { name: 'Lazer', value: 'pink' },
    { name: 'Importante', value: 'yellow' },
];

const EditEventModal: React.FC<EditEventModalProps> = ({ 
    isOpen, onClose, addEvent, updateEvent, deleteEvent, eventToEdit, selectedDate 
}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [color, setColor] = useState<PlannerEvent['color']>('blue');
    
    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDate(eventToEdit.date);
            setStartTime(eventToEdit.startTime);
            setEndTime(eventToEdit.endTime);
            setColor(eventToEdit.color);
        } else {
            setTitle('');
            setDate(selectedDate || new Date().toISOString().split('T')[0]);
            setStartTime('09:00');
            setEndTime('10:00');
            setColor('blue');
        }
    }, [eventToEdit, selectedDate, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !startTime || !endTime) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        if (startTime >= endTime) {
            alert('O horário de início deve ser anterior ao horário de término.');
            return;
        }
        
        const eventData = { title, date, startTime, endTime, color };
        if (eventToEdit) {
            updateEvent({ ...eventData, id: eventToEdit.id });
        } else {
            addEvent(eventData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-lg w-full transform transition-all animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {eventToEdit ? 'Editar Evento' : 'Novo Evento'}
                    </h2>
                    <button onClick={onClose} className="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                            <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Início</label>
                                <input 
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fim</label>
                                <input 
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
                             <div className="flex flex-wrap gap-2">
                                {colors.map(c => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setColor(c.value)}
                                        className={`px-3 py-1 text-sm rounded-full border-2 transition ${color === c.value ? 'border-primary-medium font-bold' : 'border-transparent'}`}
                                        style={{ backgroundColor: c.value, color: 'white' }}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <div>
                            {eventToEdit && (
                                <button
                                    type="button"
                                    onClick={() => deleteEvent(eventToEdit.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full transition"
                                >
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-primary-medium hover:bg-primary-dark text-white font-bold rounded-lg transition shadow-md"
                            >
                                {eventToEdit ? 'Salvar' : 'Adicionar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;
