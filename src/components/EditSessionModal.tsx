
import React, { useState } from 'react';
import type { StudySession } from '../types';
import { XIcon } from './icons';

interface EditSessionModalProps {
  session: StudySession;
  onSave: (updatedSession: StudySession) => void;
  onClose: () => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({ session, onSave, onClose }) => {
  const [questions, setQuestions] = useState(session.questions.toString());
  const [correct, setCorrect] = useState(session.correct.toString());
  const [notes, setNotes] = useState(session.notes || '');

  const handleSave = () => {
    const q = parseInt(questions, 10);
    const c = parseInt(correct, 10);
    if (isNaN(q) || isNaN(c) || q <= 0 || c < 0 || c > q) {
      alert('Por favor, insira valores válidos.');
      return;
    }
    onSave({
      ...session,
      questions: q,
      correct: c,
      notes: notes,
      errors: q - c,
      accuracy: (c / q) * 100,
    });
  };

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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Sessão</h2>
            <button onClick={onClose} className="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Questões</label>
                <input 
                    type="number"
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value)}
                    className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Acertos</label>
                <input 
                    type="number"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anotações</label>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                />
            </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
                Cancelar
            </button>
            <button 
                onClick={handleSave}
                className="px-4 py-2 bg-primary-medium hover:bg-primary-dark text-white font-bold rounded-lg transition shadow-md"
            >
                Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditSessionModal;
