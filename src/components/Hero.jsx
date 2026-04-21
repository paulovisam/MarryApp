import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import homeImg from '../assets/home.webp';
import { useHeroParallax } from '../hooks/useHomeParallax';

const Hero = () => {
  const { ref: sectionRef, bgY, bgScale, contentY, blobY } = useHeroParallax();

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.img
        src={homeImg}
        alt=""
        fetchPriority="high"
        decoding="async"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 h-[115%] w-full origin-center object-cover object-center will-change-transform"
      />

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
        className="container relative z-10 mx-auto px-4 py-20 will-change-transform"
        style={{ y: contentY }}
      >
        <div className="">
          <div className="mb-4 flex animate-fadeIn justify-center">
            <h3 className="mb-4 font-serif text-5xl font-light leading-none tracking-wider text-white md:text-6xl lg:text-7xl">
              P | S
            </h3>
          </div>

          <div className="mx-auto mb-16 flex max-w-4xl items-center justify-center">
            <div className="flex-1 pr-6 text-right">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-gray-400 md:text-sm">
                Nosso
              </p>
              <p className="font-serif text-base text-white md:text-lg">
                Celebração
              </p>
            </div>
            <div className="">
              <div className="h-16 w-[2px] bg-gradient-to-b from-transparent to-secondary-500 opacity-50" />
              <div className="h-16 w-[2px] bg-gradient-to-t from-transparent to-secondary-500 opacity-50" />
            </div>
            <div className="flex-1 pl-6 text-left">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-gray-400 md:text-sm">
                Amor
              </p>
              <p className="font-serif text-base text-white md:text-lg">
                Casamento
              </p>
            </div>
          </div>

          <div className="space-y-12 text-center">
            <h1 className="pb-52 font-serif text-7xl font-light leading-none tracking-wider text-white md:text-8xl lg:text-9xl">
              Paulo & Sara
            </h1>
          </div>

          <div className="flex items-center justify-center pt-8">
            <div className="flex-1 pr-6 text-right">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-gray-400 md:text-sm">
                História
              </p>
              <p className="font-serif text-base text-white md:text-lg">
                15 de Agosto, 2026
              </p>
            </div>
            <div className="">
              <div className="h-16 w-[2px] bg-gradient-to-b from-transparent to-primary-500 opacity-50" />

              <div className="py-8">
                <a
                  href="#confirmar-presenca"
                  className="inline-block border border-white px-8 py-3 font-serif tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-slate-900"
                >
                  CONFIRMAR PRESENÇA
                </a>
              </div>

              <div className="h-16 w-[2px] bg-gradient-to-t from-transparent to-primary-500 opacity-50" />
            </div>
            <div className="flex-1 pl-6 text-left">
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
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        aria-label="Rolar para a seção sobre os noivos"
      >
        <FaChevronDown className="text-2xl text-burgundy-400 opacity-50 transition-opacity hover:opacity-100" />
      </a>
    </section>
  );
};

export default Hero;
