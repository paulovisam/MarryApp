import React from 'react';
import { FaHeart } from 'react-icons/fa';
import coupleImg from '../assets/couple.jpg';

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-primary-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-16">
            <FaHeart className="text-burgundy-400 text-3xl mx-auto mb-6 opacity-70" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-beige-300 mb-4">
              Sobre os Noivos
            </h2>
            {/* <div className="w-24 h-1 bg-gradient-to-r from-burgundy-500 to-royal-500 mx-auto"></div> */}
          </div>

          {/* Single Heart with Photo */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-burgundy-600 opacity-10 blur-2xl scale-110"></div>

              {/* Heart with image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80">
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
                    y="0" 
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
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-32 md:gap-18">
            {/* Paulo Description */}
            <div className="text-center md:text-right">
              <div className="space-y-4 text-beige-300 font-sans leading-relaxed">
                <p className="font-script text-3xl md:text-4xl text-primary-400 drop-shadow-lg whitespace-nowrap">Paulo</p>
                <p className="text-lg">
                  Ele é sério quando precisa ser, calculador nas decisões e super inteligente. Provedor, gentil e amoroso, demonstra seu carinho com atitudes firmes, responsabilidade (um pouco de Código e Excel) e muito cuidado com quem ama.
                </p>
              </div>
            </div>

            {/* Sara Description */}
            <div className="text-center md:text-left">
              <div className="space-y-4 text-beige-300 font-sans leading-relaxed">
                <p className="font-script text-3xl md:text-4xl text-secondary-400 drop-shadow-lg whitespace-nowrap">Sara</p>
                <p className="text-lg">
                  Ela é sensível, cuidadora e tem um coração que ama servir e acolher. Demonstra amor nos gestos simples, no cuidado constante e na forma leve de estar presente.
                </p>
              </div>
            </div>
          </div>

          {/* Together section */}
          <div className="mt-20 text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-8 md:p-12 shadow-xl border border-primary-500 border-opacity-30">
              <p className="font-sans text-lg md:text-xl text-beige-300 leading-relaxed italic">
                Eles acreditam que o amor se constrói nos detalhes do dia a dia, nas conversas sinceras, nas risadas inesperadas e com Deus no centro de tudo.
                Juntos, eles se completam com parceria e equilíbrio. Entre fé, amor, risadas e planos bem organizados, escolheram caminhar lado a lado, confiando que Deus é a base dessa história que agora começa um novo capítulo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

