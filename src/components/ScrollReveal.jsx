import { motion, useReducedMotion } from 'framer-motion';

/**
 * Entrada suave ao entrar na viewport (scroll reveal).
 * Respeita prefers-reduced-motion; combina com Lenis (IntersectionObserver).
 */
export default function ScrollReveal({
  children,
  className,
  style,
  from = 'bottom',
  distance = 28,
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.12,
}) {
  const reduceMotion = useReducedMotion();

  const initial = { opacity: 0 };
  if (from === 'bottom') initial.y = distance;
  else if (from === 'top') initial.y = -distance;
  else if (from === 'left') initial.x = -distance;
  else if (from === 'right') initial.x = distance;

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -10% 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
