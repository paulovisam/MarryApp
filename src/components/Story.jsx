import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaRing } from 'react-icons/fa';

const Story = () => {
  const timeline = [
    {
      icon: FaCalendarAlt,
      color: 'burgundy',
      date: 'Março 2024',
      title: 'O Primeiro Encontro',
      description: 'Depois de um tempo conversando, nos decidicos encotrar no Texan Hamburger. O que começou como uma simples conversa se transformou em horas de risadas e conexão instantânea.'
    },
    {
      icon: FaMapMarkerAlt,
      color: 'royal',
      date: '15 de Junho 2024',
      title: 'O pedido de namoro',
      description: 'Paulo pediu a Sara em namoro no dia 15 de Junho de 2024 no Paris 6 Restaurante. Depois que ela disse SIM, fomos para um show de comédia muito divertido. Foi um momento muito especial e emocionante para nós. Até hoje ela não sabe como ele fez para guardar o porta aliança'
    },
    {
      icon: FaRing,
      color: 'burgundy',
      date: '15 de Novembro 2025',
      title: 'O Pedido',
      description: 'Em um dia ensolarado, cercados de amor e emoção, ele se ajoelhou e fez a pergunta que mudaria nossas vidas para sempre. E ela disse SIM!'
    }
  ];

  return (
    <section id="story" className="py-20 md:py-32 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Nossa História
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-burgundy-500 to-royal-500 mx-auto mb-6"></div>
            <p className="font-sans text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Uma jornada de amor, cumplicidade e sonhos compartilhados
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-burgundy-500 via-royal-500 to-burgundy-500 opacity-30"></div>
            
            <div className="space-y-16">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <div 
                    key={index}
                    className={`relative flex items-center ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} text-center`}>
                      <div className="mb-4">
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-sans font-medium ${
                          item.color === 'burgundy' 
                            ? 'bg-burgundy-900 text-burgundy-300 border border-burgundy-500 border-opacity-30' 
                            : 'bg-blue-950 text-royal-300 border border-royal-500 border-opacity-30'
                        }`}>
                          {item.date}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
                        {item.title}
                      </h3>
                      
                      <p className="font-sans text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-full md:w-2/12 flex justify-center my-8 md:my-0">
                      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 ${
                        item.color === 'burgundy' 
                          ? 'bg-burgundy-900 border-burgundy-500' 
                          : 'bg-blue-900 border-royal-500'
                      }`}>
                        <Icon className="text-white text-2xl" />
                        
                        {/* Pulse effect */}
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                          item.color === 'burgundy' 
                            ? 'bg-burgundy-500' 
                            : 'bg-royal-500'
                        }`}></div>
                      </div>
                    </div>
                    
                    {/* Empty space for alignment */}
                    <div className="hidden md:block md:w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Final message */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-slate-800 to-blue-950 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl border border-burgundy-500 border-opacity-30">
              <p className="font-script text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-burgundy-400 to-royal-400 mb-4">
                15 de Agosto 2026
              </p>
              <p className="font-sans text-lg md:text-xl text-gray-200 leading-relaxed">
                Estamos prontos para o próximo capítulo da nossa história, e queremos você ao nosso lado para celebrar esse momento tão especial!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FaHeart = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

export default Story;

