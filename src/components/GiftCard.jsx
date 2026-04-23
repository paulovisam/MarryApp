import React from 'react';
import { IoGiftOutline } from 'react-icons/io5';
import LazyImage from './LazyImage';

const GiftCard = ({ gift, onBuy, onSelect }) => {
    const purchasedQty = Math.max(0, Number(gift.purchased_quantity) || 0);
    const totalQty = Math.max(0, Number(gift.total_quantity) || 0);
    const isSoldOut = totalQty > 0 && purchasedQty >= totalQty;
    const percent =
        totalQty > 0 ? Math.min((purchasedQty / totalQty) * 100, 100) : 0;
    const cotasText =
        totalQty > 0 ? `${purchasedQty}/${totalQty}` : `${purchasedQty}/—`;

    return (
        <article
            className={`
      group relative overflow-hidden rounded-2xl border bg-white shadow-lg transition-transform dark:bg-slate-800
      ${isSoldOut
                ? 'border-amber-200/90 ring-2 ring-amber-200/60 dark:border-amber-500/35 dark:ring-amber-400/25'
                : 'border-slate-100 hover:-translate-y-1 dark:border-slate-700'}
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
                        imgClassName={`object-cover transition-transform ${isSoldOut ? '' : 'group-hover:scale-105'}`}
                    />
                    {isSoldOut && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-400/35 via-rose-300/25 to-burgundy-500/30 dark:from-amber-500/25 dark:via-rose-500/20 dark:to-burgundy-600/25">
                            <span className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white shadow-lg sm:px-4 sm:text-sm">
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
                <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="shrink-0 text-xs font-bold tabular-nums text-burgundy-700 dark:text-burgundy-400 sm:text-lg">
                        R$ {Number(gift.price).toFixed(2).replace('.', ',')}
                    </span>
                    <p
                        className="text-[11px] font-normal tabular-nums leading-snug text-slate-500 dark:text-slate-400 sm:text-xs"
                        aria-label={`Cotas: ${cotasText.replace('/', ' de ')}`}
                    >
                        Cotas · {cotasText}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onBuy(gift)}
                    disabled={isSoldOut}
                    className={`
              flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors sm:w-auto sm:justify-start sm:gap-2 sm:px-4 sm:py-2 sm:text-sm
              ${isSoldOut
                            ? 'cursor-not-allowed border border-amber-300/80 bg-gradient-to-r from-amber-50 to-rose-50 text-amber-900 dark:border-amber-500/40 dark:from-amber-950/50 dark:to-rose-950/40 dark:text-amber-100'
                            : 'bg-slate-900 text-white hover:bg-burgundy-700 dark:bg-white dark:text-slate-900 dark:hover:bg-burgundy-100'}
            `}
                >
                    <IoGiftOutline className="h-4 w-4 shrink-0" aria-hidden />
                    {isSoldOut ? 'Obrigado!' : 'Presentear'}
                </button>
            </div>
        </article>
    );
};

export default GiftCard;
