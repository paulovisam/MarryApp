import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const BackgroundMusic = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Volume padrão 30%
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Erro ao reproduzir áudio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Botão principal */}
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Controles expandidos */}
        <div
          className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-beige-300 min-w-[200px]">
            {/* Controle de Volume */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={toggleMute}
                className="text-primary-700 hover:text-primary-900 transition-colors"
                aria-label={isMuted ? 'Ativar som' : 'Mutar'}
              >
                {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-beige-300 rounded-lg appearance-none cursor-pointer slider"
                aria-label="Controle de volume"
              />
            </div>

            {/* Informação */}
            <div className="text-center">
              <p className="text-xs text-primary-700 font-sans">
                {isPlaying ? 'Tocando...' : 'Pausado'}
              </p>
            </div>
          </div>
        </div>

        {/* Botão Play/Pause */}
        <button
          onClick={togglePlay}
          className="group relative bg-gradient-to-br from-secondary-500 to-secondary-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white/50"
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          {/* Pulse animation quando tocando */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-secondary-400 animate-ping opacity-30"></span>
          )}
          
          {/* Ícone */}
          <div className="relative z-10">
            {isPlaying ? (
              <FaPause className="text-2xl" />
            ) : (
              <FaPlay className="text-2xl ml-1" />
            )}
          </div>

          {/* Ícone de música decorativo */}
          <FaMusic className="absolute -top-1 -right-1 text-xs text-secondary-800 opacity-60" />
        </button>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap transition-opacity duration-300 ${
            showControls ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isPlaying ? 'Pausar música' : 'Tocar música'}
        </div>
      </div>

      {/* Elemento de áudio */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />

      {/* Estilos customizados para o slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b0018, #960018);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b0018, #960018);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default BackgroundMusic;

