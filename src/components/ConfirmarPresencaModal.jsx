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

const COMPANION = [
  { v: 1, label: 'Sozinho(a)' },
  { v: 2, label: '+ 1 acompanhante' },
];

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

/**
 * Modal RSVP — paleta primary/burgundy/beige (alinhada ao restante do site); envia via createRsvp.
 */
export default function ConfirmarPresencaModal({ isOpen, onClose }) {
  const [isPresent, setIsPresent] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companion, setCompanion] = useState(1);
  const [dietary, setDietary] = useState('');
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
    setCompanion(1);
    setDietary('');
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
    if (!name) {
      setError('Preencha o nome completo.');
      return;
    }
    if (!isValidBrPhone(phone)) {
      setError('Informe um telefone válido (DDD + número, 10 ou 11 dígitos).');
      return;
    }

    setLoading(true);
    try {
      await createRsvp({
        name,
        guestNames: [],
        guestsCount: isPresent ? companion : 0,
        isPresent,
        message: recado.trim(),
        dietary: dietary.trim(),
        phone: phone.trim(),
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-4"
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
        <div className="flex shrink-0 items-center justify-between border-b border-beige-500/15 px-4 py-3 sm:px-5">
          <h2
            id="rsvp-modal-title"
            className="font-serif text-lg font-medium text-beige-100 sm:text-xl"
          >
            Confirmar presença
          </h2>
          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="rounded-lg p-1.5 text-beige-400 transition hover:bg-primary-700/50 hover:text-beige-100"
            aria-label="Fechar"
          >
            <IoClose size={26} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 text-beige-200 sm:px-6 sm:py-6">
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
                  Nome completo
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputBase}
                  placeholder="Como gostaria de ser anunciado"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                <div>
                  <label className={labelBase} htmlFor="rsvp-phone">
                    WhatsApp
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
                    required
                  />
                </div>
                {isPresent ? (
                  <div>
                    <label className={labelBase} htmlFor="rsvp-companion">
                      Acompanhante
                    </label>
                    <div className="relative">
                      <select
                        id="rsvp-companion"
                        value={companion}
                        onChange={(e) => setCompanion(parseInt(e.target.value, 10))}
                        className={`${inputBase} appearance-none pr-8 text-beige-100`}
                      >
                        {COMPANION.map((o) => (
                          <option key={o.v} value={o.v} className="bg-primary-900 text-beige-100">
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-beige-400"
                        aria-hidden
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                ) : null}
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
                  placeholder="Uma mensagem, uma música para a pista…"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-300" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="pt-1">
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
                Sua resposta foi registrada. {isPresent ? 'Nos vemos no grande dia!' : ''}
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
