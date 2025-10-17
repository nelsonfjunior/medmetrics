import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { SUBJECTS, SUBJECT_THEMES } from '../constants';
import { BrainIcon, CheckCircleIcon, XCircleIcon } from './icons';
import type { StudySession } from '../types';

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

interface AIQuizScreenProps {
    addSession: (session: Omit<StudySession, 'id' | 'errors' | 'accuracy' | 'date'>) => void;
}

const AIQuizScreen: React.FC<AIQuizScreenProps> = ({ addSession }) => {
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [theme, setTheme] = useState(SUBJECT_THEMES[SUBJECTS[0]][0]);
    const [numQuestions, setNumQuestions] = useState(5);
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateQuiz = async () => {
        if (!process.env.API_KEY) {
            setError("A chave da API do Google Gemini não está configurada. Esta funcionalidade está desativada.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        setQuiz([]);
        
        const prompt = `Gere um quiz com ${numQuestions} questões de múltipla escolha sobre o tema "${theme}" da matéria de "${subject}". Para cada questão, forneça 4 opções, a resposta correta e uma breve explicação para a resposta.`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            questions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        answer: { type: Type.STRING },
                                        explanation: { type: Type.STRING }
                                    },
                                    required: ["question", "options", "answer", "explanation"]
                                }
                            }
                        }
                    }
                }
            });
            
            const text = response.text;
            const parsedQuiz = JSON.parse(text);

            if (parsedQuiz.questions && parsedQuiz.questions.length > 0) {
                setQuiz(parsedQuiz.questions);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setShowResults(false);
            } else {
                throw new Error("Formato de quiz inválido recebido da IA.");
            }

        } catch (e) {
            console.error("Erro ao gerar quiz:", e);
            setError("Não foi possível gerar o quiz. A IA pode estar sobrecarregada ou a configuração pode estar incorreta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (option: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = option;
        setUserAnswers(newAnswers);

        setTimeout(() => {
            if (currentQuestionIndex < quiz.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setShowResults(true);
            }
        }, 500);
    };
    
    const resetQuiz = () => {
        setQuiz([]);
        setShowResults(false);
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full">
                <BrainIcon className="w-16 h-16 text-primary-medium animate-pulse" />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Gerando seu quiz personalizado...</p>
            </div>
        )
    }

    if (error) {
         return (
            <div className="p-8 text-center">
                <p className="text-red-500 font-semibold">{error}</p>
                <button onClick={generateQuiz} className="mt-4 bg-primary-medium text-white font-bold py-2 px-6 rounded-lg">Tentar Novamente</button>
            </div>
        )
    }

    if (showResults) {
        const score = userAnswers.reduce((sum, answer, index) => {
            return answer === quiz[index].answer ? sum + 1 : sum;
        }, 0);

        const handleSaveSession = () => {
            addSession({
                subject: subject,
                theme: theme,
                questions: quiz.length,
                correct: score,
                notes: 'Sessão de quiz gerada por IA.'
            });
            alert('Sessão salva com sucesso no seu histórico!');
            resetQuiz();
        };

        return (
            <div className="p-8 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Resultados do Quiz</h2>
                <p className="text-center text-xl mb-8">Você acertou {score} de {quiz.length} questões!</p>
                <div className="space-y-6">
                    {quiz.map((q, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <p className={`mt-2 ${userAnswers[index] === q.answer ? 'text-green-500' : 'text-red-500'}`}>
                                Sua resposta: {userAnswers[index]} {userAnswers[index] === q.answer ? <CheckCircleIcon className="inline w-5 h-5 ml-1"/> : <XCircleIcon className="inline w-5 h-5 ml-1"/>}
                            </p>
                            {userAnswers[index] !== q.answer && <p className="mt-1 text-green-600">Resposta correta: {q.answer}</p>}
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><strong>Explicação:</strong> {q.explanation}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8 flex justify-center items-center gap-4">
                     <button onClick={resetQuiz} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition">Fazer Novo Quiz</button>
                     <button onClick={handleSaveSession} className="bg-primary-medium hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition">Salvar Sessão</button>
                </div>
            </div>
        );
    }
    
    if (quiz.length > 0) {
        const currentQuestion = quiz[currentQuestionIndex];
        return (
             <div className="p-8 flex flex-col items-center justify-center h-full">
                <div className="w-full max-w-2xl">
                    <p className="text-sm text-gray-500">Questão {currentQuestionIndex + 1} de {quiz.length}</p>
                    <h2 className="text-2xl font-bold my-4">{currentQuestion.question}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, i) => (
                            <button 
                                key={i}
                                onClick={() => handleAnswer(option)}
                                className="p-4 bg-white dark:bg-gray-800 text-left rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quiz com IA</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Teste seus conhecimentos com um quiz gerado sob medida pela IA.</p>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
                 <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Matéria</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 bg-light-gray dark:bg-gray-700 rounded-lg">
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Tema</label>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-3 bg-light-gray dark:bg-gray-700 rounded-lg">
                        {SUBJECT_THEMES[subject]?.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Número de Questões</label>
                    <input type="number" value={numQuestions} onChange={e => setNumQuestions(parseInt(e.target.value, 10))} className="w-full p-3 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                </div>
                <button onClick={generateQuiz} className="w-full bg-primary-medium hover:bg-primary-dark text-white font-bold py-4 rounded-lg text-lg transition shadow-lg">
                    Gerar Quiz
                </button>
            </div>
        </div>
    );
};

export default AIQuizScreen;