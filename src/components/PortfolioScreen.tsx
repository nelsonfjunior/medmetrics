import React, { useState, useMemo, useEffect } from 'react';
import jsPDF from 'jspdf';
import type { PortfolioItem, UserProfile } from '../types';
import { PORTFOLIO_CATEGORIES } from '../constants';
import { BriefcaseIcon, PencilIcon, PlusCircleIcon, TrashIcon, DownloadIcon } from './icons';
import EditPortfolioItemModal from './EditPortfolioItemModal';

// Declares that pdfjsLib will be available on the global scope (window)
// It is loaded via a <script> tag in index.html to avoid Vite/Rollup module resolution issues.
declare const pdfjsLib: any;


// --- PDF Generation Logic ---
const generatePortfolioPDF = async (profile: UserProfile, items: PortfolioItem[]): Promise<void> => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(profile.name, margin, y);
    y += 25;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100);

    const contactInfo = [
        profile.email,
        profile.cpf ? `CPF: ${profile.cpf}` : null
    ].filter(Boolean).join('  |  ');
    doc.text(contactInfo, margin, y);
    y += 20;

    if (profile.university || (profile.startYear && profile.graduationYear)) {
        const formationLine = [
            profile.university,
            profile.startYear && profile.graduationYear ? `(${profile.startYear} - ${profile.graduationYear})` : null
        ].filter(Boolean).join(' ');
        
        if(formationLine) {
            doc.text(`Formação: ${formationLine}`, margin, y);
            y += 20;
        }
    }

    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    // --- Attachment Loading Logic ---
    const loadAttachmentData = (item: PortfolioItem): Promise<{ id: string; dataUrl?: string; width?: number; height?: number; error?: string }> => {
        return new Promise(async (resolve) => {
            const result = { id: item.id };
            if (!item.fileContent) return resolve(result);

            if (item.fileContent.startsWith('data:image/')) {
                const img = new Image();
                img.src = item.fileContent;
                img.onload = () => resolve({ ...result, dataUrl: item.fileContent, width: img.width, height: img.height });
                img.onerror = () => resolve({ ...result, error: `Falha ao carregar imagem: ${item.fileName}` });
            } else if (item.fileContent.startsWith('data:application/pdf')) {
                try {
                    const pdfData = atob(item.fileContent.substring(item.fileContent.indexOf(',') + 1));
                    const pdfBytes = new Uint8Array(pdfData.length).map((_, i) => pdfData.charCodeAt(i));
                    
                    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
                    const pdf = await loadingTask.promise;
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 2.0 });

                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext('2d');

                    if (context) {
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        resolve({
                            ...result,
                            dataUrl: canvas.toDataURL('image/jpeg', 0.9),
                            width: canvas.width,
                            height: canvas.height
                        });
                    } else {
                        resolve({ ...result, error: `Falha ao renderizar PDF: ${item.fileName}` });
                    }
                } catch (e) {
                    console.error('PDF rendering error:', e);
                    resolve({ ...result, error: `Falha ao processar PDF: ${item.fileName}` });
                }
            } else {
                resolve(result); // Unsupported file type
            }
        });
    };
    
    const loadedAttachments = await Promise.all(items.map(loadAttachmentData));
    const attachmentsMap = new Map(loadedAttachments.map(att => [att.id, att]));

    const itemsByCategory = items.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, PortfolioItem[]>);

    // --- Content ---
    for (const category of PORTFOLIO_CATEGORIES) {
        const categoryItems = itemsByCategory[category];

        if (categoryItems && categoryItems.length > 0) {
            checkPageBreak(50);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text(category, margin, y);
            y += 25;

            for (const item of categoryItems) {
                checkPageBreak(80);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.text(item.title, margin + 10, y);

                doc.setFont('helvetica', 'italic');
                doc.setFontSize(10);
                doc.setTextColor(150);
                const dates = item.startDate && item.endDate ? `${new Date(item.startDate).toLocaleDateString('pt-BR')} a ${new Date(item.endDate).toLocaleDateString('pt-BR')}` : '';
                doc.text(dates, pageWidth - margin, y, { align: 'right' });
                y += 18;

                doc.setFont('helvetica', 'normal');
                doc.text(item.institution, margin + 10, y);
                y += 20;

                if (item.description) {
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    const descriptionLines = doc.splitTextToSize(item.description, contentWidth - 10);
                    checkPageBreak(descriptionLines.length * 12);
                    doc.text(descriptionLines, margin + 10, y);
                    y += descriptionLines.length * 12 + 10;
                }
                
                const attachment = attachmentsMap.get(item.id);

                if (attachment?.dataUrl && attachment.width && attachment.height) {
                    const aspectRatio = attachment.width / attachment.height;
                    const pdfImageWidth = contentWidth - 10;
                    const pdfImageHeight = pdfImageWidth / aspectRatio;

                    checkPageBreak(pdfImageHeight + 20);

                    try {
                        doc.addImage(attachment.dataUrl, 'JPEG', margin + 10, y, pdfImageWidth, pdfImageHeight);
                        y += pdfImageHeight + 15;
                    } catch (e) {
                        console.error("jsPDF error adding image:", e);
                        checkPageBreak(30);
                        doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(255, 0, 0);
                        doc.text(`[Falha ao adicionar imagem: ${item.fileName}]`, margin + 10, y);
                        y += 20;
                    }
                } else if (attachment?.error) {
                    checkPageBreak(30);
                    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(255, 0, 0);
                    doc.text(`[${attachment.error}]`, margin + 10, y);
                    y += 20;
                } else if (item.fileName) {
                    checkPageBreak(30);
                    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(100);
                    doc.text(`[Anexo não suportado: ${item.fileName}]`, margin + 10, y);
                    y += 20;
                }

                y += 15;
            }
        }
    }
    
    doc.save(`Portfolio_${profile.name.replace(/\s/g, '_')}.pdf`);
};

