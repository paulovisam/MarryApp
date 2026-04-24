import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { isAmbientAudioBlocked, useAmbientAudio } from '../contexts/AmbientAudioContext';

/**
 * Controle discreto de mute da música ambiente — canto inferior esquerdo, baixo contraste até hover.
 */
export default function AmbientMuteButton() {
  const { pathname } = useLocation();
  const { isMuted, toggleMuted, isAmbientActive } = useAmbientAudio();

  if (isAmbientAudioBlocked(pathname) || !isAmbientActive) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleMuted}
      className="fixed z-50 flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/45 shadow-sm backdrop-blur-md transition-[color,background-color,opacity,transform] duration-200 hover:scale-105 hover:bg-black/45 hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-beige-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none sm:min-h-9 sm:min-w-9"
      style={{
        left: 'max(0.75rem, env(safe-area-inset-left, 0px))',
        bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
      }}
      aria-label={isMuted ? 'Ativar som da música de fundo' : 'Silenciar música de fundo'}
      aria-pressed={isMuted}
    >
      {isMuted ? (
        <FaVolumeMute className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <FaVolumeUp className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}
