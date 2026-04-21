import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    IoChevronBack,
    IoChevronForward,
    IoClose,
    IoImagesOutline,
} from 'react-icons/io5';
import LazyImage from './LazyImage';
import ScrollReveal from './ScrollReveal';

const imageModules = import.meta.glob('../assets/prewedding/*.webp', {
    eager: true,
    import: 'default',
});

function naturalSortPaths(paths) {
    return [...paths].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
}

const PREWEDDING_PHOTOS = naturalSortPaths(Object.keys(imageModules)).map(
    (path, i, arr) => ({
        id: `prewedding-${i}`,
        src: imageModules[path],
        alt: `Pré-wedding do casal — foto ${i + 1} de ${arr.length}`,
    })
);

const THUMB_SIZES =
    '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';

/**
 * Galeria pré-wedding: grid responsivo, imagens WebP com lazy load,
 * lightbox nativo leve (sem lib pesada), scroll bloqueado e teclado.
 */
export default function PreweddingGallery() {
    const titleId = useId();
    const closeBtnRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const openAt = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const closeLightbox = useCallback(() => setActiveIndex(null), []);

    const goNext = useCallback(() => {
        setActiveIndex((i) => {
            if (i === null || PREWEDDING_PHOTOS.length === 0) return i;
            return (i + 1) % PREWEDDING_PHOTOS.length;
        });
    }, []);

    const goPrev = useCallback(() => {
        setActiveIndex((i) => {
            if (i === null || PREWEDDING_PHOTOS.length === 0) return i;
            return (i - 1 + PREWEDDING_PHOTOS.length) % PREWEDDING_PHOTOS.length;
        });
    }, []);

    useEffect(() => {
        if (activeIndex === null) return undefined;
        const html = document.documentElement;
        const body = document.body;
        const prevHtml = html.style.overflow;
        const prevBody = body.style.overflow;
        const prevTouch = body.style.touchAction;
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.touchAction = 'none';
        return () => {
            html.style.overflow = prevHtml;
            body.style.overflow = prevBody;
            body.style.touchAction = prevTouch;
        };
    }, [activeIndex]);

    useEffect(() => {
        if (activeIndex === null) return;
        closeBtnRef.current?.focus();
    }, [activeIndex]);

    useEffect(() => {
        if (activeIndex === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeIndex, closeLightbox, goNext, goPrev]);

    if (PREWEDDING_PHOTOS.length === 0) {
        return null;
    }

    const lightbox =
        activeIndex !== null &&
        createPortal(
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-2 backdrop-blur-sm sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={closeLightbox}
            >
                <h2 id={titleId} className="sr-only">
                    Visualizar foto em tamanho maior
                </h2>
                <button
                    type="button"
                    ref={closeBtnRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        closeLightbox();
                    }}
                    className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-beige-300 sm:right-4 sm:top-4"
                    aria-label="Fechar galeria"
                >
                    <IoClose className="h-7 w-7" aria-hidden />
                </button>
                {PREWEDDING_PHOTOS.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goPrev();
                            }}
                            className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-beige-300 sm:left-3 md:left-6"
                            aria-label="Foto anterior"
                        >
                            <IoChevronBack className="h-7 w-7" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goNext();
                            }}
                            className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-beige-300 sm:right-3 md:right-6"
                            aria-label="Próxima foto"
                        >
                            <IoChevronForward className="h-7 w-7" aria-hidden />
                        </button>
                    </>
                )}
                <div
                    className="flex max-h-[85dvh] max-w-6xl flex-col items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={PREWEDDING_PHOTOS[activeIndex].src}
                        alt={PREWEDDING_PHOTOS[activeIndex].alt}
                        className="max-h-[80dvh] w-auto max-w-full object-contain shadow-2xl"
                        loading="eager"
                        decoding="async"
                    />
                    <p className="mt-3 text-center text-sm text-white/70">
                        {activeIndex + 1} / {PREWEDDING_PHOTOS.length}
                    </p>
                </div>
            </div>,
            document.body
        );

    return (
        <section
            id="galeria-prewedding"
            className="scroll-mt-20 bg-gradient-to-b from-primary-800 via-primary-900 to-gray-950 py-16 md:py-28"
            aria-labelledby="prewedding-heading"
        >
            {lightbox}
            <div className="container mx-auto max-w-6xl px-4">
                <ScrollReveal className="mb-10 text-center md:mb-14">
                    <header>
                        <IoImagesOutline
                            className="mx-auto mb-5 h-10 w-10 text-burgundy-400/90 md:h-12 md:w-12"
                            aria-hidden
                        />
                        <h2
                            id="prewedding-heading"
                            className="font-serif text-3xl text-beige-200 md:text-4xl lg:text-5xl"
                        >
                            Galeria de Fotos
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-beige-400/90 md:text-base">
                            Alguns momentos do nosso ensaio
                        </p>
                    </header>
                </ScrollReveal>

                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3">
                    {PREWEDDING_PHOTOS.map((photo, index) => (
                        <li
                            key={photo.id}
                            className="[content-visibility:auto] [contain-intrinsic-size:200px_280px]"
                        >
                            <ScrollReveal
                                className="h-full"
                                delay={Math.min(index * 0.04, 0.36)}
                                amount={0.08}
                            >
                            <button
                                type="button"
                                onClick={() => openAt(index)}
                                className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-primary-950/50 shadow-md outline-none transition-[box-shadow,transform] duration-300 hover:border-beige-500/20 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-beige-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 motion-reduce:transition-none md:rounded-2xl"
                                aria-label={`Ampliar: ${photo.alt}`}
                            >
                                <LazyImage
                                    src={photo.src}
                                    alt=""
                                    loading="lazy"
                                    sizes={THUMB_SIZES}
                                    wrapperClassName="absolute inset-0 block h-full w-full"
                                    imgClassName="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                                />
                                <span
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80 motion-reduce:transition-none"
                                    aria-hidden
                                />
                            </button>
                            </ScrollReveal>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