interface PortfolioScreenProps {
    items: PortfolioItem[];
    profile: UserProfile;
    updateProfile: (data: Partial<UserProfile>) => void;
    addItem: (item: Omit<PortfolioItem, 'id'>) => void;
    updateItem: (item: PortfolioItem) => void;
    deleteItem: (id: string) => void;
}

const PersonalInfoCard: React.FC<{ profile: UserProfile; updateProfile: (data: Partial<UserProfile>) => void; }> = ({ profile, updateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState(profile);

    useEffect(() => {
        setFormState(profile);
    }, [profile]);

    const handleSave = () => {
        updateProfile(formState);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormState(profile);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Informações Pessoais</h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-primary-medium rounded-full transition-colors duration-200">
                        <PencilIcon className="w-5 h-5"/>
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                            <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" value={formState.email} onChange={handleChange} className="mt-1 w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                            <input type="text" name="cpf" placeholder="000.000.000-00" value={formState.cpf || ''} onChange={handleChange} className="mt-1 w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Universidade</label>
                            <input type="text" name="university" placeholder="Ex: Universidade de São Paulo" value={formState.university || ''} onChange={handleChange} className="mt-1 w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano de Início (Faculdade)</label>
                            <input type="text" name="startYear" placeholder="Ex: 2018" value={formState.startYear || ''} onChange={handleChange} className="mt-1 w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano de Formação</label>
                            <input type="text" name="graduationYear" placeholder="Ex: 2024" value={formState.graduationYear || ''} onChange={handleChange} className="mt-1 w-full p-2 bg-light-gray dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-primary-medium focus:outline-none transition"/>
                        </div>
                     </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary-medium hover:bg-primary-dark text-white font-bold rounded-lg transition shadow-md">Salvar</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div><span className="font-semibold text-gray-600 dark:text-gray-400">Nome:</span> <span className="text-gray-800 dark:text-white ml-2">{profile.name}</span></div>
                    <div><span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span> <span className="text-gray-800 dark:text-white ml-2">{profile.email}</span></div>
                    <div><span className="font-semibold text-gray-600 dark:text-gray-400">CPF:</span> <span className="text-gray-800 dark:text-white ml-2">{profile.cpf || 'Não informado'}</span></div>
                    <div><span className="font-semibold text-gray-600 dark:text-gray-400">Universidade:</span> <span className="text-gray-800 dark:text-white ml-2">{profile.university || 'Não informada'}</span></div>
                    <div className="md:col-span-2"><span className="font-semibold text-gray-600 dark:text-gray-400">Período de Formação:</span> <span className="text-gray-800 dark:text-white ml-2">{profile.startYear && profile.graduationYear ? `${profile.startYear} - ${profile.graduationYear}` : 'Não informado'}</span></div>
                </div>
            )}
        </div>
    );
};

const PortfolioItemCard: React.FC<{
    item: PortfolioItem;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ item, onEdit, onDelete }) => {
    return (
        <div className="bg-light-gray dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-primary-medium font-semibold">{item.institution}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.startDate} a {item.endDate}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{item.description}</p>
                    {item.fileContent && item.fileName && (
                         <a 
                            href={item.fileContent} 
                            download={item.fileName}
                            className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver Certificado ({item.fileName})
                        </a>
                    )}
                </div>
                <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                    <button onClick={onEdit} className="p-1 text-gray-500 hover:text-blue-500"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    );
};

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ items, profile, updateProfile, addItem, updateItem, deleteItem }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        item?: PortfolioItem;
    }>({ isOpen: false });
    
    const itemsByCategory = useMemo(() => {
        return items.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, PortfolioItem[]>);
    }, [items]);
    
    const handleOpenModal = (item?: PortfolioItem) => {
        setModalState({ isOpen: true, item });
    };
    
    const handleCloseModal = () => {
        setModalState({ isOpen: false });
    };

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);
        try {
            await generatePortfolioPDF(profile, items);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleSave = (itemData: Omit<PortfolioItem, 'id'>) => {
        if (modalState.item) {
            updateItem({ ...modalState.item, ...itemData });
        } else {
            addItem(itemData);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este item do portfólio?")) {
            deleteItem(id);
        }
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Portfólio & Currículo</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Organize suas conquistas para a análise curricular.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                     <button 
                        onClick={handleGeneratePdf}
                        disabled={isGeneratingPdf}
                        className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon className="w-6 h-6 mr-2" />
                        {isGeneratingPdf ? 'Gerando PDF...' : 'Exportar para PDF'}
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center bg-primary-medium hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition shadow-md"
                    >
                        <PlusCircleIcon className="w-6 h-6 mr-2" />
                        Adicionar Conquista
                    </button>
                </div>
            </div>
            
            <PersonalInfoCard profile={profile} updateProfile={updateProfile} />

            <div className="space-y-8">
                {PORTFOLIO_CATEGORIES.map(category => {
                    const categoryItems = itemsByCategory[category] || [];
                    if (categoryItems.length === 0) return null;
                    
                    return (
                        <div key={category} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{category}</h3>
                            <div className="space-y-4">
                                {categoryItems.map(item => (
                                    <PortfolioItemCard 
                                        key={item.id} 
                                        item={item}
                                        onEdit={() => handleOpenModal(item)}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}

                {items.length === 0 && (
                     <div className="text-center py-16">
                        <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Seu portfólio está vazio.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Adicione suas conquistas para começar!</p>
                    </div>
                )}
            </div>

            {modalState.isOpen && (
                <EditPortfolioItemModal 
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    itemToEdit={modalState.item}
                />
            )}
        </div>
    );
};

export default PortfolioScreen;