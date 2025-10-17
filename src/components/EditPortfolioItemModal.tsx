
import React, { useState, useEffect } from 'react';
import type { PortfolioItem } from '../types';
import { PORTFOLIO_CATEGORIES } from '../constants';
import { XIcon } from './icons';

interface EditPortfolioItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<PortfolioItem, 'id'>) => void;
    itemToEdit?: PortfolioItem;
}

const EditPortfolioItemModal: React.FC<EditPortfolioItemModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const [category, setCategory] = useState(PORTFOLIO_CATEGORIES[0]);
    const [title, setTitle] = useState('');
    const [institution, setInstitution] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (itemToEdit) {
            setCategory(itemToEdit.category);
            setTitle(itemToEdit.title);
            setInstitution(itemToEdit.institution);
            setStartDate(itemToEdit.startDate);
            setEndDate(itemToEdit.endDate);
            setDescription(itemToEdit.description);
            setFileName(itemToEdit.fileName);
            setFileContent(itemToEdit.fileContent);
        } else {
            // Reset form for new item
            setCategory(PORTFOLIO_CATEGORIES[0]);
            setTitle('');
            setInstitution('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setFileName('');
            setFileContent(undefined);
        }
    }, [itemToEdit, isOpen]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("O arquivo é muito grande. Por favor, selecione um arquivo menor que 2MB.");
                e.target.value = ''; // Reset file input
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileName(file.name);
                setFileContent(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category) {
            alert('Título e Categoria são obrigatórios.');
            return;
        }
        onSave({ category, title, institution, startDate, endDate, description, fileName, fileContent });
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-2xl w-full transform transition-all animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {itemToEdit ? 'Editar Item do Portfólio' : 'Adicionar ao Portfólio'}
                    </h2>
                    <button onClick={onClose} className="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
                        >
                            {PORTFOLIO_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título da Atividade</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instituição</label>
                        <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Início</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Fim</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição / Carga Horária</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-light-gray dark:bg-gray-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anexar Certificado (PDF, JPG, PNG)</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary-medium hover:file:bg-blue-100"
                        />
                        {fileName && <p className="text-xs text-gray-500 mt-1">Arquivo selecionado: {fileName}</p>}
                         <p className="text-xs text-gray-500 mt-1">Limite de 2MB por arquivo. O armazenamento é local no seu navegador.</p>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3 pt-4">
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
                            {itemToEdit ? 'Salvar Alterações' : 'Adicionar Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPortfolioItemModal;
