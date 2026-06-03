import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoInformationCircle } from 'react-icons/io5';

const DURATION_MS = 15_000;
const FADE_OUT_MS = 1000;

function transitionPauseSegment(wasPaused, nowPaused, t, totalPausedRef, segStartRef) {
    if (!wasPaused && nowPaused) {
        segStartRef.current = t;
    } else if (wasPaused && !nowPaused) {
        if (segStartRef.current != null) {
            totalPausedRef.current += t - segStartRef.current;
            segStartRef.current = null;
        }
    }
}

/**
 * Card explicativo sobre cotas: fixo no rodapé (centro no mobile, direita no desktop),
 * com barra de tempo regressiva (pausa em hover ou ao pressionar), fade-out ao fechar.
 */
const CotasFloatingTip = () => {
    const [exiting, setExiting] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [progress, setProgress] = useState(100);
    const [pressTracked, setPressTracked] = useState(false);

    const hoverRef = useRef(false);
    const pressRef = useRef(false);
    const totalPausedRef = useRef(0);
    const pauseSegStartRef = useRef(null);

    const setHover = (v) => {
        const t = performance.now();
        const was = hoverRef.current || pressRef.current;
        hoverRef.current = v;
        const now = hoverRef.current || pressRef.current;
        transitionPauseSegment(was, now, t, totalPausedRef, pauseSegStartRef);
    };

    const setPress = (v) => {
        const t = performance.now();
        const was = hoverRef.current || pressRef.current;
        pressRef.current = v;
        const now = hoverRef.current || pressRef.current;
        transitionPauseSegment(was, now, t, totalPausedRef, pauseSegStartRef);
    };

    useEffect(() => {
        if (!pressTracked) return;
        const end = () => {
            const t = performance.now();
            const was = hoverRef.current || pressRef.current;
            pressRef.current = false;
            const now = hoverRef.current || pressRef.current;
            transitionPauseSegment(was, now, t, totalPausedRef, pauseSegStartRef);
            setPressTracked(false);
        };
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);
        return () => {
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
        };
    }, [pressTracked]);

    useEffect(() => {
        if (exiting) return;

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (reduceMotion) {
            let left = 100;
            const id = window.setInterval(() => {
                if (hoverRef.current || pressRef.current) {
                    return;
                }
                left -= 10;
                const next = Math.max(0, left);
                setProgress(next);
                if (next <= 0) {
                    window.clearInterval(id);
                    setExiting(true);
                }
            }, DURATION_MS / 10);
            return () => window.clearInterval(id);
        }

        const start = performance.now();
        let rafId;

        const loop = (now) => {
            let pauseTotal = totalPausedRef.current;
            if (pauseSegStartRef.current != null) {
                pauseTotal += now - pauseSegStartRef.current;
            }
            const elapsed = Math.max(0, now - start - pauseTotal);
            const p = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
            setProgress(p);
            if (p <= 0) {
                setExiting(true);
                return;
            }
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [exiting]);

    useEffect(() => {
        if (!exiting) return;
        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        const ms = reduceMotion ? 0 : FADE_OUT_MS;
        const id = window.setTimeout(() => setRemoved(true), ms);
        return () => window.clearTimeout(id);
    }, [exiting]);

    const onMouseEnter = () => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        setHover(true);
    };

    const onMouseLeave = () => {
        setHover(false);
    };

    const onPointerDown = (e) => {
        if (e.button > 0) return;
        setPress(true);
        setPressTracked(true);
    };

    if (removed) {
        return null;
    }

    return (
        <aside
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPointerDown={onPointerDown}
            className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[45] w-[min(calc(100vw-2rem),28rem)] max-h-[min(70vh,34rem)] -translate-x-1/2 origin-bottom select-none overflow-y-auto rounded-2xl border border-burgundy-200/90 bg-white/95 p-4 text-left shadow-lg backdrop-blur-sm dark:border-burgundy-900/40 dark:bg-slate-900/95 sm:p-5 md:left-auto md:right-6 md:origin-bottom-right md:translate-x-0 md:hover:z-[46] md:motion-safe:hover:scale-[1.015] md:motion-safe:hover:shadow-xl motion-safe:transition-[opacity,transform,box-shadow] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none ${
                exiting
                    ? 'pointer-events-none opacity-0'
                    : 'opacity-100'
            }`}
            aria-labelledby="cotas-floating-heading"
            role="region"
            aria-hidden={exiting}
        >
            <div
                className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Tempo até a dica fechar automaticamente"
            >
                <div
                    className="h-full rounded-full bg-burgundy-600 dark:bg-burgundy-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mb-2 flex items-start justify-between gap-2">
                <h3
                    id="cotas-floating-heading"
                    className="flex min-w-0 items-start gap-2 font-sans font-bold text-burgundy-800 dark:text-burgundy-300 sm:text-lg"
                >
                    <IoInformationCircle
                        className="mt-0.5 h-5 w-5 shrink-0 text-burgundy-600 dark:text-burgundy-400 sm:h-6 sm:w-6"
                        aria-hidden
                    />
                    <span>O que são cotas?</span>
                </h3>
                <button
                    type="button"
                    onClick={() => setExiting(true)}
                    disabled={exiting}
                    className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    aria-label="Fechar dica sobre cotas"
                >
                    <IoClose className="h-5 w-5" aria-hidden />
                </button>
            </div>
            <div className="space-y-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:space-y-3 sm:text-sm">
                <p>
                    Pensando em todo mundo poder participar do nosso chá de casa
                    nova, dividimos alguns presentes em cotas cada{' '}
                    <strong className="font-medium text-slate-800 dark:text-slate-200">
                        cota é um pedacinho do valor total.  
                    </strong>
                    
                </p>
                <p>
                    Você pode levar{' '}
                    <strong className="font-medium text-slate-800 dark:text-slate-200">
                        uma ou várias cotas
                    </strong>{' '}
                    do mesmo presente — na hora do pagamento é só escolher a
                    quantidade. Se quiser abraçar o presente com mais cotas, a
                    gente agradece de montão.
                </p>
            </div>
        </aside>
    );
};

export default CotasFloatingTip;
