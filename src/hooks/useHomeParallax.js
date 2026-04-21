import { useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

/**
 * Parallax leve por seção: só transform (GPU), desliga com prefers-reduced-motion.
 */
export function useHeroParallax() {
    const ref = useRef(null);
    const reduce = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const off = reduce ? 0 : 1;

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', `${18 * off}%`]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.1 * off]);
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', `${-7 * off}%`]);
    const blobY = useTransform(scrollYProgress, [0, 1], ['0%', `${12 * off}%`]);

    return { ref, bgY, bgScale, contentY, blobY };
}

export function useAboutParallax() {
    const ref = useRef(null);
    const reduce = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const off = reduce ? 0 : 1;
    const heartY = useTransform(scrollYProgress, [0, 1], [`${14 * off}px`, `${-14 * off}px`]);
    const quoteY = useTransform(scrollYProgress, [0, 1], ['0%', `${-4 * off}%`]);

    return { ref, heartY, quoteY };
}
