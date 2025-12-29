import React from 'react';
import { FaHeart } from 'react-icons/fa';
import monogramaImg from '../assets/monograma.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 text-white py-16 border-t border-burgundy-500 border-opacity-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Monogram */}
          <div className="flex justify-center mb-8">
            <h3 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-none tracking-wider font-light">P | S</h3>
          </div>
          
          {/* Names */}
          <h3 className="font-script text-4xl md:text-5xl mb-6">
            Paulo & Sara
          </h3>
          
          {/* Date */}
          <p className="font-script text-xl md:text-2xl mb-8 text-gray-300">
            15 de Agosto, 2026
          </p>
          
          {/* Divider */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary-500 opacity-50"></div>
            <FaHeart className="text-xl text-secondary-500 opacity-70" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary-500 opacity-50"></div>
          </div>
          
          {/* Message */}
          <p className="font-sans text-sm md:text-base text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Obrigado por fazer parte da nossa história. Cada momento compartilhado com vocês 
            torna nosso amor ainda mais especial.
          </p>
          
          {/* Copyright */}
          <div className="pt-8 border-t border-burgundy-500 border-opacity-20">
            <p className="font-sans text-sm text-gray-400">
              © 2026 Sara & Paulo. Feito com muito amor e carinho.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

