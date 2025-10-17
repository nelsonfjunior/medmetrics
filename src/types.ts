import type { ReactNode } from 'react';

export interface StudySession {
  id: string;
  subject: string;
  questions: number;
  correct: number;
  errors: number;
  accuracy: number;
  theme?: string;
  date: string;
  notes?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  achieved: boolean;
}

export type Page = 
  'dashboard' | 
  'add-session' | 
  'history' | 
  'my-goal' | 
  'profile' | 
  'reviews' | 
  'planner' | 
  'flashcards' | 
  'focus-zone' | 
  'performance-analysis' | 
  'portfolio' | 
  'study-plan';

export interface Goal {
    name: string;
    date: string;
}

export interface UserProfile {
    name: string;
    email: string;
    studyGoal: string;
    residencyLocation: string;
    cpf?: string;
    startYear?: string;
    graduationYear?: string;
    university?: string;
}

export type PlannerEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink';
export interface PlannerEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    color: PlannerEventColor;
}

export interface Deck {
    id: string;
    name: string;
}

export interface Flashcard {
    id: string;
    deckId: string;
    front: string;
    back: string;
    repetition: number;
    easeFactor: number;
    interval: number;
    dueDate: string; // YYYY-MM-DD
}

export type FocusNoteTag = 'doubt' | 'important' | 'flashcard';

export interface FocusNote {
    timestamp: number;
    text: string;
    tag?: FocusNoteTag;
}

export interface FocusSession {
    id: string;
    date: string;
    subject: string;
    theme: string;
    totalDuration: number; // in seconds
    notes: FocusNote[];
}

export interface PortfolioItem {
    id:string;
    category: string;
    title: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
    fileName: string;
    fileContent?: string;
}


export interface UserData {
    sessions: StudySession[];
    profile: UserProfile;
    goals: Goal[];
    events: PlannerEvent[];
    decks: Deck[];
    flashcards: Flashcard[];
    focusSessions: FocusSession[];
    portfolioItems: PortfolioItem[];
    studyPlanRotation?: { subject: string | null };
    studyPlanProgress?: Record<string, boolean>;
    password: string;
    securityAnswer: string;
}