
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon, XIcon, LightBulbIcon, BrainIcon } from './icons';
import type { FocusSession, FocusNote, Flashcard, Deck, FocusNoteTag } from '../types';
import { SUBJECTS, SUBJECT_THEMES } from '../constants';

interface FocusZoneProps {
    addFocusSession: (session: Omit<FocusSession, 'id' | 'date'>) => void;
    addFlashcard: (card: Omit<Flashcard, 'id' | 'repetition' | 'easeFactor' | 'interval' | 'dueDate'>) => void;
    decks: Deck[];
    addDeck: (name: string) => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const FocusZoneScreen: React.FC<FocusZoneProps> = ({ addFocusSession, addFlashcard, decks, addDeck }) => {
    const [view, setView] = useState<'setup' | 'active' | 'summary'>('setup');
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [theme, setTheme] = useState(SUBJECT_THEMES[SUBJECTS[0]][0]);
    const [focusDuration, setFocusDuration] = useState(50);
    const [breakDuration, setBreakDuration] = useState(10);
    
    // Active session state
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [notes, setNotes] = useState('');
    const [capturedNotes, setCapturedNotes] = useState<FocusNote[]>([]);
    const [totalSecondsFocused, setTotalSecondsFocused] = useState(0);

    const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTheme(SUBJECT_THEMES[subject][0]);
    }, [subject]);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
                if (mode === 'focus') {
                    setTotalSecondsFocused(prev => prev + 1);
                }
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, mode]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            // Switch modes
            const newMode = mode === 'focus' ? 'break' : 'focus';
            setMode(newMode);
            setTimeLeft((newMode === 'focus' ? focusDuration : breakDuration) * 60);
            // Optionally auto-start next timer
            // setIsActive(true);
        }
    }, [timeLeft, mode, focusDuration, breakDuration]);

    const handleStartSession = () => {
        setTimeLeft(focusDuration * 60);
        setMode('focus');
        setView('active');
        setIsActive(true);
    };

    const handleEndSession = () => {
        setIsActive(false);

        const lines = notes.split('\n');
        const newNotes: FocusNote[] = lines.map(line => {
            const timestamp = totalSecondsFocused;
            let tag: FocusNoteTag | undefined = undefined;
            let text = line;
            if (line.toLowerCase().startsWith('[dúvida]')) {
                tag = 'doubt';
                text = line.substring(9).trim();
            } else if (line.toLowerCase().startsWith('[importante]')) {
                tag = 'important';
                text = line.substring(12).trim();
            } else if (line.toLowerCase().startsWith('[flashcard]')) {
                tag = 'flashcard';
                text = line.substring(12).trim();
            }
            return { timestamp, text, tag };
        }).filter(note => note.text.trim() !== '');
        
        const finalCapturedNotes = [...capturedNotes, ...newNotes];
        setCapturedNotes(finalCapturedNotes);
        setNotes('');

        const finalSession: Omit<FocusSession, 'id' | 'date'> = {
            subject,
            theme,
            totalDuration: totalSecondsFocused,
            notes: finalCapturedNotes,
        };
        
        addFocusSession(finalSession);
        setView('summary');
    };

    const addTag = (tag: string) => {
        const textarea = notesTextareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = `${text.substring(0, start)}\n[${tag}] ${text.substring(end)}`;
        setNotes(newText);
        setTimeout(() => textarea.focus(), 0);
    };

    const resetTimer = () => {
        setIsActive(false);
        const currentModeDuration = (mode === 'focus' ? focusDuration : breakDuration) * 60;
        setTimeLeft(currentModeDuration);
    }
    
    if (view === 'setup') {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Zona de Foco</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">Prepare-se para uma sessão de estudo imersiva e sem distrações.</p>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Matéria</label>
                        <select 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                        >
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Tema específico</label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full p-3 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"
                        >
                            {SUBJECT_THEMES[subject]?.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Tempo de Foco (min)</label>
                            <input type="number" value={focusDuration} onChange={e => setFocusDuration(parseInt(e.target.value, 10))} className="w-full p-3 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Tempo de Descanso (min)</label>
                            <input type="number" value={breakDuration} onChange={e => setBreakDuration(parseInt(e.target.value, 10))} className="w-full p-3 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                        </div>
                    </div>
                    <button onClick={handleStartSession} className="w-full bg-primary-medium hover:bg-primary-dark text-white font-bold py-4 rounded-lg text-lg transition shadow-lg">
                        Iniciar Sessão
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'active') {
        const totalDuration = (mode === 'focus' ? focusDuration : breakDuration) * 60;
        const progress = (totalDuration - timeLeft) / totalDuration * 100;
        return (
            <div className="p-4 md:p-8 h-full flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0 lg:w-1/3 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <p className={`text-xl font-bold mb-4 ${mode === 'focus' ? 'text-primary-medium' : 'text-green-500'}`}>{mode === 'focus' ? 'FOCO' : 'DESCANSO'}</p>
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle 
                                className={mode === 'focus' ? 'text-primary-medium' : 'text-green-500'}
                                strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (progress / 100) * 283} 
                                strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" 
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-gray-800 dark:text-white">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-6">
                        <button onClick={resetTimer} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"><ArrowPathIcon className="w-6 h-6"/></button>
                        <button onClick={() => setIsActive(!isActive)} className="p-4 bg-primary-medium text-white rounded-full shadow-lg">
                            {isActive ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                        </button>
                        <button onClick={handleEndSession} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg">Finalizar</button>
                    </div>
                </div>
                <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Anotações da Sessão</h3>
                     <div className="flex flex-wrap gap-2 mb-4">
                         <button onClick={() => addTag('Dúvida')} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Dúvida</button>
                         <button onClick={() => addTag('Importante')} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">Importante</button>
                         <button onClick={() => addTag('Flashcard')} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Flashcard</button>
                     </div>
                     <textarea
                        ref={notesTextareaRef}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full flex-grow bg-light-gray dark:bg-gray-700 rounded-lg p-4 resize-none"
                        placeholder="Digite suas anotações aqui..."
                    />
                </div>
            </div>
        );
    }
    
    if (view === 'summary') {
        const summarySessionData: Omit<FocusSession, 'id' | 'date'> = {
            subject,
            theme,
            totalDuration: totalSecondsFocused,
            notes: capturedNotes
        };
        return <SummaryView session={summarySessionData} setView={setView} addFlashcard={addFlashcard} decks={decks} addDeck={addDeck} />;
    }

    return null;
};

