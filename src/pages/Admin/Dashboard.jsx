import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoGiftOutline,
    IoPeopleOutline,
    IoLogOutOutline,
    IoCashOutline,
    IoAdd,
    IoTrash,
    IoCreate,
    IoSearch,
    IoImageOutline,
} from 'react-icons/io5';
import { useAdminGifts, useAdminRsvps } from './adminHooks';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('rsvps'); // rsvps | gifts
    const { rsvps } = useAdminRsvps();
    const { gifts, addGift, updateGift, deleteGift } = useAdminGifts();

    // Gift Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [editingGift, setEditingGift] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        image_url: '',
        total_quantity: '1',
        description: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

    const imagePreviewUrl = formData.image_url?.trim() || '';

    useEffect(() => {
        if (!localStorage.getItem('adminAuth')) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    // Stats
    const totalConfirmedGuests = rsvps.filter(r => r.is_present).reduce((acc, curr) => acc + curr.guests_count, 0);
    const totalMoney = gifts.reduce((acc, g) => acc + (g.purchased_quantity * g.price), 0);
    const totalGiftsSold = gifts.reduce((acc, g) => acc + g.purchased_quantity, 0);

    const filteredGifts = gifts.filter(gift => gift.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Handlers
    const openAddModal = () => {
        setEditingGift(null);
        setFormData({
            title: '',
            price: '',
            image_url: '',
            total_quantity: '1',
            description: '',
        });
        setImagePreviewFailed(false);
        setIsModalOpen(true);
    };

    const openEditModal = (gift) => {
        setEditingGift(gift);
        setFormData({
            title: gift.title ?? '',
            description: gift.description ?? '',
            price: gift.price != null ? String(gift.price) : '',
            total_quantity:
                gift.total_quantity != null ? String(gift.total_quantity) : '1',
            image_url: gift.image_url ?? '',
        });
        setImagePreviewFailed(false);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (!isModalOpen) return;
        setImagePreviewFailed(false);
    }, [imagePreviewUrl, isModalOpen]);

    const handleSaveGift = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            total_quantity: parseInt(formData.total_quantity)
        };

        if (editingGift) {
            await updateGift(editingGift.id, payload);
        } else {
            await addGift(payload);
        }
        setIsModalOpen(false);
    };

    const handleDeleteGift = async (id) => {
        if (confirm('Tem certeza que deseja excluir?')) {
            await deleteGift(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-800 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-sans mb-8">Admin</h2>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('rsvps')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'rsvps' ? 'bg-burgundy-600' : 'hover:bg-slate-700'}`}
                    >
                        <IoPeopleOutline size={20} />
                        Presença ({rsvps.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('gifts')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'gifts' ? 'bg-burgundy-600' : 'hover:bg-slate-700'}`}
                    >
                        <IoGiftOutline size={20} />
                        Presentes
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 text-red-300 mt-8"
                    >
                        <IoLogOutOutline size={20} />
                        Sair
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold dark:text-white">Admin</h2>
                    <button onClick={handleLogout}><IoLogOutOutline size={24} className="dark:text-white" /></button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex gap-2 mb-8 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('rsvps')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'rsvps'
                            ? 'bg-burgundy-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <IoPeopleOutline size={18} />
                        Presença
                    </button>
                    <button
                        onClick={() => setActiveTab('gifts')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gifts'
                            ? 'bg-burgundy-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <IoGiftOutline size={18} />
                        Presentes
                    </button>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><IoPeopleOutline size={24} /></div>
                            <div>
                                <p className="text-sm text-slate-500">Total Convidados</p>
                                <p className="text-2xl font-bold dark:text-white">{totalConfirmedGuests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><IoGiftOutline size={24} /></div>
                            <div>
                                <p className="text-sm text-slate-500">Presentes Ganhados</p>
                                <p className="text-2xl font-bold dark:text-white">{totalGiftsSold}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><IoCashOutline size={24} /></div>
                            <div>
                                <p className="text-sm text-slate-500">Arrecadado</p>
                                <p className="text-2xl font-bold dark:text-white">R$ {totalMoney.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {activeTab === 'rsvps' && (
                        <div className="p-6">
                            <h3 className="text-xl font-bold font-sans mb-6 dark:text-white">Lista de Confirmação</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Nome</th>
                                            <th className="p-4">Qtde</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Mensagem</th>
                                            <th className="p-4">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {rsvps.map(rsvp => (
                                            <tr key={rsvp.id} className="dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                                                <td className="p-4 font-medium">{rsvp.name}</td>
                                                <td className="p-4">{rsvp.guests_count}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${rsvp.is_present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {rsvp.is_present ? 'Confirmado' : 'Recusado'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500 max-w-xs truncate" title={rsvp.message}>{rsvp.message}</td>
                                                <td className="p-4 text-xs text-slate-500">{new Date(rsvp.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'gifts' && (
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h3 className="text-xl font-bold font-sans dark:text-white">Gerenciar Presentes</h3>
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    <div className="relative">
                                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar presente..."
                                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg w-full dark:bg-slate-700 dark:text-white"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 w-full sm:w-auto">
                                        <IoAdd /> Adicionar Novo
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredGifts.map((gift) => (
                                    <div
                                        key={gift.id}
                                        onClick={() => openEditModal(gift)}
                                        className="flex cursor-pointer gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-burgundy-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-burgundy-700 dark:hover:bg-slate-800/80"
                                    >
                                        <img
                                            src={gift.image_url}
                                            alt=""
                                            className="pointer-events-none h-20 w-20 shrink-0 rounded-lg bg-slate-100 object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate font-sans text-sm font-semibold dark:text-white">
                                                {gift.title}
                                            </h4>
                                            <p className="text-sm font-medium text-burgundy-700 dark:text-burgundy-400">
                                                R$ {gift.price}
                                            </p>
                                            <div className="mt-1 flex gap-2 text-xs text-slate-500">
                                                <span>
                                                    Ganhados: {gift.purchased_quantity}/
                                                    {gift.total_quantity}
                                                </span>
                                            </div>
                                            <div
                                                className="mt-2 flex gap-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(gift)
                                                    }
                                                    className="cursor-pointer rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40"
                                                    aria-label={`Editar ${gift.title}`}
                                                >
                                                    <IoCreate size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteGift(gift.id)
                                                    }
                                                    className="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                                                    aria-label={`Excluir ${gift.title}`}
                                                >
                                                    <IoTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px] sm:items-center sm:p-4"
                    role="presentation"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="gift-modal-title"
                        className="max-h-[min(92dvh,100%)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-2xl border border-slate-200 border-b-0 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:rounded-2xl sm:border-b"
                    >
                        <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:p-6 md:p-8">
                            <h3
                                id="gift-modal-title"
                                className="mb-4 text-lg font-bold dark:text-white sm:mb-6 sm:text-xl"
                            >
                                {editingGift ? 'Editar presente' : 'Novo presente'}
                            </h3>
                            <form onSubmit={handleSaveGift}>
                                <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8">
                                    <div className="w-full shrink-0 md:w-[240px] lg:w-[280px]">
                                        <p className="mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 sm:mb-2 sm:text-sm">
                                            Prévia da foto
                                        </p>
                                        <div className="relative h-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900/80 sm:h-40 md:aspect-[4/3] md:h-auto md:min-h-[140px]">
                                            {imagePreviewUrl && !imagePreviewFailed ? (
                                                <img
                                                    src={imagePreviewUrl}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    onError={() => setImagePreviewFailed(true)}
                                                />
                                            ) : (
                                                <div className="flex h-full flex-col items-center justify-center gap-1.5 px-3 py-2 text-center text-slate-500 dark:text-slate-400 sm:gap-2 sm:px-4">
                                                    <IoImageOutline
                                                        className="h-8 w-8 opacity-50 sm:h-10 sm:w-10"
                                                        aria-hidden
                                                    />
                                                    <span className="text-xs leading-snug sm:text-sm">
                                                        {imagePreviewUrl && imagePreviewFailed
                                                            ? 'Não foi possível carregar esta URL. Verifique o link.'
                                                            : 'Cole a URL abaixo para ver a prévia.'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                                        <div>
                                            <label
                                                htmlFor="gift-image-url"
                                                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                URL da imagem
                                            </label>
                                            <input
                                                id="gift-image-url"
                                                type="text"
                                                inputMode="url"
                                                placeholder="https://…"
                                                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                value={formData.image_url}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        image_url: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="gift-title"
                                                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Título
                                            </label>
                                            <input
                                                id="gift-title"
                                                placeholder="Ex.: Jogo de panelas"
                                                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        title: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="gift-description"
                                                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Descrição (curta)
                                            </label>
                                            <input
                                                id="gift-description"
                                                placeholder="Opcional"
                                                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="gift-price"
                                                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                                >
                                                    Preço (R$)
                                                </label>
                                                <input
                                                    id="gift-price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                    value={formData.price}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            price: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="gift-qty"
                                                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                                >
                                                    Cotas disponíveis
                                                </label>
                                                <input
                                                    id="gift-qty"
                                                    type="number"
                                                    min="1"
                                                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                    value={formData.total_quantity}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            total_quantity: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end sm:pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="min-h-[44px] rounded-lg px-4 py-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 sm:min-h-0"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="min-h-[44px] rounded-lg bg-burgundy-600 px-4 py-2.5 text-white transition-colors hover:bg-burgundy-700 sm:min-h-0"
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm text-center">
                        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                            <IoLogOutOutline size={24} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold font-sans mb-2 dark:text-white">Sair do Painel?</h3>
                        <p className="text-slate-500 mb-6">Você precisará fazer login novamente para acessar o painel.</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-600/20"
                            >
                                Sim, Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
