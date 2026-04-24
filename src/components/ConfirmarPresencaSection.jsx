import React, { useEffect, useState } from 'react';
import ConfirmarPresencaCard from './ConfirmarPresencaCard';

/**
 * Contagem regressiva até o casamento + card de CTA.
 * Lógica isolada de Story; renderizado no fluxo da home (App).
 */
export default function ConfirmarPresencaSection() {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const MS_MINUTE = 1000 * 60;
    const MS_HOUR = MS_MINUTE * 60;
    const MS_DAY = MS_HOUR * 24;

    const calculateTimeLeft = () => {
      const weddingDate = new Date('2026-08-15T16:00:00');
      const now = new Date();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0 });
        return;
      }

      let months = 0;
      const cursor = new Date(now.getTime());

      let walk = new Date(cursor.getTime());
      while (true) {
        const next = new Date(walk);
        next.setMonth(next.getMonth() + 1);
        if (next > weddingDate) break;
        walk = next;
        months++;
      }

      let remainder = weddingDate - walk;
      const days = Math.floor(remainder / MS_DAY);
      remainder -= days * MS_DAY;
      const hours = Math.floor(remainder / MS_HOUR);
      remainder -= hours * MS_HOUR;
      const minutes = Math.floor(remainder / MS_MINUTE);

      setTimeLeft({ months, days, hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 border-t border-white/5"
      aria-label="Confirmação de presença"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <ConfirmarPresencaCard timeLeft={timeLeft} />
        </div>
      </div>
    </section>
  );
}
