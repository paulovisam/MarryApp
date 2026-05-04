import React, { useId, useState } from 'react';
import { IoChevronDown, IoLayersOutline } from 'react-icons/io5';

const ITEMS = [
    {
        id: 'o-que',
        title: 'O que são cotas?',
        body: (
            <>
                <p>
                    Alguns presentes da lista têm um valor total maior. Para que todo mundo
                    possa participar,{' '}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                        dividimos esse valor em cotas menores.
                    </strong>{' '}
                    Cada cota corresponde a uma parte desse montante — assim várias pessoas
                    podem somar até completar o presente.
                </p>
                <p className="mt-3">
                    <strong className="font-semibold text-slate-900 dark:text-white">
                        Você pode levar uma ou várias cotas
                    </strong>{' '}
                    do mesmo item: na hora do pagamento, é só escolher a quantidade.
                </p>
            </>
        ),
    },
    {
        id: 'por-que',
        title: 'Por que fazemos assim?',
        body: (
            <p>
                Queremos que amigos e família participem do jeito que couber no bolso — sem a
                pressão de arcar com um presente inteiro sozinho. As cotas deixam tudo mais
                acessível e, ao mesmo tempo, nos ajudam a montar a nossa casa nova com
                carinho de quem estiver por perto.
            </p>
        ),
    },
    {
        id: 'visivel',
        title: 'Como vejo isso na lista?',
        body: (
            <p>
                Nos cards dos presentes em cotas você encontra o preço por cota, quantas
                cotas ainda restam e, ao abrir o presente ou ir ao checkout, pode ajustar
                quantas cotas quer oferecer. Quando todas as cotas forem escolhidas, aquele
                item aparece como esgotado — é sinal de que o presente já foi coberto pela
                soma das contribuições.
            </p>
        ),
    },
];

/**
 * Bloco destacado sobre “cotas” na lista de presentes — acordeão acessível (um painel por vez).
 */
export default function CotasAccordion() {
    const baseId = useId();
    const [openKey, setOpenKey] = useState(ITEMS[0].id);

    return (
        <section
            className="relative mt-6 w-full rounded-2xl border-2 border-burgundy-400/70 bg-gradient-to-br from-burgundy-50 via-white to-amber-50/40 p-5 text-left shadow-lg shadow-burgundy-900/10 ring-1 ring-burgundy-200/60 dark:border-burgundy-600/55 dark:from-burgundy-950/50 dark:via-slate-900 dark:to-slate-950 dark:shadow-black/40 dark:ring-burgundy-900/40 sm:p-6"
            aria-labelledby={`${baseId}-heading`}
        >
            <div className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-burgundy-400/80 to-transparent dark:via-burgundy-500/60" />

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy-600 text-white shadow-md dark:bg-burgundy-500 dark:shadow-burgundy-900/40">
                        <IoLayersOutline className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-700 dark:text-burgundy-300">
                            Lista em cotas
                        </p>
                        <h3
                            id={`${baseId}-heading`}
                            className="font-sans font-semibold text-xl leading-tight text-slate-900 dark:text-white sm:text-2xl"
                        >
                            Entenda antes de escolher
                        </h3>
                    </div>
                </div>
                <p className="text-sm leading-snug text-slate-600 dark:text-slate-400 sm:max-w-xs sm:text-right">
                    Ideia rápida:{' '}
                    <strong className="font-medium text-slate-800 dark:text-slate-200">
                        cada cota é um pedacinho do valor do presente
                    </strong>
                    .
                </p>
            </div>

            <div className="divide-y divide-burgundy-200/70 rounded-xl border border-burgundy-200/80 bg-white/85 dark:divide-burgundy-900/60 dark:border-burgundy-900/50 dark:bg-slate-900/70">
                {ITEMS.map((item, index) => {
                    const isOpen = openKey === item.id;
                    const panelId = `${baseId}-panel-${item.id}`;
                    const headerId = `${baseId}-header-${item.id}`;

                    return (
                        <div key={item.id} className="first:rounded-t-xl last:rounded-b-xl">
                            <h4 className="m-0 text-base font-semibold sm:text-lg" id={headerId}>
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() =>
                                        setOpenKey((prev) => (prev === item.id ? '' : item.id))
                                    }
                                    className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-burgundy-50/80 dark:hover:bg-burgundy-950/35 sm:px-5 sm:py-[1.125rem]"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burgundy-100 text-xs font-bold text-burgundy-900 dark:bg-burgundy-900/50 dark:text-burgundy-100">
                                        {index + 1}
                                    </span>
                                    <span className="min-w-0 flex-1 font-sans text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                                        {item.title}
                                    </span>
                                    <IoChevronDown
                                        className={`h-6 w-6 shrink-0 text-burgundy-600 transition-transform motion-reduce:transition-none dark:text-burgundy-400 ${isOpen ? 'rotate-180' : ''}`}
                                        aria-hidden
                                    />
                                </button>
                            </h4>
                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={headerId}
                                hidden={!isOpen}
                                className={isOpen ? 'block' : 'hidden'}
                            >
                                <div className="border-t border-burgundy-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-700 dark:border-burgundy-900/50 dark:text-slate-300 sm:px-5 sm:pb-5 sm:text-[0.9375rem]">
                                    {item.body}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
