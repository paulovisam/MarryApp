import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useReducedMotion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

/** Dourado e bege — alinhado à paleta do site (celebração discreta). */
const CONFIRMAR_PRESENCA_CONFETTI_COLORS = [
  '#B8942E',
  '#C9A227',
  '#D4AF37',
  '#E6C65C',
  '#E8DCC8',
  '#E0D0BA',
  '#D4BE9F',
  '#F2E8D5',
];

function fireConfirmarPresencaConfetti() {
  const base = {
    colors: CONFIRMAR_PRESENCA_CONFETTI_COLORS,
    ticks: 260,
    gravity: 0.88,
    scalar: 0.92,
    drift: 0.04,
    zIndex: 120,
  };

  confetti({
    ...base,
    angle: 125,
    particleCount: 88,
    spread: 100,
    startVelocity: 40,
    origin: { x: 0.25, y: 0.42 },
  });
  confetti({
    ...base,
    angle: 60,
    particleCount: 88,
    spread: 100,
    startVelocity: 40,
    origin: { x: 0.75, y: 0.42 },
  });
  window.setTimeout(() => {
    confetti({
      ...base,
      particleCount: 100,
      spread: 100,
      startVelocity: 34,
      origin: { x: 0.5, y: 0.2 },
    });
  }, 200);
}

/**
 * Card com countdown e CTA — âncora #confirmar-presenca (Hero etc.).
 * Confete dourado/bege ao entrar na viewport (uma vez), exceto com prefers-reduced-motion.
 */
export default function ConfirmarPresencaCard({ timeLeft }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const confirmarPresencaRef = useRef(null);
  const confettiPresencaFired = useRef(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const el = confirmarPresencaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || confettiPresencaFired.current) return;
        confettiPresencaFired.current = true;
        fireConfirmarPresencaConfetti();
        observer.disconnect();
      },
      { threshold: 0.32, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      id="confirmar-presenca"
      ref={confirmarPresencaRef}
      className="mt-20 scroll-mt-20 text-center md:scroll-mt-24"
    >
      <ScrollReveal className="inline-block max-w-full">
        <div className="inline-block bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl border border-primary-500 border-opacity-30">
          <p className="font-script text-4xl md:text-6xl bg-clip-text text-transparent bg-beige-400 mb-10 leading-normal pb-2">
            15 de Agosto 2026
          </p>

          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-lg mx-auto">
              <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                  {timeLeft.months}
                </div>
                <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">Meses</div>
              </div>
              <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                  {timeLeft.days}
                </div>
                <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">Dias</div>
              </div>
              <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                  {timeLeft.hours}
                </div>
                <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">Horas</div>
              </div>
              <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                  {timeLeft.minutes}
                </div>
                <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">Min</div>
              </div>
            </div>
          </div>

          <p className="font-sans text-lg md:text-xl text-beige-300 leading-relaxed">
            Estamos prontos para o próximo capítulo da nossa história, e queremos você ao nosso lado para
            celebrar esse momento tão especial!
          </p>

          <button
            type="button"
            onClick={() => navigate('/convite')}
            className="mt-8 px-8 py-4 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-full font-serif text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-slow"
          >
            Confirmar Presença
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}
