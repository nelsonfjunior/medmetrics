
import React, { useState, useMemo } from 'react';
import type { Deck, Flashcard } from '../types';
import { BrainIcon, PencilIcon, PlusCircleIcon, TrashIcon, XIcon } from './icons';

// --- PROPS ---
interface FlashcardsScreenProps {
    decks: Deck[];
    flashcards: Flashcard[];
    addDeck: (name: string) => void;
    updateDeck: (deck: Deck) => void;
    deleteDeck: (id: string) => void;
    addFlashcard: (card: Omit<Flashcard, 'id' | 'repetition' | 'easeFactor' | 'interval' | 'dueDate'>) => void;
    updateFlashcard: (card: Flashcard) => void;
    deleteFlashcard: (id: string) => void;
    updateFlashcardSrs: (card: Flashcard, quality: number) => void;
}

// --- MAIN COMPONENT ---
const FlashcardsScreen: React.FC<FlashcardsScreenProps> = (props) => {
    const [view, setView] = useState<'decks' | 'review'>('decks');
    const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);

    const handleStartReview = (deck: Deck) => {
        setCurrentDeck(deck);
        setView('review');
    };

    if (view === 'review' && currentDeck) {
        return (
            <ReviewSession 
                deck={currentDeck}
                cards={props.flashcards.filter(c => c.deckId === currentDeck.id)}
                updateFlashcardSrs={props.updateFlashcardSrs}
                onFinish={() => setView('decks')}
            />
        );
    }
    
    return <DecksList {...props} onStartReview={handleStartReview} />;
};

// --- DECKS LIST VIEW ---
interface DecksListProps extends Omit<FlashcardsScreenProps, 'updateFlashcardSrs'> {
    onStartReview: (deck: Deck) => void;
}

