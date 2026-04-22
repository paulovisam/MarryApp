import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import hallelujahMp3 from '../assets/hallelujah_cut.mp3';

const AmbientAudioContext = createContext(null);
const AMBIENT_MUSIC_VOLUME = 0.35;

/** Rotas em que a música ambiente não deve tocar nem ser iniciada. */
export function isAmbientAudioBlocked(pathname) {
  return pathname.startsWith('/admin') || pathname === '/presentes';
}

/**
 * Áudio em streaming progressivo: preload="none" evita download até o primeiro play
 * (melhor em redes lentas); o navegador continua recebendo o arquivo aos poucos durante a reprodução.
 */
export function AmbientAudioProvider({ children }) {
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  /** True quando o áudio está ou já esteve a tocar (autoplay, 1.º gesto ou CTA). */
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = AMBIENT_MUSIC_VOLUME;
  }, []);

  const tryStartAmbient = useCallback(() => {
    if (isAmbientAudioBlocked(pathnameRef.current)) return;
    const el = audioRef.current;
    if (!el) return;
    el.volume = AMBIENT_MUSIC_VOLUME;
    if (el.paused) {
      el
        .play()
        .then(() => setIsAmbientActive(true))
        .catch(() => {
          // Política de autoplay: comum falhar até haver gesto do utilizador
        });
    } else {
      setIsAmbientActive(true);
    }
  }, []);

  const playAmbient = tryStartAmbient;

  /** Em rotas bloqueadas: pausa e esconde o controlo de mute. */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isAmbientAudioBlocked(pathname)) {
      el.pause();
      setIsAmbientActive(false);
    }
  }, [pathname]);

  /**
   * 1) Tenta tocar ao entrar numa rota permitida (geralmente bloqueado sem gesto).
   * 2) Primeiro gesto: listeners só quando a rota permite música.
   */
  useEffect(() => {
    if (isAmbientAudioBlocked(pathname)) {
      return undefined;
    }

    tryStartAmbient();

    const onGesture = () => {
      tryStartAmbient();
    };

    const captureOnce = { capture: true, passive: true, once: true };
    document.addEventListener('touchstart', onGesture, captureOnce);
    document.addEventListener('touchend', onGesture, captureOnce);
    document.addEventListener('pointerdown', onGesture, captureOnce);
    window.addEventListener('keydown', onGesture, { once: true });

    return () => {
      document.removeEventListener('touchstart', onGesture, { capture: true });
      document.removeEventListener('touchend', onGesture, { capture: true });
      document.removeEventListener('pointerdown', onGesture, { capture: true });
      window.removeEventListener('keydown', onGesture);
    };
  }, [tryStartAmbient, pathname]);

  const toggleMuted = useCallback(() => {
    if (isAmbientAudioBlocked(pathnameRef.current)) return;
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
        src={hallelujahMp3}
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
