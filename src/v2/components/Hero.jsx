import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[120vh] min-h-[900px] flex items-center justify-center overflow-hidden bg-[#F9F8F6] pt-24"
    >
      {/* Background Image Layer */}
      <motion.div 
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 z-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-stone-900/20 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
          alt="Wedding scenery"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Typography Layer */}
      <motion.div 
        style={{ y: y2 }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 overflow-hidden"
        >
          <span className="block text-sm md:text-base tracking-[0.3em] uppercase text-[#F9F8F6] font-medium mb-4">
            We are getting married
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[10rem] lg:text-[12rem] leading-[0.8] font-serif text-[#F9F8F6] tracking-tighter"
        >
          <span className="block">PAULO</span>
          <span className="block italic font-light text-emerald-400/80">&</span>
          <span className="block">MARIA</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex flex-col items-center text-[#F9F8F6]"
        >
          <span className="text-xs tracking-[0.2em] uppercase mb-4">Scroll to discover</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#F9F8F6] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
