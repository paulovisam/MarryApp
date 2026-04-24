import React, { useCallback, useEffect, useId, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, useReducedMotion } from 'framer-motion';
import {
    IoChatbubbleEllipses,
    IoCheckmarkCircle,
    IoClose,
    IoCopyOutline,
    IoHeart,
    IoMailOutline,
    IoSparkles,
} from 'react-icons/io5';

const CONFETTI_COLORS = [
    '#881337',
    '#9f1239',
    '#be123c',
    '#f59e0b',
    '#fcd34d',
    '#fef9c3',
    '#fda4af',
];

function fireSuccessConfetti() {
    const base = {
        colors: CONFETTI_COLORS,
        ticks: 220,
        gravity: 1.05,
        scalar: 0.95,
        zIndex: 9999,
    };

    confetti({
        ...base,
        particleCount: 85,
        spread: 64,
        startVelocity: 38,
        origin: { x: 0.15, y: 0.7 },
    });
    confetti({
        ...base,
        particleCount: 85,
        spread: 64,
        startVelocity: 38,
        origin: { x: 0.85, y: 0.7 },
    });

    return window.setTimeout(() => {
        confetti({
            ...base,
            particleCount: 100,
            spread: 100,
            startVelocity: 32,
            origin: { x: 0.5, y: 0.45 },
        });
    }, 220);
}

function normalizeWhatsAppNumber(raw) {
    if (!raw || typeof raw !== 'string') return '';
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('55')) return digits;
    if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
    return digits;
}

/**
 * Celebração pós-pagamento na lista de presentes (?status=success).
 * Recado aos noivos: WhatsApp (VITE_NOIVOS_WHATSAPP), e-mail (VITE_NOIVOS_EMAIL) ou copiar texto.
 */
