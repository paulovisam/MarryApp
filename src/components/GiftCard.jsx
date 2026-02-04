import React from 'react';
import { IoGiftOutline } from 'react-icons/io5';

const GiftCard = ({ gift, onBuy }) => {
    const isSoldOut = gift.purchased_quantity >= gift.total_quantity;
    const percent = Math.min((gift.purchased_quantity / gift.total_quantity) * 100, 100);

    return (
        <div className={`
      relative group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 transition-transform hover:-translate-y-1
      ${isSoldOut ? 'opacity-75 grayscale' : ''}
    `}>
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={gift.image_url}
                    alt={gift.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider">
                            Esgotado
                        </span>
                    </div>
                )}
                {!isSoldOut && percent > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                        <div className="h-full bg-burgundy-500" style={{ width: `${percent}%` }} />
                    </div>
                )}
            </div>

            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-lg text-slate-900 dark:text-white leading-tight">
                        {gift.title}
                    </h3>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                    {gift.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-lg text-burgundy-700 dark:text-burgundy-400">
                        R$ {Number(gift.price).toFixed(2).replace('.', ',')}
                    </span>

                    <button
                        onClick={() => onBuy(gift)}
                        disabled={isSoldOut}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isSoldOut
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                                : 'bg-slate-900 text-white hover:bg-burgundy-700 dark:bg-white dark:text-slate-900 dark:hover:bg-burgundy-100'}
            `}
                    >
                        <IoGiftOutline />
                        {isSoldOut ? 'Comprado' : 'Presentear'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GiftCard;