const DecksList: React.FC<DecksListProps> = ({ decks, flashcards, onStartReview, ...rest }) => {
    const [isDeckModalOpen, setDeckModalOpen] = useState(false);
    const [isCardModalOpen, setCardModalOpen] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

    const cardsByDeck = useMemo(() => {
        return flashcards.reduce((acc, card) => {
            (acc[card.deckId] = acc[card.deckId] || []).push(card);
            return acc;
        }, {} as Record<string, Flashcard[]>);
    }, [flashcards]);

    const today = new Date().toISOString().split('T')[0];

    const handleManageDeck = (deck: Deck) => {
        setSelectedDeck(deck);
    };

    const handleAddCard = (deck: Deck) => {
        setSelectedDeck(deck);
        setEditingCard(null);
        setCardModalOpen(true);
    }
    
    const handleEditCard = (card: Flashcard) => {
        setSelectedDeck(decks.find(d => d.id === card.deckId) || null);
        setEditingCard(card);
        setCardModalOpen(true);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Flashcards (SRS)</h2>
                <button 
                    onClick={() => { setSelectedDeck(null); setDeckModalOpen(true); }}
                    className="flex items-center bg-primary-medium hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition shadow-md"
                >
                    <PlusCircleIcon className="w-6 h-6 mr-2" />
                    Novo Baralho
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map(deck => {
                    const deckCards = cardsByDeck[deck.id] || [];
                    const dueCards = deckCards.filter(c => c.dueDate <= today).length;
                    return (
                        <div key={deck.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{deck.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{deckCards.length} cartão(ões)</p>
                                <p className={`font-semibold mt-2 ${dueCards > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {dueCards > 0 ? `${dueCards} para revisar hoje` : 'Tudo em dia!'}
                                </p>
                            </div>
                            <div className="mt-6 flex flex-col space-y-2">
                                <button
                                    onClick={() => onStartReview(deck)}
                                    disabled={dueCards === 0}
                                    className="w-full bg-primary-medium text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                                >
                                    Estudar
                                </button>
                                <button
                                    onClick={() => handleManageDeck(deck)}
                                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Gerenciar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {selectedDeck && !isCardModalOpen && (
                 <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedDeck.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{(cardsByDeck[selectedDeck.id] || []).length} cartões</p>
                        </div>
                         <button onClick={() => setSelectedDeck(null)} className="p-1"><XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button onClick={() => { setDeckModalOpen(true) }} className="flex-1 bg-blue-100 text-blue-800 font-semibold py-2 px-3 rounded-lg">Editar Nome</button>
                        <button onClick={() => handleAddCard(selectedDeck)} className="flex-1 bg-green-100 text-green-800 font-semibold py-2 px-3 rounded-lg">Adicionar Cartão</button>
                        <button onClick={() => rest.deleteDeck(selectedDeck.id)} className="flex-1 bg-red-100 text-red-800 font-semibold py-2 px-3 rounded-lg">Excluir Baralho</button>
                    </div>
                     <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2">
                        {(cardsByDeck[selectedDeck.id] || []).map(card => (
                            <div key={card.id} className="bg-light-gray dark:bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
                                <p className="text-sm text-gray-700 dark:text-gray-200 truncate pr-4">{card.front}</p>
                                <div className="flex-shrink-0">
                                    <button onClick={() => handleEditCard(card)} className="p-1 text-gray-500 hover:text-blue-500"><PencilIcon className="w-4 h-4"/></button>
                                    <button onClick={() => rest.deleteFlashcard(card.id)} className="p-1 text-gray-500 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>
            )}

            {isDeckModalOpen && (
                <EditDeckModal 
                    deck={selectedDeck}
                    onClose={() => setDeckModalOpen(false)}
                    onSave={(name) => {
                        if(selectedDeck) {
                            rest.updateDeck({ ...selectedDeck, name });
                        } else {
                            rest.addDeck(name);
                        }
                        setDeckModalOpen(false);
                        setSelectedDeck(null);
                    }}
                />
            )}
            
            {isCardModalOpen && selectedDeck && (
                <EditCardModal
                    deckId={selectedDeck.id}
                    card={editingCard}
                    onClose={() => setCardModalOpen(false)}
                    onSave={(cardData) => {
                        if(editingCard) {
                            rest.updateFlashcard({ ...editingCard, ...cardData });
                        } else {
                            rest.addFlashcard({ deckId: selectedDeck.id, ...cardData });
                        }
                        setCardModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};


// --- REVIEW SESSION VIEW ---
interface ReviewSessionProps {
    deck: Deck;
    cards: Flashcard[];
    updateFlashcardSrs: (card: Flashcard, quality: number) => void;
    onFinish: () => void;
}
const ReviewSession: React.FC<ReviewSessionProps> = ({ deck, cards, updateFlashcardSrs, onFinish }) => {
    const today = new Date().toISOString().split('T')[0];
    const dueCards = useMemo(() => cards.filter(c => c.dueDate <= today), [cards, today]);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setFlipped] = useState(false);
    
    if (dueCards.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Sessão Concluída!</h2>
                <p className="text-gray-600 dark:text-gray-300">Você revisou todos os cartões deste baralho por hoje.</p>
                <button onClick={onFinish} className="mt-6 bg-primary-medium text-white font-bold py-2 px-6 rounded-lg">Voltar</button>
            </div>
        );
    }
    
    const card = dueCards[currentIndex];

    const handleAnswer = (quality: number) => {
        updateFlashcardSrs(card, quality);
        setFlipped(false);
        if (currentIndex < dueCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Last card, end session
            onFinish();
        }
    };
    
    return (
        <div className="p-4 md:p-8 flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-2xl">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{deck.name}</h2>
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">{currentIndex + 1} / {dueCards.length}</span>
                </div>
                <div 
                    className="relative w-full h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex items-center justify-center text-center cursor-pointer"
                    onClick={() => setFlipped(!isFlipped)}
                >
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {isFlipped ? card.back : card.front}
                    </p>
                </div>

                {isFlipped ? (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button onClick={() => handleAnswer(0)} className="p-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition">Errei</button>
                        <button onClick={() => handleAnswer(3)} className="p-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition">Difícil</button>
                        <button onClick={() => handleAnswer(4)} className="p-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">Bom</button>
                        <button onClick={() => handleAnswer(5)} className="p-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition">Fácil</button>
                    </div>
                ) : (
                    <button onClick={() => setFlipped(true)} className="mt-6 w-full p-4 bg-primary-medium text-white font-bold rounded-lg hover:bg-primary-dark transition">
                        Mostrar Resposta
                    </button>
                )}
                 <button onClick={onFinish} className="mt-4 w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    Sair da sessão
                </button>
            </div>
        </div>
    );
};


// --- MODALS ---
const Modal: React.FC<{onClose: () => void, title: string, children: React.ReactNode}> = ({onClose, title, children}) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-lg w-full transform transition-all animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
                <button onClick={onClose} className="p-1"><XIcon className="w-6 h-6"/></button>
            </div>
            {children}
        </div>
    </div>
)

interface EditDeckModalProps {
    deck: Deck | null;
    onClose: () => void;
    onSave: (name: string) => void;
}
const EditDeckModal: React.FC<EditDeckModalProps> = ({ deck, onClose, onSave }) => {
    const [name, setName] = useState(deck?.name || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim()) onSave(name.trim());
    };

    return (
        <Modal onClose={onClose} title={deck ? 'Editar Baralho' : 'Novo Baralho'}>
            <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Baralho</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
                    required
                />
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-primary-medium text-white font-bold rounded-lg">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};

interface EditCardModalProps {
    deckId: string;
    card: Flashcard | null;
    onClose: () => void;
    onSave: (data: { front: string, back: string }) => void;
}
const EditCardModal: React.FC<EditCardModalProps> = ({ card, onClose, onSave }) => {
    const [front, setFront] = useState(card?.front || '');
    const [back, setBack] = useState(card?.back || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (front.trim() && back.trim()) {
            onSave({ front: front.trim(), back: back.trim() });
        }
    };
    
    return (
        <Modal onClose={onClose} title={card ? 'Editar Cartão' : 'Novo Cartão'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frente (Pergunta)</label>
                    <textarea value={front} onChange={(e) => setFront(e.target.value)} rows={4} className="w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verso (Resposta)</label>
                    <textarea value={back} onChange={(e) => setBack(e.target.value)} rows={4} className="w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg" required />
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-primary-medium text-white font-bold rounded-lg">Salvar Cartão</button>
                </div>
            </form>
        </Modal>
    );
};


export default FlashcardsScreen;
