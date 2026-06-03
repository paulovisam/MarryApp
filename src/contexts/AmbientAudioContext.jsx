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
 * `preload="metadata"`: primeiro play() falha menos em Chrome Android (ficheiro ainda vazio após primeiro gesto errado).
 * O resto do ficheiro continua a carregar durante a reprodução.
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
    if (!el || !el.paused) return;
    el.volume = AMBIENT_MUSIC_VOLUME;
    el
      .play()
      .then(() => setIsAmbientActive(true))
      .catch(() => {
        // Autoplay bloqueado ou áudio ainda sem buffer — novos gestos voltam a tentar
      });
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
   * 2) Gesto do utilizador: listeners persistentes enquanto a rota permite música.
   *
   * Por que NÃO escutar `touchstart` / `pointerdown` para chamar play():
   *   - Esses eventos disparam ANTES do gesto ser concluído e fazem `el.paused` virar `false`
   *     imediatamente (mesmo que a promise venha a rejeitar com NotAllowedError).
   *   - Quando o evento válido (`touchend` / `click`) chega milissegundos depois,
   *     o guard `!el.paused` retorna early e o gesto de ativação válido é desperdiçado.
   *   - No Android Chrome apenas `touchend` e `click` são ativações confiáveis para áudio.
   *   - No iOS Safari `touchend` também é suficiente para iniciar a música ao rolar.
   */
  useEffect(() => {
    if (isAmbientAudioBlocked(pathname)) {
      return undefined;
    }

    tryStartAmbient();

    const onGesture = () => {
      tryStartAmbient();
    };

    const capturePassive = { capture: true, passive: true };
    document.addEventListener('touchend', onGesture, capturePassive);
    document.addEventListener('click', onGesture, capturePassive);
    window.addEventListener('keydown', onGesture, { capture: true });

    return () => {
      document.removeEventListener('touchend', onGesture, capturePassive);
      document.removeEventListener('click', onGesture, capturePassive);
      window.removeEventListener('keydown', onGesture, { capture: true });
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
        preload="metadata"
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
