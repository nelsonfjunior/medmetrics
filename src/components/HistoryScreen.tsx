
import React, { useState } from 'react';
import type { StudySession } from '../types';
import { PencilIcon, TrashIcon } from './icons';
import EditSessionModal from './EditSessionModal';

interface HistoryScreenProps {
  sessions: StudySession[];
  deleteSession: (id: string) => void;
  updateSession: (session: StudySession) => void;
}

const SessionCard: React.FC<{ 
    session: StudySession, 
    onDelete: (id: string) => void,
    onEdit: (session: StudySession) => void,
}> = ({ session, onDelete, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex-grow">
        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(session.date).toLocaleDateString('pt-BR')}</p>
        <p className="font-bold text-lg text-gray-800 dark:text-white">{session.subject}</p>
        {session.theme && <p className="text-sm text-gray-600 dark:text-gray-300">{session.theme}</p>}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 w-full sm:w-auto">
        <div className="flex space-x-4 text-center">
            <div>
                <p className="text-green-500 font-bold text-xl">{session.correct}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Acertos</p>
            </div>
            <div>
                <p className="text-red-500 font-bold text-xl">{session.errors}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Erros</p>
            </div>
            <div>
                <p className="text-primary-medium font-bold text-xl">{session.accuracy.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Taxa</p>
            </div>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button onClick={() => onEdit(session)} className="p-2 text-gray-500 hover:text-primary-medium hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(session.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full transition">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ sessions, deleteSession, updateSession }) => {
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveSession = (updatedSession: StudySession) => {
    updateSession(updatedSession);
    setEditingSession(null);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Histórico / Desempenho</h2>
      
      <div className="space-y-4">
        {sortedSessions.length > 0 ? (
          sortedSessions.map(session => (
            <SessionCard 
                key={session.id} 
                session={session} 
                onDelete={deleteSession}
                onEdit={setEditingSession}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma sessão registrada ainda.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Adicione uma nova sessão para começar!</p>
          </div>
        )}
      </div>

      {editingSession && (
          <EditSessionModal
            session={editingSession}
            onClose={() => setEditingSession(null)}
            onSave={handleSaveSession}
          />
      )}
    </div>
  );
};

export default HistoryScreen;
