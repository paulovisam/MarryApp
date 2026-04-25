import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoArrowForward, IoClose } from 'react-icons/io5';
import { createRsvp } from '../services/rsvpService';

const inputBase =
  'w-full rounded-sm border border-beige-500/25 bg-slate-900/50 px-3 py-2.5 text-beige-100 placeholder:font-serif placeholder:text-beige-500/50 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/30';
const labelBase =
  'mb-1.5 block font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-beige-300';
const btnGrid =
  'py-3 text-center font-sans text-xs font-medium uppercase tracking-wide transition';

function digitsOnly(s) {
  return s.replace(/\D/g, '');
}

/** Celular/telefone BR: 10 ou 11 dígitos, DDD 11–99. */
function isValidBrPhone(s) {
  const d = digitsOnly(s);
  if (d.length < 10 || d.length > 11) return false;
  const ddd = parseInt(d.slice(0, 2), 10);
  return ddd >= 11 && ddd <= 99;
}

/** Pelo menos duas partes (nome e sobrenome), separadas por espaço. */
function isFullName(s) {
  const parts = s.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2;
}

/**
 * Modal RSVP — paleta primary/burgundy/beige (alinhada ao restante do site); envia via createRsvp.
 */
export default function ConfirmarPresencaModal({ isOpen, onClose }) {
  const [isPresent, setIsPresent] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [recado, setRecado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, loading, onClose]);

  const reset = () => {
    setIsPresent(true);
    setFullName('');
    setPhone('');
    setRecado('');
    setError('');
    setSuccess(false);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const name = fullName.trim();
    if (!isFullName(name)) {
      setError('Preencha o nome completo.');
      return;
    }
    const phoneT = phone.trim();
    if (phoneT && !isValidBrPhone(phoneT)) {
      setError('Se informar WhatsApp, use DDD + número (10 ou 11 dígitos).');
      return;
    }

    setLoading(true);
    try {
      await createRsvp({
        name,
        guestNames: [],
        guestsCount: isPresent ? 1 : 0,
        isPresent,
        message: recado.trim(),
        phone: phoneT || undefined,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Não foi possível enviar. Tente de novo em instantes.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const panel = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-10 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Fechar"
        onClick={() => !loading && onClose()}
      />
      <div
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-800 to-primary-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-beige-500/15 px-8 py-4 sm:px-5">
          <h2
            id="rsvp-modal-title"
            className="font-serif text-lg font-medium text-beige-100 sm:text-xl"
          >
            Confirmar presença
          </h2>
          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="rounded-lg text-beige-400 transition hover:bg-primary-700/50 hover:text-beige-100"
            aria-label="Fechar"
          >
            <IoClose size={26} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-5 text-beige-200 sm:px-12 sm:py-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <p className={labelBase}>Você virá?</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setIsPresent(true)}
                    className={`${btnGrid} border ${
                      isPresent
                        ? 'border-burgundy-500 bg-burgundy-600 text-beige-50'
                        : 'border-beige-500/25 bg-primary-900/50 text-beige-300 hover:bg-primary-800/60'
                    } `}
                  >
                    Sim, estarei lá
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPresent(false)}
                    className={`${btnGrid} border ${
                      !isPresent
                        ? 'border-burgundy-500 bg-burgundy-600 text-beige-50'
                        : 'border-beige-500/25 bg-primary-900/50 text-beige-300 hover:bg-primary-800/60'
                    } `}
                  >
                    Infelizmente não
                  </button>
                </div>
              </div>

              <div>
                <label className={labelBase} htmlFor="rsvp-name">
                  Nome Completo
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputBase}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className={labelBase} htmlFor="rsvp-phone">
                  WhatsApp (opcional)
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputBase}
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <div>
                <label className={labelBase} htmlFor="rsvp-recado">
                  Recado para os noivos (opcional)
                </label>
                <textarea
                  id="rsvp-recado"
                  name="message"
                  value={recado}
                  onChange={(e) => setRecado(e.target.value)}
                  rows={4}
                  className={`${inputBase} min-h-[100px] resize-y`}
                  placeholder="Uma mensagem, uma música para a festa..."
                />
              </div>

              {error ? (
                <p className="text-sm text-red-300" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="pt-1 pb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-600 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.15em] text-beige-50 transition hover:bg-burgundy-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Enviando…' : 'Enviar confirmação'}
                  {!loading ? <IoArrowForward className="h-4 w-4" aria-hidden /> : null}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center text-beige-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-300">
                ✓
              </div>
              <h3 className="font-serif text-xl">Obrigado!</h3>
              <p className="text-sm text-beige-300">
                {isPresent ? 'Te esperamos no grande dia ♥️' : 'Obrigado por nos avisar ♥️'}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full rounded-full border border-beige-500/30 py-3 text-sm font-medium text-beige-200 transition hover:bg-primary-800/50"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(panel, document.body);
}
