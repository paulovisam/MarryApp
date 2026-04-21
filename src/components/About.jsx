import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import coupleImg from '../assets/couple.webp';
import { useAboutParallax } from '../hooks/useHomeParallax';
import ScrollReveal from './ScrollReveal';

const About = () => {
  const [heartPhotoReady, setHeartPhotoReady] = useState(false);
  const { ref: sectionRef, heartY, quoteY } = useAboutParallax();

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeartPhotoReady(true);
    img.onerror = () => setHeartPhotoReady(true);
    img.src = coupleImg;
  }, []);
  return (
    <section
      id="about"
      ref={sectionRef}
      className="overflow-hidden bg-gradient-to-b from-gray-950 to-primary-800 py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <ScrollReveal className="text-center mb-16">
            <FaHeart className="text-burgundy-400 text-3xl mx-auto mb-6 opacity-70" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-beige-300 mb-4">
              Sobre os Noivos
            </h2>
            {/* <div className="w-24 h-1 bg-gradient-to-r from-burgundy-500 to-royal-500 mx-auto"></div> */}
          </ScrollReveal>

          {/* Single Heart with Photo */}
          <ScrollReveal className="flex justify-center">
            <motion.div
              className="flex justify-center will-change-transform"
              style={{ y: heartY }}
            >
              <div className="relative">
              {/* Glow effect */}
                <div className="absolute inset-0 bg-burgundy-600 opacity-10 blur-2xl scale-110"></div>

                {/* Heart with image */}
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  {!heartPhotoReady && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-slate-900/60">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-beige-500/25 border-t-beige-300" />
                    </div>
                  )}
                  <svg className="w-full h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <clipPath id="heartClip">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </clipPath>
                    </defs>
                    
                    {/* Image with heart clip */}
                    <image 
                      href={coupleImg}
                      x="2"
                      y="2" 
                      width="20" 
                      height="20"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#heartClip)"
                    />
                    
                    {/* Heart Border */}
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="none"
                      stroke="rgb(150 0 24)"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-32 md:gap-18">
            {/* Paulo Description */}
            <ScrollReveal className="text-center md:text-right" from="left" delay={0.05}>
              <div className="space-y-4 text-beige-300 font-sans leading-relaxed">
                <p className="font-script text-3xl md:text-4xl text-primary-400 drop-shadow-lg whitespace-nowrap">Paulo</p>
                <p className="text-lg">
                  Ele é sério quando precisa ser, calculador nas decisões e inteligente. Provedor, gentil e amoroso, demonstra seu carinho com atitudes firmes, responsabilidade (um pouco de Código e Excel) e muito cuidado com quem ama.
                </p>
              </div>
            </ScrollReveal>

            {/* Sara Description */}
            <ScrollReveal className="text-center md:text-left" from="right" delay={0.1}>
              <div className="space-y-4 text-beige-300 font-sans leading-relaxed">
                <p className="font-script text-3xl md:text-4xl text-secondary-400 drop-shadow-lg whitespace-nowrap">Sara</p>
                <p className="text-lg">
                  Ela é sensível, cuidadora e tem um coração que ama servir e acolher. Demonstra amor nos gestos simples, no cuidado constante e na forma leve de estar presente.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Together section */}
          <ScrollReveal className="mx-auto mt-20 max-w-3xl text-center">
            <motion.div
              className="will-change-transform"
              style={{ y: quoteY }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg md:p-12">
                {/* Glass effect gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary-500/10 pointer-events-none"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <p className="font-sans text-lg md:text-xl text-beige-200 leading-relaxed italic">
                    Nós acreditamos que o amor se constrói no dia a dia, nas conversas sinceras, no cuidado e na presença um do outro, com Deus no centro de tudo. Seguimos juntos, com parceria e equilíbrio, fazendo planos e escolhendo, todos os dias, caminhar lado a lado. Com fé, confiamos que é Deus quem sustenta nossa história e conduz cada passo do que estamos construindo juntos.
                  </p>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;

