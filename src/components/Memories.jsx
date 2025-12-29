import React from 'react';
import { FaCamera, FaQuoteLeft } from 'react-icons/fa';

const Memories = () => {
  const memories = [
    {
      type: 'photo',
      title: 'Primeira Viagem',
      description: 'Praia paradisíaca, 2019',
      image: '/src/assets/story/encontro_1.jpeg'
    },
    {
      type: 'photo',
      title: 'Aniversário dela',
      description: 'Surpresa inesquecível',
      image: '/src/assets/story/encontro_2.jpeg'
    },
    {
      type: 'photo',
      title: 'Nosso Lar',
      description: 'Primeiro apartamento juntos',
      image: '/src/assets/casa.jpeg'
    },
    {
      type: 'photo',
      title: 'Aventura nas Montanhas',
      description: 'Trilha memorável',
      image: '/src/assets/story/pedido_3.jpeg'
    },
    {
      type: 'photo',
      title: 'Jantar Especial',
      description: 'Restaurante favorito',
      image: '/src/assets/story/noivado_1.jpeg'
    },
    {
      type: 'photo',
      title: 'O Grande Dia',
      description: 'O pedido de casamento',
      image: '/src/assets/story/noivado_2.jpeg'
    }
  ];

  return (
    <section id="memories" className="py-20 md:py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-16">
            <FaCamera className="text-royal-400 text-3xl mx-auto mb-6 opacity-70" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Nossas Lembranças
            </h2>
            <p className="font-sans text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Momentos especiais que marcaram nossa jornada juntos
            </p>
          </div>
          
          {/* Photo grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {memories.map((memory, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="aspect-square relative overflow-hidden shadow-md">
                  <img 
                    src={memory.image} 
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-700 via-primary-700/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      <h3 className="font-serif text-xl mb-1">{memory.title}</h3>
                      <p className="font-sans text-sm opacity-90">{memory.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="mt-20 text-center">
            <div className="inline-block relative rounded-2xl p-[2px] overflow-hidden">
              {/* Animated gradient border - larger rotating background */}
              <div 
                className="absolute -inset-[100%] animate-gradient-rotate"
                style={{
                  background: 'conic-gradient(from 0deg, #960018, #0b1c2d, #960018, #0b1c2d, #960018)'
                }}>
              </div>
              
              {/* Content - stays static */}
              <div className="relative bg-primary-700 rounded-xl px-8 md:px-12 py-8 z-10">
                <p className="font-sans text-lg md:text-xl text-beige-200 mb-4">
                  Estamos criando novas memórias a cada dia
                </p>
                <p className="font-script text-3xl md:text-4xl bg-clip-text text-transparent bg-beige-300">
                  E você faz parte dessa história!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Memories;