export default function PaymentSuccessCelebration({ onDismiss }) {
    const reduceMotion = useReducedMotion();
    const messageFieldId = useId();

    useEffect(() => {
        if (reduceMotion) return;
        const lateBurst = fireSuccessConfetti();
        return () => window.clearTimeout(lateBurst);
    }, [reduceMotion]);
    const [recadoOpen, setRecadoOpen] = useState(false);
    const [recadoText, setRecadoText] = useState('');
    const [copyFeedback, setCopyFeedback] = useState(false);

    const waDigits = normalizeWhatsAppNumber(
        import.meta.env.VITE_NOIVOS_WHATSAPP || ''
    );
    const noivosEmail = (import.meta.env.VITE_NOIVOS_EMAIL || '').trim();

    const buildOutgoingMessage = useCallback(() => {
        const body = recadoText.trim();
        const fallback =
            'Acabei de contribuir com um presente pela lista. Muita felicidade ao casal!';
        return body || fallback;
    }, [recadoText]);

    const closeRecado = useCallback(() => {
        setRecadoOpen(false);
        setCopyFeedback(false);
    }, []);

    useEffect(() => {
        if (!recadoOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeRecado();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [recadoOpen, closeRecado]);

    const handleSendRecado = () => {
        const text = buildOutgoingMessage();

        if (waDigits) {
            const url = `https://wa.me/${waDigits}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            closeRecado();
            return;
        }

        if (noivosEmail) {
            const subject = encodeURIComponent(
                'Recado — presente na lista de casamento'
            );
            const body = encodeURIComponent(text);
            window.location.href = `mailto:${noivosEmail}?subject=${subject}&body=${body}`;
            closeRecado();
            return;
        }

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                setCopyFeedback(true);
                window.setTimeout(() => setCopyFeedback(false), 3500);
            });
        }
    };

    const sendLabel = waDigits
        ? 'Enviar pelo WhatsApp'
        : noivosEmail
          ? 'Enviar por e-mail'
          : 'Copiar mensagem';

    const SendIcon = waDigits
        ? IoChatbubbleEllipses
        : noivosEmail
          ? IoMailOutline
          : IoCopyOutline;

    return (
        <>
            <motion.div
                role="status"
                aria-live="polite"
                aria-label="Pagamento confirmado"
                initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0, scale: 1 }}
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : {
                              type: 'spring',
                              stiffness: 380,
                              damping: 28,
                              mass: 0.9,
                          }
                }
                className="relative mb-10 overflow-hidden rounded-2xl border border-burgundy-200/80 bg-gradient-to-br from-white via-rose-50/90 to-amber-50/40 shadow-lg shadow-burgundy-900/5 dark:border-burgundy-800/60 dark:from-slate-900 dark:via-slate-900 dark:to-burgundy-950/40 dark:shadow-black/20"
            >
                <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-burgundy-400/15 blur-2xl dark:bg-burgundy-500/10"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-amber-200/25 blur-2xl dark:bg-amber-900/15"
                    aria-hidden
                />

                <div className="relative px-5 py-6 sm:px-8 sm:py-8">
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/80 hover:text-slate-800 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
                        aria-label="Fechar mensagem de agradecimento"
                    >
                        <IoClose className="h-6 w-6" aria-hidden />
                    </button>

                    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
                        <div className="relative mb-4 flex shrink-0 sm:mb-0">
                            <motion.div
                                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-burgundy-600 text-white shadow-md dark:bg-burgundy-500"
                                initial={reduceMotion ? false : { scale: 0.85 }}
                                animate={reduceMotion ? false : { scale: 1 }}
                                transition={
                                    reduceMotion
                                        ? { duration: 0 }
                                        : {
                                              delay: 0.12,
                                              type: 'spring',
                                              stiffness: 400,
                                              damping: 18,
                                          }
                                }
                            >
                                <IoCheckmarkCircle
                                    className="h-9 w-9"
                                    aria-hidden
                                />
                            </motion.div>
                            <IoSparkles
                                className="absolute -right-1 -top-1 h-6 w-6 text-amber-500 dark:text-amber-400"
                                aria-hidden
                            />
                        </div>

                        <div className="min-w-0 flex-1 space-y-3 pr-8 sm:pr-10">
                            <p className="inline-flex items-center justify-center gap-1.5 text-sm font-medium uppercase tracking-wide text-burgundy-700 dark:text-burgundy-300 sm:justify-start">
                                <IoHeart
                                    className="h-4 w-4 text-burgundy-600 dark:text-burgundy-400"
                                    aria-hidden
                                />
                                Presente recebido
                            </p>
                            <h2 className="font-serif text-2xl leading-tight text-slate-900 dark:text-white sm:text-3xl">
                                Obrigado pelo carinho!
                            </h2>
                            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                Seu presente significa muito para nós. É um
                                gesto que aquece o coração e nos deixa ainda
                                mais felizes.
                            </p>
                            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                                <button
                                    type="button"
                                    onClick={() => setRecadoOpen(true)}
                                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-burgundy-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-burgundy-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                                >
                                    <IoChatbubbleEllipses
                                        className="h-5 w-5 shrink-0"
                                        aria-hidden
                                    />
                                    Enviar recado aos noivos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {recadoOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
                    role="presentation"
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                        aria-label="Fechar janela de recado"
                        onClick={closeRecado}
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${messageFieldId}-title`}
                        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6"
                    >
                        <button
                            type="button"
                            onClick={closeRecado}
                            className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            aria-label="Fechar"
                        >
                            <IoClose className="h-6 w-6" aria-hidden />
                        </button>
                        <h3
                            id={`${messageFieldId}-title`}
                            className="pr-10 font-serif text-xl text-slate-900 dark:text-white"
                        >
                            Um recado para os noivos
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Escreva algo especial (opcional). Em seguida
                            enviamos pelo canal configurado no site.
                        </p>
                        <label
                            htmlFor={messageFieldId}
                            className="mt-4 block text-left text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Sua mensagem
                        </label>
                        <textarea
                            id={messageFieldId}
                            value={recadoText}
                            onChange={(e) => setRecadoText(e.target.value)}
                            rows={4}
                            maxLength={2000}
                            placeholder="Ex.: Estamos muito felizes por vocês! Beijos…"
                            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                        />
                        <p className="mt-1 text-right text-xs text-slate-500">
                            {recadoText.length}/2000
                        </p>
                        {!waDigits && !noivosEmail && (
                            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                                Nenhum WhatsApp ou e-mail configurado: ao
                                enviar, a mensagem será copiada para você colar
                                onde quiser.
                            </p>
                        )}
                        {copyFeedback && (
                            <p
                                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400"
                                role="status"
                            >
                                <IoCheckmarkCircle
                                    className="h-5 w-5 shrink-0"
                                    aria-hidden
                                />
                                Mensagem copiada!
                            </p>
                        )}
                        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeRecado}
                                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSendRecado}
                                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-burgundy-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-burgundy-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            >
                                <SendIcon className="h-5 w-5 shrink-0" aria-hidden />
                                {sendLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
