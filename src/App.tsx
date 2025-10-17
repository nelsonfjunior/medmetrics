import React, { useState, useMemo, useEffect } from 'react';
import type { Page, StudySession, Badge, UserData, UserProfile, Goal, PlannerEvent, Deck, Flashcard, FocusSession, PortfolioItem } from './types';
import { TrophyIcon, MenuIcon } from './components/icons';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddSessionScreen from './components/AddSessionScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import MyGoalScreen from './components/MyGoalScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import FocusAlert from './components/FocusAlert';
import ReviewsScreen from './components/ReviewsScreen';
import PlannerScreen from './components/PlannerScreen';
import FlashcardsScreen from './components/FlashcardsScreen';
import FocusZoneScreen from './components/FocusZoneScreen';
import PerformanceAnalysisScreen from './components/PerformanceAnalysisScreen';
import PortfolioScreen from './components/PortfolioScreen';
import StudyPlanScreen from './components/StudyPlanScreen';

const REMEMBER_ME_KEY = 'medmetrics-remembered-user';



const App: React.FC = () => {
  console.log('🎬 App component renderizando...');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debug: Log do estado de autenticação
  useEffect(() => {
    console.log('🔍 Estado de autenticação:', { isAuthenticated, currentUser, authView });
  }, [isAuthenticated, currentUser, authView]);

  // Forçar estado inicial correto
  useEffect(() => {
    console.log('🚀 Inicializando app - forçando estado não autenticado');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthView('login');
  }, []);

  // Limpar dados antigos do localStorage na inicialização
  useEffect(() => {
    // Limpar dados antigos do localStorage
    localStorage.removeItem('medmetrics-app-data-reset');
    localStorage.removeItem('medmetrics-remembered-user');
    localStorage.removeItem('auth_token');
    console.log('Dados antigos do localStorage removidos');
  }, []); // Run only once on initial mount

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showFocusAlert, setShowFocusAlert] = useState(false);
  const [prefilledSession, setPrefilledSession] = useState<{ subject: string; theme: string } | null>(null);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    console.log('🔐 handleLogin chamado com:', { email, password: password ? '***' : 'VAZIO', rememberMe });

    // Validação rigorosa
    if (!email || email.trim() === '') {
      console.log('❌ Email vazio - bloqueando login');
      alert("Por favor, insira um e-mail.");
      return;
    }

    if (!password || password.trim() === '') {
      console.log('❌ Senha vazia - bloqueando login');
      alert("Por favor, insira uma senha.");
      return;
    }

    if (!email.includes('@')) {
      console.log('❌ Email inválido - bloqueando login');
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    console.log('✅ Validações passaram - tentando fazer login com:', { email, hasPassword: !!password });

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();

        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, email);
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
        }

        // Salvar token para futuras requisições
        localStorage.setItem('auth_token', token);

        setCurrentUser(email);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro no login.");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  const handleRegister = async (name: string, email: string, password: string, securityAnswer: string) => {
    if (securityAnswer.trim().length < 3) {
      alert('A resposta de segurança deve ter pelo menos 3 caracteres.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          gender: 'other' // Default gender
        }),
      });

      if (response.ok) {
        const { token } = await response.json();

        // Salvar token para futuras requisições
        localStorage.setItem('auth_token', token);

        setCurrentUser(email);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro no cadastro.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  const handleResetPassword = async () => {
    try {
      // Por enquanto, vamos apenas mostrar uma mensagem
      // Em uma implementação completa, você criaria um endpoint para reset de senha
      alert("Funcionalidade de reset de senha será implementada em breve. Entre em contato com o suporte.");
      setAuthView('login');
    } catch (error) {
      console.error('Reset password error:', error);
      alert("Erro ao resetar senha. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem('auth_token');
  };

  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);

  // Carregar dados do usuário do Supabase
  const loadUserData = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUserData(userData);
      } else {
        console.error('Erro ao carregar dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Carregar dados quando o usuário faz login
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      loadUserData();
    }
  }, [currentUser, isAuthenticated]);

  const updateCurrentUserData = async (updater: (currentData: UserData) => Partial<UserData>) => {
    if (!currentUser || !currentUserData) return;

    try {
      const updates = updater(currentUserData);
      const token = localStorage.getItem('auth_token');

      const response = await fetch('http://localhost:3001/api/data', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Recarregar dados após atualização
        await loadUserData();
      } else {
        console.error('Erro ao atualizar dados');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  const addSession = async (session: Omit<StudySession, 'id' | 'errors' | 'accuracy' | 'date'>) => {
    const newSession: StudySession = {
      ...session,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
      errors: session.questions - session.correct,
      accuracy: (session.correct / session.questions) * 100,
    };
    if (newSession.accuracy < 60) setShowFocusAlert(true);

    await updateCurrentUserData(data => ({
      sessions: [...(data.sessions || []), newSession]
    }));
    setCurrentPage('history');
  };

  const updateSession = async (updatedSession: StudySession) => {
    await updateCurrentUserData(data => ({
      sessions: (data.sessions || []).map(s => s.id === updatedSession.id ? updatedSession : s)
    }));
  };

  const deleteSession = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta sessão?")) {
      await updateCurrentUserData(data => ({
        sessions: (data.sessions || []).filter(s => s.id !== id)
      }));
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    await updateCurrentUserData(data => ({
      profile: { ...data.profile, ...profileData }
    }));
  };

  const setGoals = async (goals: Goal[]) => {
    await updateCurrentUserData(() => ({ goals }));
  };

  // Planner Handlers
  const addEvent = async (event: Omit<PlannerEvent, 'id'>) => {
    const newEvent = { ...event, id: new Date().toISOString() };
    await updateCurrentUserData(data => ({
      events: [...(data.events || []), newEvent]
    }));
  };
  const updateEvent = async (updatedEvent: PlannerEvent) => {
    await updateCurrentUserData(data => ({
      events: (data.events || []).map(e => e.id === updatedEvent.id ? updatedEvent : e)
    }));
  };
  const deleteEvent = async (id: string) => {
    await updateCurrentUserData(data => ({
      events: (data.events || []).filter(e => e.id !== id)
    }));
  };

  // Flashcards Handlers
  const addDeck = async (name: string) => {
    const newDeck = { id: new Date().toISOString(), name };
    await updateCurrentUserData(data => ({
      decks: [...(data.decks || []), newDeck]
    }));
  };
  const updateDeck = async (updatedDeck: Deck) => {
    await updateCurrentUserData(data => ({
      decks: (data.decks || []).map(d => d.id === updatedDeck.id ? updatedDeck : d)
    }));
  };
  const deleteDeck = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este baralho e todos os seus cartões?")) {
      await updateCurrentUserData(data => ({
        decks: (data.decks || []).filter(d => d.id !== id),
        flashcards: (data.flashcards || []).filter(c => c.deckId !== id)
      }));
    }
  };
  const addFlashcard = async (cardData: Omit<Flashcard, 'id' | 'repetition' | 'easeFactor' | 'interval' | 'dueDate'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: new Date().toISOString(),
      repetition: 0,
      easeFactor: 2.5,
      interval: 0,
      dueDate: new Date().toISOString().split('T')[0]
    };
    await updateCurrentUserData(data => ({
      flashcards: [...(data.flashcards || []), newCard]
    }));
  };
  const updateFlashcard = async (updatedCard: Flashcard) => {
    await updateCurrentUserData(data => ({
      flashcards: (data.flashcards || []).map(c => c.id === updatedCard.id ? updatedCard : c)
    }));
  };
  const deleteFlashcard = async (id: string) => {
    await updateCurrentUserData(data => ({
      flashcards: (data.flashcards || []).filter(c => c.id !== id)
    }));
  };
  const updateFlashcardSrs = async (card: Flashcard, quality: number) => {
    let { repetition, easeFactor, interval } = card;
    if (quality >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    } else {
      repetition = 0;
      interval = 1;
    }
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    await updateFlashcard({ ...card, repetition, easeFactor, interval, dueDate: dueDate.toISOString().split('T')[0] });
  };

  // Focus Zone Handler
  const addFocusSession = async (session: Omit<FocusSession, 'id' | 'date'>) => {
    const newSession = { ...session, id: new Date().toISOString(), date: new Date().toISOString() };
    await updateCurrentUserData(data => ({
      focusSessions: [...(data.focusSessions || []), newSession]
    }));
  };

  // Portfolio Handlers
  const addPortfolioItem = async (item: Omit<PortfolioItem, 'id'>) => {
    const newItem = { ...item, id: new Date().toISOString() };
    await updateCurrentUserData(data => ({
      portfolioItems: [...(data.portfolioItems || []), newItem]
    }));
  };
  const updatePortfolioItem = async (updatedItem: PortfolioItem) => {
    await updateCurrentUserData(data => ({
      portfolioItems: (data.portfolioItems || []).map(i => i.id === updatedItem.id ? updatedItem : i)
    }));
  };
  const deletePortfolioItem = async (id: string) => {
    await updateCurrentUserData(data => ({
      portfolioItems: (data.portfolioItems || []).filter(i => i.id !== id)
    }));
  };

  const badges: Badge[] = useMemo(() => {
    const sessions = currentUserData?.sessions || [];
    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce((sum, s) => sum + s.questions, 0);
    const surgerySessions = sessions.filter(s => s.subject === 'Cirurgia Geral');
    const surgeryAccuracy = surgerySessions.length > 0
      ? surgerySessions.reduce((sum, s) => sum + s.correct, 0) / surgerySessions.reduce((sum, s) => sum + s.questions, 0) * 100
      : 0;
    return [
      { id: '1', title: 'Primeira Sessão!', description: 'Concluiu sua primeira sessão de estudos.', icon: <TrophyIcon className="w-6 h-6 text-white" />, achieved: totalSessions >= 1 },
      { id: '2', title: 'Rumo aos 1000', description: 'Completou 1000 questões.', icon: <TrophyIcon className="w-6 h-6 text-white" />, achieved: totalQuestions >= 1000 },
      { id: '3', title: 'Maratonista', description: 'Completou 10 sessões de estudo.', icon: <TrophyIcon className="w-6 h-6 text-white" />, achieved: totalSessions >= 10 },
      { id: '4', title: 'Cirurgião Jr.', description: 'Atingiu 90% em Cirurgia Geral.', icon: <TrophyIcon className="w-6 h-6 text-white" />, achieved: surgeryAccuracy >= 90 },
    ];
  }, [currentUserData?.sessions]);

  const renderPage = () => {
    if (!currentUserData) return <div className="p-8 text-center">Carregando dados...</div>;
    const sessions = currentUserData.sessions || [];
    switch (currentPage) {
      case 'dashboard': return <Dashboard sessions={sessions} badges={badges} />;
      case 'add-session': return <AddSessionScreen addSession={addSession} prefilledSession={prefilledSession} clearPrefilledSession={() => setPrefilledSession(null)} />;
      case 'history': return <HistoryScreen sessions={sessions} deleteSession={deleteSession} updateSession={updateSession} />;
      case 'my-goal': return <MyGoalScreen goals={currentUserData.goals || []} setGoals={setGoals} />;
      case 'profile': return <ProfileScreen onLogout={handleLogout} profile={currentUserData.profile} updateProfile={updateProfile} />;
      case 'reviews': return <ReviewsScreen sessions={sessions} setCurrentPage={setCurrentPage} />;
      case 'planner': return <PlannerScreen events={currentUserData.events || []} addEvent={addEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} />;
      case 'flashcards': return <FlashcardsScreen decks={currentUserData.decks || []} flashcards={currentUserData.flashcards || []} addDeck={addDeck} updateDeck={updateDeck} deleteDeck={deleteDeck} addFlashcard={addFlashcard} updateFlashcard={updateFlashcard} deleteFlashcard={deleteFlashcard} updateFlashcardSrs={updateFlashcardSrs} />;
      case 'focus-zone': return <FocusZoneScreen addFocusSession={addFocusSession} addFlashcard={addFlashcard} decks={currentUserData.decks || []} addDeck={addDeck} />;
      case 'performance-analysis': return <PerformanceAnalysisScreen sessions={sessions} />;
      case 'portfolio': return <PortfolioScreen items={currentUserData.portfolioItems || []} addItem={addPortfolioItem} updateItem={updatePortfolioItem} deleteItem={deletePortfolioItem} profile={currentUserData.profile} updateProfile={updateProfile} />;
      case 'study-plan': return <StudyPlanScreen userData={currentUserData} updateUserData={updateCurrentUserData} setCurrentPage={setCurrentPage} setPrefilledSession={setPrefilledSession} />;
      default: return <Dashboard sessions={sessions} badges={badges} />;
    }
  };

  // Renderizar tela de autenticação se não estiver logado
  if (!isAuthenticated) {
    console.log('🔐 Usuário NÃO autenticado - renderizando tela de login');
    if (authView === 'login') {
      console.log('📱 Renderizando LoginScreen');
      return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setAuthView('register')} onNavigateToForgotPassword={() => setAuthView('forgot-password')} />;
    }
    if (authView === 'register') {
      console.log('📱 Renderizando RegisterScreen');
      return <RegisterScreen onRegister={handleRegister} onNavigateToLogin={() => setAuthView('login')} />;
    }
    if (authView === 'forgot-password') {
      console.log('📱 Renderizando ForgotPasswordScreen');
      return <ForgotPasswordScreen allUsersData={{}} onResetPassword={handleResetPassword} onNavigateToLogin={() => setAuthView('login')} />;
    }
  }

  // Renderizar app principal se estiver autenticado
  console.log('🏠 Usuário autenticado - renderizando app principal');
  return (
    <div className="flex h-screen bg-light-gray dark:bg-gray-900 font-sans">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-light-gray/80 dark:bg-gray-900/80 backdrop-blur-sm z-20 p-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-gray-600 dark:text-gray-300"
            aria-label="Abrir menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>
        {renderPage()}
      </main>
      {showFocusAlert && <FocusAlert onClose={() => setShowFocusAlert(false)} />}
    </div>
  );
};

export default App;