import React, { useEffect, useMemo, useState } from 'react';
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
    IoClose,
    IoRefreshOutline,
    IoChevronUp,
    IoChevronDown,
} from 'react-icons/io5';
import { useAdminGifts, useAdminRsvps } from './adminHooks';

function formatRsvpPhone(value) {
    if (value == null || value === '') return '—';
    const d = String(value).replace(/\D/g, '');
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return String(value);
}

function rsvpEditDigitsOnly(s) {
    return String(s ?? '').replace(/\D/g, '');
}

function rsvpEditIsFullName(s) {
    const parts = String(s).trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2;
}

function rsvpEditHasMultipleNames(s) {
    const t = String(s).trim();
    return /\s+e\s+/i.test(t) || /,/.test(t);
}

function rsvpEditIsValidOptionalBrPhone(s) {
    const d = rsvpEditDigitsOnly(s);
    if (!d) return true;
    if (d.length < 10 || d.length > 11) return false;
    const ddd = parseInt(d.slice(0, 2), 10);
    return ddd >= 11 && ddd <= 99;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('rsvps'); // rsvps | gifts
    const { rsvps, refresh: refreshRsvps, updateRsvp } = useAdminRsvps();
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
    /** Presentes: todos | com cotas disponíveis | esgotados (todas as cotas ganhas). */
    const [giftAvailabilityFilter, setGiftAvailabilityFilter] = useState('all');
    const [rsvpSearch, setRsvpSearch] = useState('');
    const [rsvpStatusFilter, setRsvpStatusFilter] = useState('all');
    /** Convidados: mais recentes primeiro (igual ao fetch) ou mais antigos primeiro. */
    const [rsvpDateSort, setRsvpDateSort] = useState('newest');
    /** Ordem alfabética pelo cabeçalho Nome; quando falso, usa `rsvpDateSort`. */
    const [rsvpNameSortActive, setRsvpNameSortActive] = useState(false);
    /** false = A–Z, true = Z–A (só quando rsvpNameSortActive). */
    const [rsvpNameSortDesc, setRsvpNameSortDesc] = useState(false);
    const [selectedRsvp, setSelectedRsvp] = useState(null);
    const [rsvpEdit, setRsvpEdit] = useState(null);
    const [rsvpEditSaving, setRsvpEditSaving] = useState(false);
    const [rsvpEditError, setRsvpEditError] = useState('');
    const [rsvpRefreshing, setRsvpRefreshing] = useState(false);
    const [giftSort, setGiftSort] = useState('name-asc');
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

    const handleRefreshRsvps = async () => {
        setRsvpRefreshing(true);
        try {
            await refreshRsvps();
        } finally {
            setRsvpRefreshing(false);
        }
    };

    const openRsvpEdit = (rsvp, opts = {}) => {
        const { closeDetail } = opts;
        if (closeDetail) setSelectedRsvp(null);
        setRsvpEditError('');
        setRsvpEdit({
            id: rsvp.id,
            name: rsvp.name ?? '',
            phone: rsvp.phone != null ? String(rsvp.phone) : '',
            guests_count: rsvp.guests_count != null ? String(rsvp.guests_count) : '',
            is_present: !!rsvp.is_present,
            message: rsvp.message ?? '',
        });
    };

    const handleRsvpEditSubmit = async (e) => {
        e.preventDefault();
        if (!rsvpEdit) return;
        const name = String(rsvpEdit.name).trim();
        if (!rsvpEditIsFullName(name)) {
            setRsvpEditError('Preencha o nome completo (nome e sobrenome).');
            return;
        }
        if (rsvpEditHasMultipleNames(name)) {
            setRsvpEditError('Use um único nome completo neste registro (sem vírgulas ou "e" entre nomes de pessoas).');
            return;
        }
        const phoneT = String(rsvpEdit.phone).trim();
        if (phoneT && !rsvpEditIsValidOptionalBrPhone(phoneT)) {
            setRsvpEditError('Se informar telefone, use DDD + número (10 ou 11 dígitos).');
            return;
        }
        const gcRaw = String(rsvpEdit.guests_count).trim();
        const gc = gcRaw === '' ? 0 : Number.parseInt(gcRaw, 10);
        if (!Number.isFinite(gc) || gc < 0) {
            setRsvpEditError('Quantidade de pessoas deve ser um número inteiro ≥ 0.');
            return;
        }
        const phoneDigits = rsvpEditDigitsOnly(phoneT);
        const payload = {
            name,
            phone: phoneDigits || null,
            guests_count: rsvpEdit.is_present ? gc : 0,
            is_present: rsvpEdit.is_present,
            message: String(rsvpEdit.message ?? '').trim(),
        };
        setRsvpEditSaving(true);
        setRsvpEditError('');
        const ok = await updateRsvp(rsvpEdit.id, payload);
        setRsvpEditSaving(false);
        if (ok) setRsvpEdit(null);
    };

    // Stats
    const totalConfirmedGuests = rsvps.filter(r => r.is_present).reduce((acc, curr) => acc + curr.guests_count, 0);
    const totalMoney = gifts.reduce((acc, g) => acc + (g.purchased_quantity * g.price), 0);
    /** Quantidade de itens da lista com todas as cotas preenchidas (esgotados). */
    const totalGiftsClosed = gifts.filter((g) => {
        const total = Number(g.total_quantity) || 0;
        const purchased = Number(g.purchased_quantity) || 0;
        return total > 0 && purchased >= total;
    }).length;

    const filteredRsvps = useMemo(() => {
        const q = rsvpSearch.trim().toLowerCase();
        const filtered = rsvps.filter((r) => {
            const name = (r.name || '').toLowerCase();
            if (q && !name.includes(q)) return false;
            if (rsvpStatusFilter === 'present' && !r.is_present) return false;
            if (rsvpStatusFilter === 'absent' && r.is_present) return false;
            return true;
        });
        const createdTime = (r) => {
            const t = r.created_at ? new Date(r.created_at).getTime() : 0;
            return Number.isNaN(t) ? 0 : t;
        };
        return [...filtered].sort((a, b) => {
            if (rsvpNameSortActive) {
                const na = (a.name ?? '').trim();
                const nb = (b.name ?? '').trim();
                const c = na.localeCompare(nb, 'pt-BR', { sensitivity: 'base' });
                if (c !== 0) return rsvpNameSortDesc ? -c : c;
                const ta = createdTime(a);
                const tb = createdTime(b);
                if (ta === tb) return 0;
                return rsvpDateSort === 'oldest' ? ta - tb : tb - ta;
            }
            const ta = createdTime(a);
            const tb = createdTime(b);
            if (ta === tb) return 0;
            return rsvpDateSort === 'oldest' ? ta - tb : tb - ta;
        });
    }, [rsvps, rsvpSearch, rsvpStatusFilter, rsvpDateSort, rsvpNameSortActive, rsvpNameSortDesc]);

    const filteredGifts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        const matchesAvailability = (gift) => {
            const total = Number(gift.total_quantity) || 0;
            const purchased = Number(gift.purchased_quantity) || 0;
            if (giftAvailabilityFilter === 'all') return true;
            if (giftAvailabilityFilter === 'open') {
                return total > 0 && purchased < total;
            }
            if (giftAvailabilityFilter === 'won') {
                return total > 0 && purchased >= total;
            }
            return true;
        };
        const filtered = gifts.filter(
            (gift) =>
                gift.title.toLowerCase().includes(term) &&
                matchesAvailability(gift)
        );
        const sorted = [...filtered].sort((a, b) => {
            const titleA = a.title ?? '';
            const titleB = b.title ?? '';
            const priceA = Number(a.price) || 0;
            const priceB = Number(b.price) || 0;
            switch (giftSort) {
                case 'name-desc':
                    return titleB.localeCompare(titleA, 'pt-BR', {
                        sensitivity: 'base',
                    });
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'name-asc':
                default:
                    return titleA.localeCompare(titleB, 'pt-BR', {
                        sensitivity: 'base',
                    });
            }
        });
        return sorted;
    }, [gifts, searchTerm, giftSort, giftAvailabilityFilter]);

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
        if (
            !confirm(
                'Excluir este presente? Após aplicar a migração no Supabase (ON DELETE SET NULL), os pedidos existentes permanecem no histórico, mas deixam de apontar para este item (gift_id fica nulo). Esta ação não pode ser desfeita.'
            )
        ) {
            return;
        }
        await deleteGift(id);
    };

    useEffect(() => {
        if (!selectedRsvp && !rsvpEdit) return undefined;
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            if (rsvpEdit) setRsvpEdit(null);
            else setSelectedRsvp(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedRsvp, rsvpEdit]);

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
                        Convidados ({rsvps.length})
                    </button>

                    <button
                        onClick={() => {
                            setSelectedRsvp(null);
                            setRsvpEdit(null);
                            setActiveTab('gifts');
                        }}
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
                        Convidados
                    </button>
                    <button
                        onClick={() => {
                            setSelectedRsvp(null);
                            setRsvpEdit(null);
                            setActiveTab('gifts');
                        }}
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
                                <p className="text-2xl font-bold dark:text-white">{totalGiftsClosed}</p>
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
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                                <div className="relative w-full sm:min-w-[220px] sm:max-w-md sm:flex-1">
                                    <IoSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
                                    <input
                                        type="search"
                                        placeholder="Buscar por nome…"
                                        className="min-h-[44px] w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-slate-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                                        value={rsvpSearch}
                                        onChange={(e) => setRsvpSearch(e.target.value)}
                                        autoComplete="off"
                                        aria-label="Buscar convidado por nome"
                                    />
                                </div>
                                <div className="w-full sm:w-auto sm:min-w-[200px]">
                                    <label htmlFor="rsvp-status-filter" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Status
                                    </label>
                                    <select
                                        id="rsvp-status-filter"
                                        className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:text-white sm:min-w-[200px]"
                                        value={rsvpStatusFilter}
                                        onChange={(e) => setRsvpStatusFilter(e.target.value)}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="present">Confirmado</option>
                                        <option value="absent">Recusado</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-auto sm:min-w-[220px]">
                                    <label htmlFor="rsvp-date-sort" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Ordenar por data
                                    </label>
                                    <select
                                        id="rsvp-date-sort"
                                        className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:text-white sm:min-w-[220px]"
                                        value={rsvpDateSort}
                                        onChange={(e) => {
                                            setRsvpDateSort(e.target.value);
                                            setRsvpNameSortActive(false);
                                        }}
                                        aria-label="Ordenar convidados por data de registro"
                                    >
                                        <option value="newest">Mais recentes primeiro</option>
                                        <option value="oldest">Mais antigos primeiro</option>
                                    </select>
                                </div>
                                <div className="flex w-full justify-end sm:ml-auto sm:w-auto">
                                    <button
                                        id="rsvp-refresh"
                                        type="button"
                                        onClick={handleRefreshRsvps}
                                        disabled={rsvpRefreshing}
                                        className="flex min-h-[44px] w-auto min-w-[140px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                                        aria-label="Atualizar lista de convidados a partir do servidor"
                                        aria-busy={rsvpRefreshing}
                                    >
                                        <IoRefreshOutline
                                            className={`h-5 w-5 shrink-0 ${rsvpRefreshing ? 'animate-spin' : ''}`}
                                            aria-hidden
                                        />
                                        {rsvpRefreshing ? 'Atualizando…' : 'Atualizar'}
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!rsvpNameSortActive) {
                                                            setRsvpNameSortActive(true);
                                                            setRsvpNameSortDesc(false);
                                                        } else if (!rsvpNameSortDesc) {
                                                            setRsvpNameSortDesc(true);
                                                        } else {
                                                            setRsvpNameSortActive(false);
                                                        }
                                                    }}
                                                    className="-m-1 inline-flex min-h-[44px] w-full min-w-[7rem] items-center gap-1.5 rounded-md px-1 py-1 text-left font-semibold uppercase tracking-wide text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-500 dark:text-slate-400"
                                                    aria-pressed={rsvpNameSortActive}
                                                    aria-label={
                                                        rsvpNameSortActive
                                                            ? rsvpNameSortDesc
                                                                ? 'Ordenar convidados: nome Z a A. Clicar volta à ordem por data.'
                                                                : 'Ordenar convidados: nome A a Z. Próximo clique inverte para Z a A.'
                                                            : 'Ordenar convidados por nome (A a Z). Clicar novamente inverte ou volta à ordem por data.'
                                                    }
                                                >
                                                    <span>Nome</span>
                                                    {rsvpNameSortActive ? (
                                                        rsvpNameSortDesc ? (
                                                            <IoChevronDown
                                                                className="h-4 w-4 shrink-0 text-burgundy-600 dark:text-burgundy-400"
                                                                aria-hidden
                                                            />
                                                        ) : (
                                                            <IoChevronUp
                                                                className="h-4 w-4 shrink-0 text-burgundy-600 dark:text-burgundy-400"
                                                                aria-hidden
                                                            />
                                                        )
                                                    ) : null}
                                                </button>
                                            </th>
                                            <th className="p-4">Telefone</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Mensagem</th>
                                            <th className="p-4">Data</th>
                                            <th className="w-px whitespace-nowrap p-4 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {filteredRsvps.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                                                    Nenhum registro encontrado com os filtros atuais.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRsvps.map((rsvp) => (
                                                <tr
                                                    key={rsvp.id}
                                                    role="button"
                                                    tabIndex={0}
                                                    className="cursor-pointer dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-burgundy-500"
                                                    onClick={() => setSelectedRsvp(rsvp)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            setSelectedRsvp(rsvp);
                                                        }
                                                    }}
                                                    aria-label={`Abrir detalhes de ${rsvp.name || 'convidado'}`}
                                                >
                                                    <td className="p-4 font-medium">{rsvp.name}</td>
                                                    <td className="p-4 whitespace-nowrap font-mono text-sm tabular-nums" title={rsvp.phone || undefined}>
                                                        {formatRsvpPhone(rsvp.phone)}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${rsvp.is_present ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                                                            {rsvp.is_present ? 'Confirmado' : 'Recusado'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-500 max-w-xs truncate" title={rsvp.message}>{rsvp.message || '—'}</td>
                                                    <td className="p-4 text-xs text-slate-500">{new Date(rsvp.created_at).toLocaleDateString('pt-BR')}</td>
                                                    <td className="p-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openRsvpEdit(rsvp);
                                                            }}
                                                            className="inline-flex min-h-[40px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                                            aria-label={`Editar convidado ${rsvp.name || ''}`}
                                                        >
                                                            <IoCreate size={18} className="shrink-0" aria-hidden />
                                                            <span className="hidden sm:inline">Editar</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'gifts' && (
                        <div className="p-6">
                            <div className="mb-6 space-y-4">
                                <h3 className="text-xl font-bold font-sans dark:text-white">
                                    Gerenciar Presentes
                                </h3>
                                <div
                                    className="
                                        grid grid-cols-1 gap-3
                                        md:grid-cols-2 md:gap-4
                                        xl:grid-cols-12 xl:items-end xl:gap-3
                                    "
                                >
                                    <div className="relative min-w-0 md:col-span-2 xl:col-span-4">
                                        <IoSearch
                                            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                                            aria-hidden
                                        />
                                        <input
                                            type="search"
                                            placeholder="Buscar presente…"
                                            className="min-h-[44px] w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-slate-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            autoComplete="off"
                                            aria-label="Buscar presente por nome"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-col gap-1 md:min-w-0 xl:col-span-3">
                                        <label
                                            htmlFor="gift-sort-filter"
                                            className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                                        >
                                            Ordenar por
                                        </label>
                                        <select
                                            id="gift-sort-filter"
                                            value={giftSort}
                                            onChange={(e) => setGiftSort(e.target.value)}
                                            className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                                            aria-label="Ordenar presentes por nome ou valor"
                                        >
                                            <option value="name-asc">Nome (A–Z)</option>
                                            <option value="name-desc">Nome (Z–A)</option>
                                            <option value="price-asc">Valor (menor primeiro)</option>
                                            <option value="price-desc">Valor (maior primeiro)</option>
                                        </select>
                                    </div>
                                    <div className="flex min-w-0 flex-col gap-1 xl:col-span-3">
                                        <label
                                            htmlFor="gift-availability-filter"
                                            className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                                        >
                                            Disponibilidade
                                        </label>
                                        <select
                                            id="gift-availability-filter"
                                            value={giftAvailabilityFilter}
                                            onChange={(e) => setGiftAvailabilityFilter(e.target.value)}
                                            className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                                            aria-label="Filtrar presentes por abertos ou ganhos"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="open">Abertos (com cotas)</option>
                                            <option value="won">Ganhados (esgotados)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 xl:col-span-2">
                                        <button
                                            type="button"
                                            onClick={openAddModal}
                                            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-burgundy-600 px-4 py-2.5 text-white transition-colors hover:bg-burgundy-700"
                                        >
                                            <IoAdd className="shrink-0" aria-hidden />
                                            Adicionar Novo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredGifts.length === 0 ? (
                                    <div className="col-span-full rounded-xl border border-dashed border-slate-200 py-14 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
                                        Nenhum presente encontrado com os filtros atuais.
                                    </div>
                                ) : null}
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

            {/* Detalhe do convidado (RSVP) */}
            {selectedRsvp && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="rsvp-detail-title"
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label="Fechar"
                        onClick={() => setSelectedRsvp(null)}
                    />
                    <div className="relative z-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <h3 id="rsvp-detail-title" className="font-sans text-xl font-bold dark:text-white">
                                Detalhes do convidado
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedRsvp(null)}
                                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                aria-label="Fechar"
                            >
                                <IoClose size={22} />
                            </button>
                        </div>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Nome</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">{selectedRsvp.name || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Telefone</dt>
                                <dd className="mt-1 font-mono tabular-nums text-slate-800 dark:text-slate-200">{formatRsvpPhone(selectedRsvp.phone)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Quantidade (pessoas)</dt>
                                <dd className="mt-1 text-slate-900 dark:text-white">{selectedRsvp.guests_count ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${selectedRsvp.is_present ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                                        {selectedRsvp.is_present ? 'Confirmado' : 'Recusado'}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Mensagem</dt>
                                <dd className="mt-1 whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300">
                                    {selectedRsvp.message?.trim() ? selectedRsvp.message : '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Registrado em</dt>
                                <dd className="mt-1 text-slate-800 dark:text-slate-200">
                                    {selectedRsvp.created_at
                                        ? new Date(selectedRsvp.created_at).toLocaleString('pt-BR', {
                                              dateStyle: 'short',
                                              timeStyle: 'short',
                                          })
                                        : '—'}
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => openRsvpEdit(selectedRsvp, { closeDetail: true })}
                                className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            >
                                Editar registro
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRsvp(null)}
                                className="min-h-[44px] rounded-lg bg-burgundy-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burgundy-700"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {rsvpEdit && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="rsvp-edit-title"
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label="Fechar"
                        disabled={rsvpEditSaving}
                        onClick={() => !rsvpEditSaving && setRsvpEdit(null)}
                    />
                    <div className="relative z-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <h3 id="rsvp-edit-title" className="font-sans text-xl font-bold dark:text-white">
                                Editar convidado
                            </h3>
                            <button
                                type="button"
                                disabled={rsvpEditSaving}
                                onClick={() => !rsvpEditSaving && setRsvpEdit(null)}
                                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                aria-label="Fechar"
                            >
                                <IoClose size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleRsvpEditSubmit} className="space-y-4">
                            {rsvpEditError ? (
                                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800/40 dark:bg-red-950/40 dark:text-red-200" role="alert">
                                    {rsvpEditError}
                                </p>
                            ) : null}
                            <div>
                                <label htmlFor="rsvp-edit-name" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Nome completo
                                </label>
                                <input
                                    id="rsvp-edit-name"
                                    type="text"
                                    value={rsvpEdit.name}
                                    onChange={(e) => setRsvpEdit((s) => (s ? { ...s, name: e.target.value } : s))}
                                    className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="rsvp-edit-phone" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Telefone (opcional)
                                </label>
                                <input
                                    id="rsvp-edit-phone"
                                    type="tel"
                                    inputMode="tel"
                                    value={rsvpEdit.phone}
                                    onChange={(e) => setRsvpEdit((s) => (s ? { ...s, phone: e.target.value } : s))}
                                    className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono tabular-nums text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    autoComplete="tel"
                                />
                            </div>
                            <div>
                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Presença
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                                        <input
                                            type="radio"
                                            name="rsvp-edit-present"
                                            checked={rsvpEdit.is_present}
                                            onChange={() => setRsvpEdit((s) => (s ? { ...s, is_present: true } : s))}
                                            className="h-4 w-4 accent-burgundy-600"
                                        />
                                        Confirmado
                                    </label>
                                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                                        <input
                                            type="radio"
                                            name="rsvp-edit-present"
                                            checked={!rsvpEdit.is_present}
                                            onChange={() => setRsvpEdit((s) => (s ? { ...s, is_present: false } : s))}
                                            className="h-4 w-4 accent-burgundy-600"
                                        />
                                        Recusado
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="rsvp-edit-guests" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Quantidade (pessoas)
                                </label>
                                <input
                                    id="rsvp-edit-guests"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={rsvpEdit.guests_count}
                                    onChange={(e) => setRsvpEdit((s) => (s ? { ...s, guests_count: e.target.value } : s))}
                                    disabled={!rsvpEdit.is_present}
                                    className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Se o status for recusado, a quantidade é salva como 0.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="rsvp-edit-message" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Mensagem
                                </label>
                                <textarea
                                    id="rsvp-edit-message"
                                    rows={3}
                                    value={rsvpEdit.message}
                                    onChange={(e) => setRsvpEdit((s) => (s ? { ...s, message: e.target.value } : s))}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                                <button
                                    type="button"
                                    disabled={rsvpEditSaving}
                                    onClick={() => !rsvpEditSaving && setRsvpEdit(null)}
                                    className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={rsvpEditSaving}
                                    className="min-h-[44px] rounded-lg bg-burgundy-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burgundy-700 disabled:opacity-60"
                                >
                                    {rsvpEditSaving ? 'Salvando…' : 'Salvar'}
                                </button>
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
