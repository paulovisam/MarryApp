import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer id="rsvp" className="bg-[#F9F8F6] pt-32 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <h2 className="text-6xl md:text-8xl font-serif text-stone-900 mb-12">
            Will you join us?
          </h2>
          <button className="group relative px-12 py-5 bg-stone-900 text-[#F9F8F6] overflow-hidden">
            <span className="relative z-10 text-sm tracking-[0.3em] uppercase font-bold">
              RSVP Now
            </span>
            <div className="absolute inset-0 bg-emerald-950 transform scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </button>
        </motion.div>

        <div className="w-full h-[1px] bg-stone-200 mb-12" />

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 text-stone-500 text-sm uppercase tracking-widest">
          <p>© 2026 PAULO & MARIA</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-emerald-800 transition-colors">Registry</a>
            <a href="#" className="hover:text-emerald-800 transition-colors">Travel</a>
            <a href="#" className="hover:text-emerald-800 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
