import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaRing, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Importar todas as imagens
import encontro1 from '../assets/story/encontro_1.jpeg';
import encontro2 from '../assets/story/encontro_2.jpeg';
import encontro3 from '../assets/story/encontro_3.jpeg';
import encontro4 from '../assets/story/encontro_4.jpeg';
import pedido1 from '../assets/story/pedido_1.jpeg';
import pedido2 from '../assets/story/pedido_2.jpeg';
import pedido4 from '../assets/story/pedido_4.jpeg';
import pedido5 from '../assets/story/pedido_5.webp';
import noivado1 from '../assets/story/noivado_1.jpeg';
import noivado2 from '../assets/story/noivado_2.jpeg';
import noivado3 from '../assets/story/noivado_3.jpeg';
import noivado4 from '../assets/story/noivado_4.jpeg';

const Story = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentPhoto: '',
    allPhotos: [],
    currentIndex: 0,
    eventTitle: ''
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date('2026-08-15T16:00:00');
      const now = new Date();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  const openLightbox = (photo, photos, index, title) => {
    setLightbox({
      isOpen: true,
      currentPhoto: photo,
      allPhotos: photos,
      currentIndex: index,
      eventTitle: title
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      currentPhoto: '',
      allPhotos: [],
      currentIndex: 0,
      eventTitle: ''
    });
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next' 
      ? (lightbox.currentIndex + 1) % lightbox.allPhotos.length
      : (lightbox.currentIndex - 1 + lightbox.allPhotos.length) % lightbox.allPhotos.length;
    
    setLightbox({
      ...lightbox,
      currentIndex: newIndex,
      currentPhoto: lightbox.allPhotos[newIndex]
    });
  };
  const timeline = [
    {
      icon: FaCalendarAlt,
      color: 'burgundy',
      date: 'Março 2024',
      title: 'O Primeiro Encontro',
      description: 'O primeiro encontro aconteceu em uma hamburgueria, mas nem tudo saiu como o esperado. Enquanto o lugar pedia um bom hambúrguer, ela escolheu uma tortilha de quatro queijos, arrancando risadas e já mostrando que seria tudo, menos comum. Foi ali que se conheceram melhor, conversaram por horas e sentiram que havia algo diferente. Um verdadeiro amor à primeira vista, simples e cheio de conexão.',
      photos: [
        encontro3,
        encontro2,
        encontro1,
        encontro4
      ]
    },
    {
      icon: FaMapMarkerAlt,
      color: 'royal',
      date: '15 de Junho 2024',
      title: 'O Pedido de Namoro',
      description: 'Paulo pediu Sara em namoro no dia 15 de junho de 2024, no restaurante Paris 6. Um momento planejado com carinho, emoção e aquele friozinho bom no coração. Depois do tão esperado "SIM", a noite continuou em um show de comédia, leve, divertido e com muitas risadas, do jeitinho que marca a história deles. Até hoje, Sara ainda não descobriu como Paulo conseguiu esconder o porta-aliança… um mistério que virou parte da memória afetiva desse dia tão especial',
      photos: [
        pedido1,
        pedido2,
        pedido5,
        pedido4
      ]
    },
    {
      icon: FaRing,
      color: 'burgundy',
      date: '15 de Novembro 2025',
      title: 'O Pedido de Noivado',
      description: 'O pedido de noivado aconteceu no dia 15 de novembro de 2025 na Vila Barro Branco e foi mais do que uma surpresa: foi uma resposta e um cuidado de Deus. Paulo levou Sara a um lugar cheio de significado, preparado em silêncio, com muito amor e intenção. Ali, começaram oficialmente um novo capítulo da história deles. Sara foi completamente surpreendida e até hoje se pergunta como ele conseguiu esconder tantas surpresas. Logo depois, a família se reuniu para abençoar esse momento, confirmando que esse amor é cercado por fé, propósito e pessoas que caminham junto.',
      photos: [
        noivado1,
        noivado3,
        noivado2,
        noivado4
      ]
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
            {/* <div className="w-24 h-1 bg-gradient-to-r from-secondary-700 to-primary-500 mx-auto mb-6"></div> */}
            <p className="font-sans text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Uma jornada de amor, cumplicidade e sonhos compartilhados
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line - Desktop (center) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-burgundy-500 via-royal-400 to-burgundy-500 opacity-30"></div>
            
            {/* Vertical line - Mobile (left side) */}
            <div className="block md:hidden absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-burgundy-500 via-royal-400 to-burgundy-500 opacity-30"></div>
            
            <div className="space-y-16">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <div 
                    key={index}
                    className="relative flex flex-row md:items-center items-start"
                  >
                    {/* Mobile Layout: Icon on left, content on right stacked */}
                    <div className="md:hidden w-auto flex justify-center shrink-0">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-2 ${
                        item.color === 'burgundy' 
                          ? 'bg-burgundy-900 border-burgundy-500 border-opacity-30' 
                          : 'bg-blue-900 border-royal-500'
                      }`}>
                        <Icon className="text-white text-lg" />
                        
                        {/* Pulse effect */}
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                          item.color === 'burgundy' 
                            ? 'bg-burgundy-500' 
                            : 'bg-royal-500'
                        }`}></div>
                      </div>
                    </div>
                    
                    {/* Mobile Content Container */}
                    <div className="md:hidden flex-1 pl-6 flex flex-col gap-6">
                      {/* Content */}
                      <div className="w-full text-left">
                        <div className="mb-4">
                          <span className={`inline-block px-4 py-1 rounded-full text-sm font-sans font-medium ${
                            item.color === 'burgundy' 
                              ? 'bg-secondary-900 text-secondary-300 border border-secondary-500 border-opacity-30' 
                              : 'bg-blue-950 text-royal-300 border border-royal-500 border-opacity-30'
                          }`}>
                            {item.date}
                          </span>
                        </div>
                        
                        <h3 className="font-serif text-2xl text-beige-300 mb-3">
                          {item.title}
                        </h3>
                        
                        <p className="font-sans text-beige-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Photo Collage */}
                      <div className="w-full">
                        <div className="grid grid-cols-2 gap-2 max-w-sm">
                          {item.photos.map((photo, photoIndex) => (
                            <div 
                              key={photoIndex}
                              onClick={() => openLightbox(photo, item.photos, photoIndex, item.title)}
                              className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer ${
                                photoIndex === 0 ? 'row-span-2' : ''
                              }`}
                              style={{ aspectRatio: photoIndex === 0 ? '1/2' : '1/1' }}
                            >
                              <img 
                                src={photo} 
                                alt={`${item.title} - Foto ${photoIndex + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t ${
                                item.color === 'burgundy'
                                  ? 'from-burgundy-900/20 to-transparent'
                                  : 'from-royal-900/20 to-transparent'
                              }`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className={`hidden md:flex w-full items-center ${
                      isLeft ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      {/* Content */}
                      <div className={`w-5/12 ${isLeft ? 'text-right pr-12' : 'text-left pl-12'}`}>
                        <div className="mb-4">
                          <span className={`inline-block px-4 py-1 rounded-full text-sm font-sans font-medium ${
                            item.color === 'burgundy' 
                              ? 'bg-secondary-900 text-secondary-300 border border-secondary-500 border-opacity-30' 
                              : 'bg-blue-950 text-royal-300 border border-royal-500 border-opacity-30'
                          }`}>
                            {item.date}
                          </span>
                        </div>
                        
                        <h3 className="font-serif text-3xl text-beige-300 mb-3">
                          {item.title}
                        </h3>
                        
                        <p className="font-sans text-beige-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-2/12 flex justify-center shrink-0">
                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 ${
                          item.color === 'burgundy' 
                            ? 'bg-burgundy-900 border-burgundy-500 border-opacity-30' 
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
                      
                      {/* Photo Collage */}
                      <div className={`w-5/12 ${isLeft ? 'pl-12' : 'pr-12'}`}>
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                          {item.photos.map((photo, photoIndex) => (
                            <div 
                              key={photoIndex}
                              onClick={() => openLightbox(photo, item.photos, photoIndex, item.title)}
                              className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer ${
                                photoIndex === 0 ? 'row-span-2' : ''
                              }`}
                              style={{ aspectRatio: photoIndex === 0 ? '1/2' : '1/1' }}
                            >
                              <img 
                                src={photo} 
                                alt={`${item.title} - Foto ${photoIndex + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t ${
                                item.color === 'burgundy'
                                  ? 'from-burgundy-900/20 to-transparent'
                                  : 'from-royal-900/20 to-transparent'
                              }`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Final message */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl border border-primary-500 border-opacity-30">
              <p className="font-script text-4xl md:text-6xl bg-clip-text text-transparent bg-beige-400 mb-10 leading-normal pb-2">
                15 de Agosto 2026
              </p>
              
              {/* Countdown */}
              <div className="mb-6">
                <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg mx-auto">
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                    <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                      {timeLeft.days}
                    </div>
                    <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">
                      Dias
                    </div>
                  </div>
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                    <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                      {timeLeft.hours}
                    </div>
                    <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">
                      Horas
                    </div>
                  </div>
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                    <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                      {timeLeft.minutes}
                    </div>
                    <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">
                      Min
                    </div>
                  </div>
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 md:p-4 border border-beige-500 border-opacity-20">
                    <div className="font-script text-2xl md:text-3xl text-beige-300 font-bold">
                      {timeLeft.seconds}
                    </div>
                    <div className="font-sans text-xs md:text-sm text-beige-300 mt-1">
                      Seg
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="font-sans text-lg md:text-xl text-beige-300 leading-relaxed">
                Estamos prontos para o próximo capítulo da nossa história, e queremos você ao nosso lado para celebrar esse momento tão especial!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-burgundy-400 transition-colors duration-300"
            aria-label="Fechar"
          >
            <FaTimes className="text-3xl md:text-4xl" />
          </button>

          {/* Navigation Arrows */}
          {lightbox.allPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
                className="absolute left-4 z-50 text-white hover:text-burgundy-400 transition-colors duration-300 bg-black bg-opacity-50 rounded-full p-3 md:p-4"
                aria-label="Foto anterior"
              >
                <FaChevronLeft className="text-2xl md:text-3xl" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
                className="absolute right-4 z-50 text-white hover:text-burgundy-400 transition-colors duration-300 bg-black bg-opacity-50 rounded-full p-3 md:p-4"
                aria-label="Próxima foto"
              >
                <FaChevronRight className="text-2xl md:text-3xl" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Event Title */}
            <div className="absolute top-0 left-0 right-0 text-center py-4 bg-gradient-to-b from-black to-transparent">
              <h3 className="font-serif text-xl md:text-2xl text-white">
                {lightbox.eventTitle}
              </h3>
              <p className="font-sans text-sm text-gray-300 mt-1">
                Foto {lightbox.currentIndex + 1} de {lightbox.allPhotos.length}
              </p>
            </div>

            {/* Image */}
            <img 
              src={lightbox.currentPhoto}
              alt={`${lightbox.eventTitle} - Foto ${lightbox.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scaleIn"
            />
          </div>
        </div>
      )}
    </section>
  );
};

const FaHeart = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

export default Story;

