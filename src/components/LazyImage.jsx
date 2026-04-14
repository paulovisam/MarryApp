import React, { useState } from 'react';

/**
 * Imagem com placeholder de loading até o onLoad (carregamento assíncrono visível).
 */
const LazyImage = ({
  src,
  alt,
  wrapperClassName = '',
  imgClassName = '',
  loading = 'lazy',
}) => {
  const [ready, setReady] = useState(false);

  const base =
    wrapperClassName.trim() === ''
      ? 'relative block h-full min-h-[2rem] w-full'
      : `block ${wrapperClassName}`;

  return (
    <span className={base}>
      {!ready && (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50">
                   <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-beige-500/25 border-t-beige-300"
            aria-hidden
          />
        </span>
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        onLoad={() => setReady(true)}
        onError={() => setReady(true)}
      />
    </span>
  );
};

export default LazyImage;
