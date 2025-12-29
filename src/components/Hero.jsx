import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import monogramaImg from '../assets/monograma.png';
import homeImg from '../assets/home.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${homeImg})` }}
      ></div>
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-slate-900/50 to-gray-900/30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy-950 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-royal-950 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-burgundy-900 opacity-5 rounded-full blur-3xl"></div>
      
      {/* Overlay texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top text - inspired by EDENROSE design */}
          <div className="grid grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="text-right border-r border-burgundy-500 border-opacity-30 pr-8">
              <p className="font-sans text-xs md:text-sm text-gray-400 tracking-[0.25em] uppercase mb-2">
                Amor &
              </p>
              <p className="font-serif text-base md:text-lg text-white">
                Celebração
              </p>
            </div>
            <div className="text-left pl-8">
              <p className="font-sans text-xs md:text-sm text-gray-400 tracking-[0.25em] uppercase mb-2">
                Nosso
              </p>
              <p className="font-serif text-base md:text-lg text-white">
                Casamento
              </p>
            </div>
          </div>
          
          {/* Monogram */}
          <div className="flex justify-center mb-16 animate-fadeIn">
            <img 
              src={monogramaImg} 
              alt="Sara & Paulo Monograma" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          
          {/* Main content - Large typography like EDENROSE */}
          <div className="text-center space-y-12">
            <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-white mb-4 leading-none tracking-wider font-light">
              Paulo & Sara
            </h1>
            
            <div className="flex items-center justify-center space-x-8 py-4">
              <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent to-burgundy-500"></div>
              <div className="h-px w-24 md:w-32 bg-gradient-to-l from-transparent to-burgundy-500"></div>
            </div>
            
            {/* Bottom text */}
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto pt-8">
              <div className="text-right border-r border-royal-500 border-opacity-30 pr-8">
                <p className="font-sans text-xs md:text-sm text-gray-400 tracking-[0.25em] uppercase mb-2">
                  História Encantadora
                </p>
                <p className="font-serif text-base md:text-lg text-white">
                  15 de Agosto, 2026
                </p>
              </div>
              <div className="text-left pl-8">
                <p className="font-sans text-xs md:text-sm text-gray-400 tracking-[0.25em] uppercase mb-2">
                  Memórias
                </p>
                <p className="font-serif text-base md:text-lg text-white">
                  Para Sempre
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <a 
        href="#about" 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <FaChevronDown className="text-burgundy-400 text-2xl opacity-50 hover:opacity-100 transition-opacity" />
      </a>
    </section>
  );
};

export default Hero;

