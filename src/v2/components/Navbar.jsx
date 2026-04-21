import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-[#F9F8F6]/90 backdrop-blur-md border-b border-stone-200' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          <a href="#" className="text-xl font-serif tracking-widest uppercase">
            P & M
          </a>
          
          <div className="hidden md:flex items-center gap-12 text-sm tracking-widest uppercase font-medium">
            <a href="#story" className="hover:text-emerald-800 transition-colors">Our Story</a>
            <a href="#details" className="hover:text-emerald-800 transition-colors">The Details</a>
            <a href="#rsvp" className="px-6 py-3 bg-stone-900 text-[#F9F8F6] hover:bg-emerald-950 transition-colors">
              RSVP
            </a>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-stone-900 text-[#F9F8F6] flex flex-col justify-center items-center"
          >
            <button 
              className="absolute top-8 right-6 md:right-12 p-2"
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center gap-8 text-3xl font-serif tracking-widest uppercase">
              <a href="#story" onClick={() => setIsOpen(false)} className="hover:text-emerald-400 transition-colors">Our Story</a>
              <a href="#details" onClick={() => setIsOpen(false)} className="hover:text-emerald-400 transition-colors">The Details</a>
              <a href="#rsvp" onClick={() => setIsOpen(false)} className="hover:text-emerald-400 transition-colors">RSVP</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
