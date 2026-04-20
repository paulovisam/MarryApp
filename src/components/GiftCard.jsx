import React from 'react';
import { IoGiftOutline } from 'react-icons/io5';
import LazyImage from './LazyImage';

const GiftCard = ({ gift, onBuy, onSelect }) => {
    const isSoldOut = gift.purchased_quantity >= gift.total_quantity;
    const percent = Math.min((gift.purchased_quantity / gift.total_quantity) * 100, 100);

    return (
        <article
            className={`
      group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-transform hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800
      ${isSoldOut ? 'opacity-75 grayscale' : ''}
    `}
        >
            <button
                type="button"
                onClick={() => onSelect?.(gift)}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <LazyImage
                        src={gift.image_url}
                        alt=""
                        wrapperClassName="absolute inset-0"
                        imgClassName="object-cover transition-transform group-hover:scale-105"
                    />
                    {isSoldOut && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-bold uppercase tracking-wider text-white">
                                Presenteado
                            </span>
                        </div>
                    )}
                    {!isSoldOut && percent > 0 && (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                            <div className="h-full bg-burgundy-500" style={{ width: `${percent}%` }} />
                        </div>
                    )}
                </div>

                <div className="flex min-h-0 flex-col space-y-1.5 px-2 pb-2 pt-0 sm:space-y-3 sm:px-5 sm:pb-3">
                    <h3 className="font-sans text-sm font-bold leading-snug text-slate-900 [overflow-wrap:anywhere] dark:text-white sm:text-lg sm:leading-tight">
                        <span className="line-clamp-3 sm:line-clamp-none pt-2">{gift.title}</span>
                    </h3>

                    <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block sm:line-clamp-2 sm:min-h-[2.5rem]">
                        {gift.description}
                    </p>
                </div>
            </button>

            <div className="flex min-h-0 flex-col gap-2 border-t border-slate-100 px-2 pb-2 pt-2 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:pb-5 sm:pt-3">
                <span className="shrink-0 text-xs font-bold tabular-nums text-burgundy-700 dark:text-burgundy-400 sm:text-lg">
                    R$ {Number(gift.price).toFixed(2).replace('.', ',')}
                </span>

                <button
                    type="button"
                    onClick={() => onBuy(gift)}
                    disabled={isSoldOut}
                    className={`
              flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors sm:w-auto sm:justify-start sm:gap-2 sm:px-4 sm:py-2 sm:text-sm
              ${isSoldOut
                            ? 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                            : 'bg-slate-900 text-white hover:bg-burgundy-700 dark:bg-white dark:text-slate-900 dark:hover:bg-burgundy-100'}
            `}
                >
                    <IoGiftOutline className="h-4 w-4 shrink-0" aria-hidden />
                    {isSoldOut ? 'Comprado' : 'Presentear'}
                </button>
            </div>
        </article>
    );
};

export default GiftCard;
