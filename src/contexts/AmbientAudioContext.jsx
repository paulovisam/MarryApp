import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import hallelujahSrc from '../assets/hallelujah.mp3';

const AmbientAudioContext = createContext(null);
const AMBIENT_MUSIC_VOLUME = 0.35;

/**
 * Áudio em streaming progressivo: preload="none" evita download até o primeiro play
 * (melhor em redes lentas); o navegador continua recebendo o arquivo aos poucos durante a reprodução.
 */
export function AmbientAudioProvider({ children }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  /** Só fica true após a música realmente iniciar (clique em Confirmar presença + play OK). */
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = AMBIENT_MUSIC_VOLUME;
  }, []);

  const playAmbient = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = AMBIENT_MUSIC_VOLUME;
    if (el.paused) {
      el
        .play()
        .then(() => setIsAmbientActive(true))
        .catch(() => {
          // Sem botão de mute se o áudio não puder tocar
        });
    } else {
      setIsAmbientActive(true);
    }
  }, []);

  const toggleMuted = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setIsMuted(next);
  }, []);

  return (
    <AmbientAudioContext.Provider value={{ playAmbient, toggleMuted, isMuted, isAmbientActive }}>
      {children}
      <audio
        ref={audioRef}
        src={hallelujahSrc}
        preload="none"
        loop
        playsInline
        className="sr-only"
        aria-hidden
      />
    </AmbientAudioContext.Provider>
  );
}

export function useAmbientAudio() {
  const ctx = useContext(AmbientAudioContext);
  if (!ctx) {
    throw new Error('useAmbientAudio deve ser usado dentro de AmbientAudioProvider');
  }
  return ctx;
}
