import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGift } from 'react-icons/fa';

const HIDDEN_PREFIXES = ['/admin'];

export default function GiftListFab() {
  const { pathname } = useLocation();

  if (pathname === '/presentes' || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <Link
      to="/presentes"
      className="fixed z-50 flex min-h-12 min-w-12 touch-manipulation items-center justify-center overflow-visible rounded-full bg-secondary-600 text-beige-50 shadow-lg shadow-secondary-900/40 ring-2 ring-beige-100/25 transition-transform duration-200 hover:scale-105 hover:bg-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-beige-200 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 sm:min-h-11 sm:min-w-11"
      style={{
        right: 'max(0.75rem, env(safe-area-inset-right, 0px))',
        bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Ir para a lista de presentes"
    >
      <FaGift
        className="relative z-10 h-5 w-5 sm:h-[1.15rem] sm:w-[1.15rem]"
        aria-hidden
      />
      {/* Pulse effect — alinhado ao Story (timeline) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-secondary-500 opacity-20 motion-reduce:animate-none animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"
        aria-hidden
      />
    </Link>
  );
}