// --- SUMMARY VIEW ---
interface SummaryViewProps {
    session: Omit<FocusSession, 'id' | 'date'>;
    setView: (view: 'setup') => void;
    addFlashcard: (card: Omit<Flashcard, 'id' | 'repetition' | 'easeFactor' | 'interval' | 'dueDate'>) => void;
    decks: Deck[];
    addDeck: (name: string) => void;
}
const SummaryView: React.FC<SummaryViewProps> = ({ session, setView, addFlashcard, decks, addDeck }) => {
    const [activeTab, setActiveTab] = useState('notes');
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(decks.length > 0 ? decks[0].id : null);
    
    const notesByTag = (tag: FocusNoteTag) => session.notes.filter(n => n.tag === tag);

    const handleCreateFlashcards = () => {
        const flashcardNotes = notesByTag('flashcard');
        if (!selectedDeckId) {
            alert("Por favor, selecione um baralho para adicionar os flashcards.");
            return;
        }
        flashcardNotes.forEach(note => {
            const parts = note.text.split('->');
            if(parts.length >= 2) {
                addFlashcard({
                    deckId: selectedDeckId,
                    front: parts[0].trim(),
                    back: parts.slice(1).join('->').trim()
                });
            }
        });
        alert(`${flashcardNotes.length} flashcards criados com sucesso!`);
    };

    const TabButton: React.FC<{tabName: string; label: string; count: number}> = ({tabName, label, count}) => (
         <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === tabName ? 'bg-primary-medium text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {label} <span className="bg-gray-300 dark:bg-gray-600 text-xs px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    const renderContent = () => {
        let notesToShow: FocusNote[] = [];
        switch(activeTab) {
            case 'doubt': notesToShow = notesByTag('doubt'); break;
            case 'important': notesToShow = notesByTag('important'); break;
            case 'flashcard': notesToShow = notesByTag('flashcard'); break;
            default: notesToShow = session.notes;
        }

        if (notesToShow.length === 0) {
            return <p className="p-4 text-center text-gray-500">Nenhuma anotação nesta categoria.</p>;
        }

        if (activeTab === 'flashcard') {
            return (
                <div className="p-4">
                    <div className="mb-4 p-4 bg-light-gray dark:bg-gray-700 rounded-lg flex items-center gap-4">
                        <label className="font-semibold text-gray-700 dark:text-gray-200">Adicionar ao Baralho:</label>
                        <select value={selectedDeckId || ''} onChange={e => setSelectedDeckId(e.target.value)} className="p-2 rounded-md bg-white dark:bg-gray-600">
                            {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <button onClick={handleCreateFlashcards} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">Criar Flashcards</button>
                    </div>
                     <ul className="space-y-2">
                        {notesToShow.map((note, i) => (
                             <li key={i} className="p-3 bg-light-gray dark:bg-gray-700 rounded-md text-sm">{note.text}</li>
                        ))}
                    </ul>
                </div>
            )
        }
        
        return (
            <ul className="p-4 space-y-2">
                {notesToShow.map((note, i) => (
                    <li key={i} className="p-3 bg-light-gray dark:bg-gray-700 rounded-md text-sm">{note.text}</li>
                ))}
            </ul>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Resumo da Sessão</h2>
                        <p className="text-sm text-gray-500">{session.subject}{session.theme ? ` - ${session.theme}` : ''} - {formatTime(session.totalDuration)} Focados</p>
                    </div>
                    <button onClick={() => setView('setup')} className="p-1"><XIcon className="w-6 h-6"/></button>
                </div>
                <div className="p-4 flex flex-wrap gap-2 border-b dark:border-gray-700">
                    <TabButton tabName="notes" label="Todas" count={session.notes.length} />
                    <TabButton tabName="important" label="Importantes" count={notesByTag('important').length} />
                    <TabButton tabName="doubt" label="Dúvidas" count={notesByTag('doubt').length} />
                    <TabButton tabName="flashcard" label="Flashcards" count={notesByTag('flashcard').length} />
                </div>
                <div className="flex-grow overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default FocusZoneScreen;
