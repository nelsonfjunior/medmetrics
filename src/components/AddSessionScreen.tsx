
import React, { useState, useEffect } from 'react';
import type { StudySession } from '../types';
import { SUBJECTS, SUBJECT_THEMES } from '../constants';
import { CheckCircleIcon } from './icons';

interface AddSessionScreenProps {
  addSession: (session: Omit<StudySession, 'id' | 'errors' | 'accuracy' | 'date'>) => void;
  prefilledSession: { subject: string; theme: string } | null;
  clearPrefilledSession: () => void;
}

const AddSessionScreen: React.FC<AddSessionScreenProps> = ({ addSession, prefilledSession, clearPrefilledSession }) => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [questions, setQuestions] = useState('');
  const [correct, setCorrect] = useState('');
  const [theme, setTheme] = useState(SUBJECT_THEMES[subject][0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (prefilledSession) {
      setSubject(prefilledSession.subject);
      setTheme(prefilledSession.theme);
      clearPrefilledSession(); // Clear after using it
    }
  }, [prefilledSession, clearPrefilledSession]);

  useEffect(() => {
    const q = parseInt(questions, 10);
    const c = parseInt(correct, 10);
    if (!isNaN(q) && !isNaN(c) && q >= c) {
      setErrors(q - c);
    } else {
      setErrors(0);
    }
  }, [questions, correct]);

  useEffect(() => {
    // Prevent setting theme if it was pre-filled
    if (!prefilledSession || subject !== prefilledSession.subject) {
      setTheme(SUBJECT_THEMES[subject][0]);
    }
  }, [subject, prefilledSession]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseInt(questions, 10);
    const c = parseInt(correct, 10);
    if (!subject || isNaN(q) || isNaN(c) || q <= 0 || c < 0 || c > q) {
      alert('Por favor, preencha os campos corretamente.');
      return;
    }
    addSession({
      subject,
      questions: q,
      correct: c,
      theme,
      notes,
    });
    setSubject(SUBJECTS[0]);
    setQuestions('');
    setCorrect('');
    setNotes('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Adicionar Sessão de Estudo</h2>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Matéria</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Questões</label>
            <input 
              type="number" 
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Acertos</label>
            <input 
              type="number"
              value={correct}
              onChange={(e) => setCorrect(e.target.value)} 
              className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Erros</label>
            <input 
              type="number" 
              readOnly 
              value={errors}
              className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg border-2 border-transparent cursor-not-allowed"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Tema específico</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
          >
            {SUBJECT_THEMES[subject]?.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Anotações (Opcional)</label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Anote os principais erros, conceitos importantes ou dúvidas..."
                className="w-full px-4 py-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
            />
        </div>

        <button 
          type="submit"
          className="w-full mt-2 bg-primary-medium hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Salvar Resultados
        </button>
      </form>

      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-success text-white py-3 px-6 rounded-lg shadow-xl flex items-center animate-bounce">
          <CheckCircleIcon className="w-6 h-6 mr-3" />
          <span>Sessão registrada com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default AddSessionScreen;
