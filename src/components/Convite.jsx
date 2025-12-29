import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaGift, FaArrowLeft } from 'react-icons/fa';

const Convite = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isPresent, setIsPresent] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Auto-avançar da tela de splash após 3 segundos
  useEffect(() => {
    if (currentScreen === 0) {
      const timer = setTimeout(() => {
        setCurrentScreen(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Detectar duplo clique no toggle
  useEffect(() => {
    if (clickCount === 2) {
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setClickCount(0);
      }, 2000);
    }
  }, [clickCount]);

  const handleToggleClick = () => {
    setIsPresent(!isPresent);
    setClickCount(prev => prev + 1);
    
    // Resetar contador após 500ms se não houver segundo clique
    setTimeout(() => {
      if (clickCount < 2) {
        setClickCount(0);
      }
    }, 500);
  };

  const openMap = () => {
    window.open('https://maps.google.com/?q=R.+Sete,+313+-+Residencial+2,+Maracanaú+-+CE,+61913-325', '_blank');
  };

  // Tela de Splash
  const SplashScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex items-center justify-center">
      {/* Padrão de folhagens */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBDMTAgMTAgMTUgMCAyNSAwUzQwIDEwIDUwIDEwIDYwIDAgNzAgMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
      </div>

      {/* Folhagens decorativas */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-float">
          <path d="M100,20 Q120,40 100,60 Q80,40 100,20" fill="currentColor" className="text-primary-700"/>
          <path d="M100,25 Q115,42 100,59 Q85,42 100,25" fill="currentColor" className="text-primary-600"/>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-float-delayed">
          <path d="M100,140 Q120,120 140,140 Q120,160 100,140" fill="currentColor" className="text-primary-700"/>
          <path d="M60,120 Q80,100 100,120 Q80,140 60,120" fill="currentColor" className="text-primary-600"/>
        </svg>
      </div>

      {/* Selo dourado com iniciais */}
      <div className="relative z-10 animate-scaleIn">
        <div className="w-48 h-48 md:w-64 md:h-64 relative">
          {/* Círculo externo dourado */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-300 via-secondary-400 to-secondary-600 shadow-2xl animate-pulse-slow"></div>
          
          {/* Círculo interno */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full border-2 border-secondary-600/30"></div>
            <div className="font-script text-5xl md:text-7xl text-secondary-900 tracking-wider">
              P&S
            </div>
          </div>

          {/* Brilho */}
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/40 blur-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Tela do Convite Principal
  const InviteScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-beige-100 via-beige-200 to-beige-300 relative overflow-hidden flex items-center justify-center p-4">
      {/* Textura de papel */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]"></div>

      {/* Ícone de presente no topo */}
      <div className="absolute top-8 left-8 animate-bounce-slow">
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 text-beige-100 p-4 rounded-lg shadow-lg">
          <FaGift className="text-2xl" />
          <div className="text-xs mt-1 font-sans">Presença é o</div>
          <div className="text-xs font-sans">nosso maior presente</div>
        </div>
      </div>

      {/* Papel do convite */}
      <div className="relative w-full max-w-2xl animate-fadeIn">
        {/* Borda rasgada inferior direita */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-transparent via-beige-900/10 to-transparent transform rotate-12"></div>
        
        <div className="bg-gradient-to-br from-beige-50 to-beige-100 rounded-lg shadow-2xl p-8 md:p-12 relative border-2 border-beige-300">
          {/* Data */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="font-script text-6xl md:text-8xl text-primary-700 mb-2">
              15 de Agosto
            </div>
            <div className="font-script text-5xl md:text-7xl text-primary-700 italic">
              2026
            </div>
          </div>

          {/* Nomes */}
          <div className="text-center mb-8 animate-slideIn">
            <h1 className="font-script text-4xl md:text-6xl text-primary-900 tracking-wide">
              Paulo & Sara
            </h1>
          </div>

          {/* Texto do convite */}
          <div className="text-center mb-8 px-4 animate-fadeIn-delayed">
            <p className="font-script text-lg md:text-xl text-primary-800 leading-relaxed italic">
              O dia do nosso casamento está chegando e estamos muito ansiosos para que vocês façam parte desse momento tão especial.
            </p>
          </div>

          {/* Localização */}
          <div className="mb-6 animate-fadeIn-delayed">
            <div className="flex items-start justify-center gap-3 mb-2">
              <FaMapMarkerAlt className="text-3xl text-secondary-600 mt-1 animate-bounce-slow cursor-pointer hover:scale-110 transition-transform" />
              <button
                onClick={openMap}
                className="text-left hover:text-secondary-700 transition-colors group"
              >
                <span className="text-xs text-primary-700 group-hover:underline">←clique aqui</span>
              </button>
            </div>
            <div className="text-center">
              <p className="font-serif text-base md:text-lg text-primary-900">
                R. Sete, 313 - Residencial 2, Maracanaú - CE,
              </p>
              <p className="font-serif text-base md:text-lg text-primary-900">
                61913-325
              </p>
            </div>
          </div>

          {/* Botão finalizar */}
          <div className="text-center mt-8 animate-fadeIn-delayed">
            <button
              onClick={() => setCurrentScreen(2)}
              className="bg-gradient-to-r from-primary-700 to-primary-800 text-beige-50 px-12 py-3 rounded-full font-sans text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Confirmar Presença
            </button>
            <p className="text-sm text-primary-700 mt-4 font-sans">
              Clique nos ícones para ser Direcionado
            </p>
          </div>
        </div>

        {/* Borda rasgada - efeito */}
        <div className="absolute -bottom-4 -right-4 w-full h-24 bg-gradient-to-t from-beige-800/20 to-transparent rounded-br-3xl transform rotate-2 -z-10"></div>
      </div>
    </div>
  );

  // Tela de Confirmação
  const ConfirmationScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-beige-100 via-beige-200 to-beige-300 relative overflow-hidden flex items-center justify-center p-4">
      {/* Botão voltar */}
      <button
        onClick={() => setCurrentScreen(1)}
        className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm text-primary-900 p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-20"
        aria-label="Voltar"
      >
        <FaArrowLeft className="text-2xl" />
      </button>

      <div className="relative w-full max-w-lg animate-scaleIn">
        <div className="bg-gradient-to-br from-beige-50 to-beige-100 rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-beige-300">
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-sans text-primary-900 text-center mb-12">
            confirmar presença
          </h2>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <button
                onClick={handleToggleClick}
                className={`relative w-32 h-16 rounded-full transition-all duration-500 shadow-lg ${
                  isPresent ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'
                }`}
                aria-label="Toggle presença"
              >
                {/* Círculo do toggle */}
                <div
                  className={`absolute top-2 w-12 h-12 bg-white rounded-full shadow-md transition-all duration-500 transform ${
                    isPresent ? 'translate-x-16' : 'translate-x-2'
                  }`}
                ></div>
              </button>

              {/* Instrução */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="flex items-center gap-2 text-primary-700">
                  <FaArrowLeft className="text-sm animate-pulse" />
                  <span className="text-sm font-sans">clique duas vezes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem de confirmação */}
          {showConfirmation && (
            <div className="mb-8 text-center animate-scaleIn">
              <div className="bg-green-100 border-2 border-green-500 text-green-800 px-4 py-3 rounded-lg">
                <p className="font-sans font-semibold">
                  {isPresent ? '✓ Presença confirmada!' : '✓ Resposta registrada!'}
                </p>
              </div>
            </div>
          )}

          {/* Versículo bíblico */}
          <div className="text-center space-y-4 mt-16 animate-fadeIn-delayed">
            <p className="font-script text-lg md:text-xl text-primary-800 leading-relaxed italic px-4">
              este Deus é o nosso Deus para todo o sempre; ele será o nosso guia até o fim.
            </p>
            <p className="font-sans text-sm text-primary-700">
              Salmos 48:14
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {currentScreen === 0 && <SplashScreen />}
      {currentScreen === 1 && <InviteScreen />}
      {currentScreen === 2 && <ConfirmationScreen />}
    </div>
  );
};

export default Convite;

