import React from 'react';
import { FaHeart } from 'react-icons/fa';
import saraImg from '../assets/sara.jpg';
import pauloImg from '../assets/paulo.png';

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-slate-900 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-16">
            <FaHeart className="text-burgundy-400 text-3xl mx-auto mb-6 opacity-70" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Sobre os Noivos
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-burgundy-500 to-royal-500 mx-auto"></div>
          </div>
          
          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Noiva */}
            <div className="text-center md:text-right group">
              <div className="mb-8 relative inline-block">
                <div className="absolute -inset-3 bg-burgundy-500 opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-burgundy-500 border-opacity-40 shadow-xl">
                  <img 
                    src={saraImg} 
                    alt="Sara" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <h3 className="font-script text-5xl md:text-6xl text-burgundy-400 mb-4">
                Sara
              </h3>
              
              <div className="space-y-4 text-gray-300 font-sans leading-relaxed">
                <p className="text-lg">
                  Designer apaixonada por arte e beleza. Encontra inspiração nos pequenos detalhes da vida e acredita que o amor verdadeiro está nos gestos mais simples.
                </p>
                <p className="italic text-burgundy-300">
                  "O amor é a poesia dos sentidos."
                </p>
              </div>
            </div>
            
            {/* Noivo */}
            <div className="text-center md:text-left group">
              <div className="mb-8 relative inline-block">
                <div className="absolute -inset-3 bg-royal-500 opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-royal-500 border-opacity-40 shadow-xl">
                  <img 
                    src={pauloImg} 
                    alt="Paulo" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <h3 className="font-script text-5xl md:text-6xl text-royal-400 mb-4">
                Paulo
              </h3>
              
              <div className="space-y-4 text-gray-300 font-sans leading-relaxed">
                <p className="text-lg">
                  Engenheiro com coração de poeta. Ama aventuras ao ar livre e acredita que a melhor parte da vida é compartilhar momentos especiais com quem amamos.
                </p>
                <p className="italic text-royal-300">
                  "O amor não se vê com os olhos, mas com o coração."
                </p>
              </div>
            </div>
          </div>
          
          {/* Together section */}
          <div className="mt-20 text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800 to-blue-950 rounded-2xl p-8 md:p-12 shadow-xl border border-burgundy-500 border-opacity-20">
              <p className="font-sans text-lg md:text-xl text-gray-200 leading-relaxed italic">
                Dois corações que se encontraram e decidiram escrever juntos a mais bela história de amor. Cada dia ao lado um do outro é uma nova página repleta de felicidade, cumplicidade e sonhos compartilhados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

