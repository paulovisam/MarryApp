import React, { useEffect, useState } from 'react';
import { getGifts } from '../services/giftService';
import GiftCard from '../components/GiftCard';
import CheckoutModal from '../components/CheckoutModal';
import { IoArrowBack, IoHeart } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const GiftListPage = () => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGift, setSelectedGift] = useState(null);

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
                <div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white">
                        Presenteie com Amor
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Escolhemos alguns itens para nos ajudar a construir nosso novo lar.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {gifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                onBuy={setSelectedGift}
                            />
                        ))}
                    </div>
                )}
            </main>

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
