import React, { useEffect, useMemo, useState } from 'react';
import { getGifts } from '../services/giftService';
import GiftCard from '../components/GiftCard';
import GiftDetailModal from '../components/GiftDetailModal';
import CheckoutModal from '../components/CheckoutModal';
import { IoArrowBack, IoCloseCircle, IoHeart, IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const GiftListPage = () => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGift, setSelectedGift] = useState(null);
    const [detailGift, setDetailGift] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGifts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return gifts;
        return gifts.filter((gift) => {
            const title = (gift.title || '').toLowerCase();
            const desc = (gift.description || '').toLowerCase();
            return title.includes(q) || desc.includes(q);
        });
    }, [gifts, searchQuery]);

    const fetchGifts = async () => {
        setLoading(true);
        try {
            const data = await getGifts();
            setGifts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-burgundy-600 transition-colors">
                        <IoArrowBack size={20} />
                        <span className="hidden sm:inline">Voltar ao Início</span>
                    </Link>

                    <h1 className="font-serif text-xl sm:text-2xl text-burgundy-700 dark:text-burgundy-400">
                        Lista de Presentes
                    </h1>

                    <div className="w-20 flex justify-end">
                        <IoHeart className="text-burgundy-600" size={24} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-2xl mx-auto text-center mb-8 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white">
                        Presenteie com Amor
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Escolhemos alguns itens para nos ajudar a construir nosso novo lar.
                    </p>
                </div>

                {!loading && gifts.length > 0 && (
                    <div className="max-w-xl mx-auto mb-10">
                        <label
                            htmlFor="gift-search"
                            className="mb-2 block text-left text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Buscar na lista
                        </label>
                        <div className="relative">
                            <IoSearchOutline
                                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                aria-hidden
                            />
                            <input
                                id="gift-search"
                                type="search"
                                name="gift-search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Nome ou descrição do presente…"
                                autoComplete="off"
                                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-burgundy-400"
                            />
                            {searchQuery.trim() !== '' && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                    aria-label="Limpar busca"
                                >
                                    <IoCloseCircle className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                        {searchQuery.trim() !== '' && (
                            <p className="mt-2 text-left text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
                                {filteredGifts.length === 0
                                    ? 'Nenhum resultado para esta busca.'
                                    : `${filteredGifts.length} presente${filteredGifts.length === 1 ? '' : 's'} encontrado${filteredGifts.length === 1 ? '' : 's'}.`}
                            </p>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
                    </div>
                ) : gifts.length === 0 ? (
                    <p className="py-16 text-center text-slate-600 dark:text-slate-400">
                        Nenhum presente disponível no momento.
                    </p>
                ) : filteredGifts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white/80 py-14 text-center dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="text-slate-700 dark:text-slate-200">
                            Nenhum presente corresponde à sua busca.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-sm font-medium text-burgundy-700 underline-offset-2 hover:underline dark:text-burgundy-400"
                        >
                            Limpar busca
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredGifts.map((gift) => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                onSelect={setDetailGift}
                                onBuy={setSelectedGift}
                            />
                        ))}
                    </div>
                )}
            </main>

            {detailGift && (
                <GiftDetailModal
                    gift={detailGift}
                    onClose={() => setDetailGift(null)}
                    onPresentear={(gift) => {
                        setDetailGift(null);
                        setSelectedGift(gift);
                    }}
                />
            )}

            {/* Checkout Modal */}
            {selectedGift && (
                <CheckoutModal
                    gift={selectedGift}
                    onClose={() => setSelectedGift(null)}
                    onSuccess={() => {
                        fetchGifts(); // Refresh list to update stock
                        // Optionally could show a toast here
                    }}
                />
            )}
        </div>
    );
};

export default GiftListPage;
