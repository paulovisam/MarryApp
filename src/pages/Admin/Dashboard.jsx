import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoGiftOutline, IoPeopleOutline, IoLogOutOutline, IoCashOutline, IoAdd, IoTrash, IoCreate } from 'react-icons/io5';
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
    const [formData, setFormData] = useState({ title: '', price: '', image_url: '', total_quantity: 1, description: '' });

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

    // Handlers
    const openAddModal = () => {
        setEditingGift(null);
        setFormData({ title: '', price: '', image_url: '', total_quantity: 1, description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (gift) => {
        setEditingGift(gift);
        setFormData(gift);
        setIsModalOpen(true);
    };

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
                                <p className="text-sm text-slate-500">Presentes Vendidos</p>
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
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold font-sans dark:text-white">Gerenciar Presentes</h3>
                                <button onClick={openAddModal} className="flex items-center gap-2 bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700">
                                    <IoAdd /> Adicionar Novo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gifts.map(gift => (
                                    <div key={gift.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4">
                                        <img src={gift.image_url} alt="" className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold font-sans text-sm truncate dark:text-white">{gift.title}</h4>
                                            <p className="text-white text-sm">R$ {gift.price}</p>
                                            <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                                <span>Vendidos: {gift.purchased_quantity}/{gift.total_quantity}</span>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => openEditModal(gift)} className="text-blue-500 hover:text-blue-700"><IoCreate size={18} /></button>
                                                <button onClick={() => handleDeleteGift(gift.id)} className="text-red-500 hover:text-red-700"><IoTrash size={18} /></button>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{editingGift ? 'Editar Presente' : 'Novo Presente'}</h3>
                        <form onSubmit={handleSaveGift} className="space-y-4">
                            <input
                                placeholder="Título"
                                className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Descrição (curta)"
                                className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <input
                                    placeholder="Preço R$"
                                    type="number"
                                    step="0.01"
                                    className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Qtd Total"
                                    type="number"
                                    className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={formData.total_quantity}
                                    onChange={e => setFormData({ ...formData, total_quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                placeholder="URL da Imagem"
                                className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                required
                            />

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-burgundy-600 text-white rounded">Salvar</button>
                            </div>
                        </form>
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
