import React from 'react';
import type { Page } from '../types';
import { 
    ChartBarIcon, PlusCircleIcon, ClockIcon, UserCircleIcon, AcademicCapIcon,
    BellIcon, CalendarIcon, BrainIcon, PlayIcon, BriefcaseIcon, XIcon
} from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-2 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${isActive ? 'bg-primary-medium' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`p-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
        <span className={`${isActive ? 'text-white' : 'text-primary-medium'}`}>{icon}</span>
      </div>
      <span className={`ml-3 font-semibold ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 p-4 flex flex-col h-full shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out z-40 w-72 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   md:relative md:translate-x-0 md:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-primary-dark p-2 rounded-lg">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold ml-3 text-gray-800 dark:text-white">MedMetrics</h1>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full md:hidden">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-grow">
            <ul>
                <NavItem icon={<ChartBarIcon className="w-5 h-5" />} label="Dashboard" isActive={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
                <NavItem icon={<AcademicCapIcon className="w-5 h-5" />} label="Plano de Estudos" isActive={currentPage === 'study-plan'} onClick={() => setCurrentPage('study-plan')} />
                <NavItem icon={<PlusCircleIcon className="w-5 h-5" />} label="Adicionar Sessão" isActive={currentPage === 'add-session'} onClick={() => setCurrentPage('add-session')} />
                <NavItem icon={<PlayIcon className="w-5 h-5" />} label="Zona de Foco" isActive={currentPage === 'focus-zone'} onClick={() => setCurrentPage('focus-zone')} />
                <NavItem icon={<ClockIcon className="w-5 h-5" />} label="Histórico" isActive={currentPage === 'history'} onClick={() => setCurrentPage('history')} />
                <NavItem icon={<ChartBarIcon className="w-5 h-5" />} label="Análise de Desempenho" isActive={currentPage === 'performance-analysis'} onClick={() => setCurrentPage('performance-analysis')} />
                <NavItem icon={<BellIcon className="w-5 h-5" />} label="Revisões" isActive={currentPage === 'reviews'} onClick={() => setCurrentPage('reviews')} />
                <NavItem icon={<CalendarIcon className="w-5 h-5" />} label="Planner" isActive={currentPage === 'planner'} onClick={() => setCurrentPage('planner')} />
                <NavItem icon={<BrainIcon className="w-5 h-5" />} label="FlashCards" isActive={currentPage === 'flashcards'} onClick={() => setCurrentPage('flashcards')} />
                <NavItem icon={<AcademicCapIcon className="w-5 h-5" />} label="Minha Meta" isActive={currentPage === 'my-goal'} onClick={() => setCurrentPage('my-goal')} />
                <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Portfólio" isActive={currentPage === 'portfolio'} onClick={() => setCurrentPage('portfolio')} />
            </ul>
        </nav>
        <div className="mt-auto">
            <ul>
                <NavItem icon={<UserCircleIcon className="w-5 h-5" />} label="Perfil" isActive={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} />
            </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;