import React from 'react';
import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';

/**
 * Scroll suave global (Lenis) — desligado com prefers-reduced-motion.
 * Âncoras (#about, #confirmar-presenca) usam a opção nativa `anchors` do Lenis.
 */
export default function SmoothScroll({ children }) {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return children;
    }

    return (
        <ReactLenis
            root
            options={{
                autoRaf: true,
                anchors: {
                    duration: 1.35,
                    easing: (t) =>
                        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                },
                lerp: 0.085,
                smoothWheel: true,
                wheelMultiplier: 0.85,
                touchMultiplier: 1,
                stopInertiaOnNavigate: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}
