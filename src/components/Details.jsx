import React from 'react';

import { Smartphone, Clock, MapPin, Gift, Calendar, Shirt } from 'lucide-react';

import ScrollReveal from './ScrollReveal';

const details = [
  {
    id: 'data',
    label: 'Data',
    value: '15 · 08 · 2026',
    footer: 'Sábado',
    Icon: Calendar,
  },
  {
    id: 'horario',
    label: 'Horário',
    value: '16:00',
    footer: 'Cerimônia pontual',
    Icon: Clock,
  },
  {
    id: 'local',
    label: 'Local',
    value: 'Chácara Primos · Eventos',
    footer: 'Abrir mapa',
    Icon: MapPin,
    link: 'https://share.google/ox1vW5B4b0ntOeAx3',
  },
  {
    id: 'desconecte',
    label: '',
    value: 'Desconecte',
    footer: 'Durante a cerimônia, deixe o celular guardado. Queremos seus olhos presentes — as fotos ficam com os profissionais.',
    Icon: Smartphone,
  },

  {
    id: 'pontualidade',
    label: '',
    value: 'Pontualidade',
    footer: 'A cerimônia começa pontualmente às 16h. Pedimos que cheguem com 30 minutos de antecedência.',
    Icon: Clock,
  },
  {
    id: 'presentes',
    label: 'Presentes',
    value: 'Abrir Lista de Presentes',
    footer: 'Se preferir, pode nos entregar pessoalmente.',
    Icon: Gift,
    link: '/presentes',
  },

  {
    id: 'desscode',
    label: '',
    value: 'Dress Code',
    footer: 'Casual Elegante. Evite branco, off-white e vermelho.',
    Icon: Shirt,
  },
];

const Details = () => {
  return (
    <section
      id="details"
      className="bg-[#060a12] py-20 md:py-28"
      aria-labelledby="details-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className={`h-px w-10 sm:w-14 bg-champagne-300/35 `} />
            <p
              className={`font-sans text-[0.7rem] font-medium tracking-[0.32em] text-champagne-300 sm:text-xs`}
            >
              CERIMÔNIA E RECEPÇÃO
            </p>
            <div className={`h-px w-10 sm:w-14 bg-champagne-300/35`} />
          </div>

          <h2
            id="details-heading"
            className={`font-serif text-3xl font-medium tracking-tight text-champagne-100 sm:text-4xl md:text-[2.5rem] md:leading-tight`}
          >
            Os detalhes essenciais
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-base italic leading-relaxed text-champagne-500 sm:text-lg">
            Tudo o que você precisa saber para celebrar conosco, em um só lugar.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3 md:gap-5 lg:gap-8">
          {details.map((item, index) => {
            const isLast = index === details.length - 1;
            const { Icon, link } = item;
            const cardClassName = `group w-full max-w-xs rounded-2xl border border-champagne-300/12 border-champagne-300/75 px-6 py-8 text-center shadow-[0_4px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-champagne-300/35 hover:shadow-[0_14px_48px_rgba(0,0,0,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-5 md:py-9`;

            const body = (
              <>
                <div
                  className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-champagne-300/75 bg-[#0a0f1a]/60 transition-[transform,border-color,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:border-champagne-200/90 group-hover:shadow-[0_0_24px_rgba(201,169,110,0.2)] motion-reduce:group-hover:scale-100`}
                  aria-hidden
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-110 sm:h-6 sm:w-6 text-champagne-200 motion-reduce:group-hover:scale-100`}
                    strokeWidth={1.15}
                  />
                </div>
                <h3
                  className={`font-serif text-sm font-medium tracking-wide sm:text-base text-champagne-200`}
                >
                  {item.label}
                </h3>
                <p
                  className={`mt-3 font-serif text-xl font-medium leading-snug tracking-tight text-champagne-400/90 sm:text-2xl`}
                >
                  {item.value}
                </p>
                <p
                  className={`mt-3 font-sans text-[0.7rem] font-medium uppercase tracking-[0.2em] sm:text-xs text-champagne-100`}
                >
                  {item.footer}
                </p>
              </>
            );

            return (
              <ScrollReveal
                key={item.id}
                from="bottom"
                delay={0.08 * (index + 1)}
                className={`flex justify-center ${isLast ? 'w-full md:col-span-3' : ''}`}
              >
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClassName} block cursor-pointer no-underline text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-300`}
                    aria-label="Abrir local da cerimônia (Chácara Primos · Eventos) no Google Maps"
                  >
                    {body}
                  </a>
                ) : (
                  <article className={`${cardClassName} ${isLast ? '' : ''}`}>{body}</article>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Details;
