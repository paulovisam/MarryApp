import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaGift, FaArrowLeft } from 'react-icons/fa';
import { createRsvp } from '../services/rsvpService';

const Convite = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isPresent, setIsPresent] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);



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
    window.open('https://maps.app.goo.gl/7rEsVvH3enzoVaZW7', '_blank');
  };

  // Tela de Splash
  const SplashScreen = () => (
    <div
      onClick={() => setCurrentScreen(1)}
      className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex items-center justify-center cursor-pointer"
    >
      {/* Padrão de folhagens */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBDMTAgMTAgMTUgMCAyNSAwUzQwIDEwIDUwIDEwIDYwIDAgNzAgMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
      </div>

      {/* Folhagens decorativas */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-float">
          <path d="M100,20 Q120,40 100,60 Q80,40 100,20" fill="currentColor" className="text-primary-700" />
          <path d="M100,25 Q115,42 100,59 Q85,42 100,25" fill="currentColor" className="text-primary-600" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-float-delayed">
          <path d="M100,140 Q120,120 140,140 Q120,160 100,140" fill="currentColor" className="text-primary-700" />
          <path d="M60,120 Q80,100 100,120 Q80,140 60,120" fill="currentColor" className="text-primary-600" />
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

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full text-center">
          <p className="text-white/60 font-sans text-sm tracking-[0.2em] uppercase animate-pulse">
            Toque para abrir o convite
          </p>
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
          <div className="text-xs mt-1 font-sans">Recadinhos</div>
          <div className="text-xs font-sans">Lista de presentes</div>
        </div>
      </div>

      {/* Papel do convite */}
      <div className="relative w-full max-w-2xl animate-fadeIn">
        {/* Borda rasgada inferior direita */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-transparent via-beige-900/10 to-transparent transform rotate-12"></div>

        <div className="bg-gradient-to-br from-beige-50 to-beige-100 rounded-lg shadow-2xl p-8 md:p-12 relative border-2 border-beige-300">
          {/* Nomes */}
          <div className="text-center mb-8 animate-slideIn">
            <h1 className="font-script text-5xl sm:text-6xl md:text-6xl text-primary-900 tracking-wide whitespace-nowrap">
              Paulo & Sara
            </h1>
          </div>

          {/* Data */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="font-script text-4xl sm:text-5xl text-primary-700 mb-2 whitespace-nowrap">
              15 de Agosto 2026
            </div>
            <div className="font-script text-4xl sm:text-5xl text-primary-700 italic whitespace-nowrap">
              16h
            </div>
          </div>

          {/* Texto do convite */}
          <div className="text-center mb-8 px-4 animate-fadeIn-delayed">
            <p className="font-script text-lg md:text-xl text-primary-800 leading-relaxed italic">
              Estamos muito felizes em convidar você para celebrar conosco esse momento tão especial: o nosso casamento.
            </p>
            <p className="font-script text-lg md:text-xl text-primary-800 leading-relaxed italic">
              Com alegria no coração, convidamos você para celebrar o início da nossa nova história.
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
                {/* <span className="text-xs text-primary-700 group-hover:underline">←clique aqui</span> */}
              </button>
            </div>
            <div className="text-center">
              <div className="mb-6 rounded-xl overflow-hidden shadow-lg border-2 border-beige-200 mx-auto w-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15281.714432945437!2d-49.28928138405113!3d-16.75533834551021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef1d50c6ddf93%3A0x30a261e14bf1ca03!2sAD%20Cruzeiro%20do%20Sul%20-%20Igreja%20Evang%C3%A9lica%20Assembleia%20de%20Deus%20-%20Campo%20de%20Campinas!5e0!3m2!1spt-BR!2sbr!4v1770246186955!5m2!1spt-BR!2sbr"
                  width="300"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p className="font-serif text-base md:text-lg text-primary-900">
                Assembleia de Deus Cruzeiro do Sul
              </p>
              <p className="font-serif text-base md:text-lg text-primary-900">
                Rua Damasco com Avenida São João - Jardim Nova Era, Aparecida de Goiânia - GO
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
  const ConfirmationScreen = () => {
    const [guestsCount, setGuestsCount] = useState(1);
    const [guestNames, setGuestNames] = useState(['']);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await createRsvp({
          name: guestNames[0], // Main name
          guestNames, // All names array
          guestsCount,
          isPresent,
          message
        });
        setSuccess(true);
      } catch (error) {
        alert('Erro ao confirmar. Tente novamente.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    return (
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
            <h2 className="text-3xl md:text-3xl font-sans text-primary-900 text-center mb-8">
              Confirmar Presença
            </h2>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Toggle Switch */}
                <div className="flex justify-center mb-8">
                  <div className="relative flex flex-col items-center">
                    <p className="text-center text-primary-800 mb-2 font-serif">Você irá ao casamento?</p>
                    <button
                      type="button"
                      onClick={handleToggleClick}
                      className={`relative w-28 h-14 rounded-full transition-all duration-500 shadow-lg ${isPresent ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}
                    >
                      <div
                        className={`absolute top-2 w-10 h-10 bg-white rounded-full shadow-md transition-all duration-500 transform ${isPresent ? 'translate-x-14' : 'translate-x-2'
                          }`}
                      ></div>
                    </button>
                    <p className="text-center text-xs mt-2 text-primary-600">
                      {isPresent ? 'Sim, eu vou!' : 'Não poderei ir'}
                    </p>
                  </div>
                </div>


                {isPresent && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-primary-800">
                        Total de Pessoas
                      </label>
                      <select
                        value={guestsCount}
                        onChange={e => {
                          const count = parseInt(e.target.value);
                          setGuestsCount(count);
                          // Adjust guest names array size
                          const newGuestNames = [...guestNames];
                          if (count > newGuestNames.length) {
                            // Add empty slots
                            for (let i = newGuestNames.length; i < count; i++) newGuestNames.push('');
                          } else {
                            // Trim array
                            newGuestNames.length = count;
                          }
                          setGuestNames(newGuestNames);
                        }}
                        className="w-full rounded-lg border-primary-300 bg-white/50 p-3 text-primary-900 focus:ring-2 focus:ring-primary-500"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Pessoa' : 'Pessoas'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3 animate-fadeIn">
                      <label className="block text-sm font-medium text-primary-800">Nome dos Convidados</label>
                      {guestNames.map((name, index) => (
                        <input
                          key={index}
                          type="text"
                          required
                          value={name}
                          onChange={e => {
                            const newNames = [...guestNames];
                            newNames[index] = e.target.value;
                            setGuestNames(newNames);
                          }}
                          className="w-full rounded-lg border-primary-300 bg-white/50 p-3 text-primary-900 placeholder-primary-400 focus:ring-2 focus:ring-primary-500 mb-2"
                          placeholder={index === 0 ? "Seu Nome Completo" : `Nome do Convidado ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-800 mb-1">Recado aos Noivos (Opcional)</label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full rounded-lg border-primary-300 bg-white/50 p-3 text-primary-900 placeholder-primary-400 focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        placeholder="Deixe uma mensagem..."
                      />
                    </div>
                  </>
                )}


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Confirmar Resposta'}
                </button>
              </form>
            ) : (
              <div className="text-center animate-fadeIn py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-serif text-primary-900">Obrigado!</h3>
                <p className="text-primary-800">
                  Sua resposta foi registrada com sucesso.
                </p>
                {isPresent && (
                  <p className="text-sm text-primary-600 mb-8">
                    Nos vemos no grande dia!
                  </p>
                )}

                <button
                  onClick={() => navigate('/presentes')}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-full font-sans font-semibold shadow-lg hover:bg-burgundy-700 transition-colors animate-bounce-slow"
                >
                  <FaGift /> Ver Lista de Presentes 🎁
                </button>
              </div>
            )}

            {/* Versículo bíblico no rodapé */}
            <div className="text-center mt-8 border-t border-primary-200 pt-6">
              <p className="font-script text-base text-primary-700 italic">
                "O amor tudo sofre, tudo crê, tudo espera, tudo suporta."
              </p>
              <p className="text-xs text-primary-600 mt-1">1 Coríntios 13:7</p>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="relative">
      {currentScreen === 0 && <SplashScreen />}
      {currentScreen === 1 && <InviteScreen />}
      {currentScreen === 2 && <ConfirmationScreen />}
    </div>
  );
};

export default Convite;

