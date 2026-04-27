import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import homeImg from '../assets/home.webp';
import homeMobileImg from '../assets/home_mobile.webp';
import { useHeroParallax } from '../hooks/useHomeParallax';
import { useAmbientAudio } from '../contexts/AmbientAudioContext';

const Hero = () => {
  const { ref: sectionRef, bgY, bgScale, contentY, blobY } = useHeroParallax();
  const { playAmbient } = useAmbientAudio();

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col items-stretch overflow-hidden md:min-h-screen md:flex md:items-center md:justify-center"
    >
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet={homeImg} />
        <motion.img
          src={homeMobileImg}
          alt=""
          fetchPriority="high"
          decoding="async"
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 h-[115%] w-full origin-center object-cover object-center will-change-transform"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-slate-900/50 to-gray-900/30" />

      <motion.div
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ y: blobY }}
        aria-hidden
      >
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-burgundy-950 opacity-10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-royal-950 opacity-10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy-900 opacity-5 blur-3xl" />
      </motion.div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

      <motion.div
        className="container relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 pt-[max(0.75rem,env(safe-area-inset-top))] will-change-transform sm:px-4 md:flex-none md:px-4 md:py-20 md:pb-10 md:pt-10"
        style={{ y: contentY }}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col md:block md:flex-none">
          {/* Mobile: topo da tela — monograma + Nosso / Amor */}
          <header className="shrink-0 space-y-3 px-1 pt-12 sm:space-y-4 sm:px-2 md:space-y-0 md:px-0">
            <div className="flex animate-fadeIn justify-center md:mb-4">
              <h3 className="font-serif text-4xl font-light leading-none tracking-wider text-white sm:text-5xl md:text-6xl lg:text-7xl">
                P | S
              </h3>
            </div>

            <div className="mx-auto flex max-w-4xl items-center justify-center md:mb-16">
              <div className="min-w-0 flex-1 pr-2 text-right sm:pr-4 md:pr-6">
                <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-gray-400 sm:mb-2 sm:text-xs sm:tracking-[0.25em] md:text-sm">
                  Nosso
                </p>
                <p className="font-serif text-sm text-white sm:text-base md:text-lg">
                  Celebração
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center px-1 sm:px-2">
                <div className="h-10 w-0.5 bg-gradient-to-b from-transparent to-secondary-500 opacity-60 sm:h-12 md:h-16 md:w-0.5" />
                <div className="h-10 w-0.5 bg-gradient-to-t from-transparent to-secondary-500 opacity-60 sm:h-12 md:h-16 md:w-0.5" />
              </div>
              <div className="min-w-0 flex-1 pl-2 text-left sm:pl-4 md:pl-6">
                <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-gray-400 sm:mb-2 sm:text-xs sm:tracking-[0.25em] md:text-sm">
                  Amor
                </p>
                <p className="font-serif text-sm text-white sm:text-base md:text-lg">
                  Casamento
                </p>
              </div>
            </div>
          </header>

          {/* Mobile: centro vertical; desktop: fluxo normal */}
          <div className="flex min-h-0 flex-1 flex-col justify-upwards pt-20 md:flex-none md:justify-start md:py-0">
            <h1 className="mx-auto max-w-[min(100%,24rem)] text-center font-serif text-[clamp(2.35rem,10.5vw,4rem)] font-light leading-[1.06] tracking-wider text-white sm:max-w-none sm:text-6xl sm:leading-none md:max-w-none md:pt-20 md:pb-32 md:text-8xl lg:text-9xl">
              <span className="block sm:inline">Paulo &</span>{' '}
              <span className="block sm:inline">Sara</span>
            </h1>
          </div>

          {/* Mobile: rodapé da tela — grid + CTA (margem + safe area + espaço do chevron) */}
          <div className="mt-auto flex w-full shrink-0 flex-col items-center gap-6 px-1 pb-[max(7.5rem,calc(env(safe-area-inset-bottom,0px)+5rem))] pt-2 sm:gap-7 sm:px-2 md:hidden">
            <div className="grid w-full grid-cols-2 gap-x-3 gap-y-1 sm:gap-x-6">
              <div className="min-w-0 text-right">
                <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-gray-400 sm:text-xs sm:tracking-[0.25em]">
                  História
                </p>
                <p className="font-serif text-sm leading-snug text-white sm:text-base">
                  15 de Agosto, 2026
                </p>
              </div>
              <div className="min-w-0 text-left">
                <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-gray-400 sm:text-xs sm:tracking-[0.25em]">
                  Memórias
                </p>
                <p className="font-serif text-sm leading-snug text-white sm:text-base">
                  Para Sempre
                </p>
              </div>
            </div>
            <a
              href="#details"
              onClick={() => playAmbient()}
              className="flex min-h-[48px] w-full max-w-sm items-center justify-center border border-white px-4 py-3.5 text-center font-serif text-[11px] tracking-[0.18em] text-white transition-all duration-300 active:bg-white/10 hover:bg-white hover:text-slate-900 sm:text-xs sm:tracking-widest"
            >
              CONFIRMAR PRESENÇA
            </a>
          </div>

          {/* Tablet+ : layout original em três colunas */}
          <div className="hidden items-center justify-center pt-6 pb-1 md:flex md:pt-8">
            <div className="min-w-0 flex-1 pr-4 text-right md:pr-6">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-gray-400 md:text-sm">
                História
              </p>
              <p className="font-serif text-base text-white md:text-lg">
                15 de Agosto, 2026
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center py-16">
              <div className="py-8">
                <a
                  href="#details"
                  onClick={() => playAmbient()}
                  className="inline-block border border-white px-8 py-3 font-serif tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-slate-900"
                >
                  CONFIRMAR PRESENÇA
                </a>
              </div>
            </div>
            <div className="min-w-0 flex-1 pl-4 text-left md:pl-6">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-gray-400 md:text-sm">
                Memórias
              </p>
              <p className="font-serif text-base text-white md:text-lg">
                Para Sempre
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-gray-950 to-transparent" />
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 flex justify-center px-3 sm:bottom-10 sm:px-4">
        <a
          href="#about"
          className="pointer-events-auto group flex min-h-[48px] flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-center outline-none transition-[color,opacity] focus-visible:ring-2 focus-visible:ring-champagne-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="Conheça nossa história — rolar para a seção sobre os noivos"
        >
          <span className="max-w-[16rem] font-sans text-[10px] pb-1 font-medium uppercase tracking-[0.22em] text-champagne-200/95 transition-colors group-hover:text-champagne-100 sm:text-[11px] sm:tracking-[0.26em]">
            Conheça nossa história
          </span>
          <FaChevronDown
            className="animate-bounce text-xl text-burgundy-400 opacity-60 transition-opacity motion-reduce:animate-none motion-reduce:opacity-80 group-hover:opacity-100 sm:text-2xl"
            aria-hidden
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
