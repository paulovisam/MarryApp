import React, { useEffect, useState } from 'react';
import homeHeroUrl from '../assets/home.webp';

/**
 * Pré-carrega a foto do hero; só então exibe o site (rota inicial).
 */
const HomeEntryLoader = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    const done = () => setReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = homeHeroUrl;
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-burgundy-900 border-t-beige-300"
          aria-hidden
        />
        <p className="mt-8 font-serif text-lg text-beige-300">Carregando…</p>
      </div>
    );
  }

  return <div className="animate-fade-in-slow">{children}</div>;
};

export default HomeEntryLoader;
