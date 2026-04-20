import React, { useEffect } from 'react';
import { IoClose, IoGiftOutline } from 'react-icons/io5';
import LazyImage from './LazyImage';

const GiftDetailModal = ({ gift, onClose, onPresentear }) => {
    const isSoldOut = gift.purchased_quantity >= gift.total_quantity;
    const percent = Math.min((gift.purchased_quantity / gift.total_quantity) * 100, 100);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const priceLabel = `R$ ${Number(gift.price).toFixed(2).replace('.', ',')}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-detail-title"
        >
            <button
                type="button"
                className="absolute inset-0 z-0 cursor-default bg-transparent"
                aria-label="Fechar"
                onClick={onClose}
            />
            <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
                    <h2 id="gift-detail-title" className="font-serif text-lg text-burgundy-700 dark:text-burgundy-400 sm:text-xl">
                        Detalhes do presente
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        aria-label="Fechar"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800">
                        <LazyImage
                            src={gift.image_url}
                            alt={gift.title}
                            wrapperClassName="absolute inset-0"
                            imgClassName="object-cover"
                        />
                        {isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-bold uppercase tracking-wider text-white">
                                    Esgotado
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 p-4 sm:p-6">
                        <div>
                            <h3 className="font-serif text-xl text-slate-900 dark:text-white sm:text-2xl">
                                {gift.title}
                            </h3>
                            {gift.description ? (
                                <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                    {gift.description}
                                </p>
                            ) : null}
                        </div>

                        {!isSoldOut && percent > 0 && (
                            <div>
                                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                                    Arrecadação parcial
                                </p>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                    <div
                                        className="h-full rounded-full bg-burgundy-500 transition-[width]"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <p className="font-serif text-2xl font-semibold tabular-nums text-burgundy-700 dark:text-burgundy-400">
                            {priceLabel}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800 sm:p-6">
                    <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => onPresentear(gift)}
                        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-base font-medium text-white transition-colors hover:bg-burgundy-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-burgundy-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                    >
                        <IoGiftOutline className="h-5 w-5 shrink-0" aria-hidden />
                        {isSoldOut ? 'Indisponível' : 'Presentear'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GiftDetailModal;
