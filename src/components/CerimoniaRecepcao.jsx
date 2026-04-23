import React from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTshirt } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal';

const VENUE_NAME = 'Chácara Primos · Eventos';
const ADDRESS_LINES = ['Rua X-033, 174 · Sítios Santa Luzia', 'Aparecida de Goiânia · GO · 74921-410'];
const MAPS_QUERY =
  'Chácara+Primos+Eventos+Rua+X-033+174+Sítios+Santa+Luzia+Aparecida+de+Goiânia+GO+74921-410';
const MAPS_EMBED_SRC = `https://maps.google.com/maps?q=${MAPS_QUERY}&hl=pt&z=16&output=embed`;
const MAPS_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

function InfoCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <ScrollReveal
      delay={delay}
      className="rounded-2xl border border-beige-500/20 bg-slate-900/45 p-5 shadow-lg backdrop-blur-sm sm:p-6"
    >
      <div className="mb-3 flex items-center gap-3 text-beige-200">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-burgundy-500/35 bg-burgundy-950/40 text-burgundy-300">
          <Icon className="h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]" aria-hidden />
        </span>
        <h3 className="font-serif text-lg text-beige-100 sm:text-xl">{title}</h3>
      </div>
      <div className="space-y-2 font-sans text-sm leading-relaxed text-beige-300/95 sm:text-base">
        {children}
      </div>
    </ScrollReveal>
  );
}

/**
 * Cerimônia, recepção, local com mapa e dress code — antes do CTA Confirmar presença.
 */
export default function CerimoniaRecepcao() {
  return (
    <section
      id="cerimonia-recepcao"
      className="scroll-mt-20 border-t border-white/10 pt-16 md:scroll-mt-24 md:pt-24"
      aria-labelledby="cerimonia-heading"
    >
      <ScrollReveal className="mb-10 text-center md:mb-14">
        <h2
          id="cerimonia-heading"
          className="font-serif text-3xl text-white md:text-4xl lg:text-5xl"
        >
          Cerimônia & Recepção
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400 md:text-base">
          Tudo o que você precisa saber para celebrar com a gente no grande dia.
        </p>
      </ScrollReveal>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <ScrollReveal className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-beige-500/20 bg-slate-950/50 shadow-xl">
            <div className="aspect-[4/3] w-full min-h-[220px] sm:min-h-[260px] lg:aspect-auto lg:min-h-[320px]">
              <iframe
                title={`Mapa: ${VENUE_NAME}`}
                src={MAPS_EMBED_SRC}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <a
            href={MAPS_OPEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-beige-500/25 bg-white/5 px-4 py-3 text-center font-sans text-sm text-beige-200 transition-colors hover:border-beige-400/40 hover:bg-white/10 sm:text-base"
          >
            Abrir no Google Maps
          </a>
        </ScrollReveal>

        <div className="flex flex-col gap-5 lg:col-span-7">
          <InfoCard icon={FaMapMarkerAlt} title="Localização" delay={0.05}>
            <p className="font-medium text-beige-200">{VENUE_NAME}</p>
            {ADDRESS_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </InfoCard>

          <InfoCard icon={FaCalendarAlt} title="Data" delay={0.1}>
            <p className="font-medium text-beige-200">Sábado · 15 de agosto de 2026</p>
            <p>Recepção dos convidados a partir das 16h30.</p>
          </InfoCard>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoCard icon={FaClock} title="Cerimônia" delay={0.12}>
              <p className="font-script text-2xl text-beige-200 sm:text-3xl">17h00</p>
              <p className="text-sm text-beige-400/90 italic sm:text-[0.9375rem]">
                Pontualidade é um presente lindo.
              </p>
            </InfoCard>
            <InfoCard icon={FaClock} title="Recepção" delay={0.14}>
              <p className="font-script text-2xl text-beige-200 sm:text-3xl">19h00</p>
              <p className="text-sm text-beige-400/90 sm:text-[0.9375rem]">
                Jantar, brinde e pista aberta até a madrugada.
              </p>
            </InfoCard>
          </div>

          <InfoCard icon={FaTshirt} title="Dress code" delay={0.18}>
            <p className="font-medium text-beige-200">Traje esporte fino</p>
            <p>Tons sóbrios — evite branco, por favor.</p>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}
