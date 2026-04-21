import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaGift, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { createRsvp } from '../services/rsvpService';
import './ConviteV2.css';

/* ─── Decorative SVG ornament (star + lines) ─── */
const OrnamentDivider = ({ color = '#960018' }) => (
  <div className="cv2-divider">
    <div className="cv2-divider-line" />
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0, opacity: 0.7 }}>
      <path d="M12 2l1.8 6.4H20l-5.1 3.7 1.9 6.4L12 15l-4.8 3.5 1.9-6.4L4 8.4h6.2z" />
    </svg>
    <div className="cv2-divider-line" />
  </div>
);

/* ─── Wax seal SVG texture (tiny crack lines) ─── */
const SealCracks = () => (
  <svg
    width="100%" height="100%" viewBox="0 0 52 52"
    style={{ position: 'absolute', inset: 0, opacity: 0.18 }}
  >
    <circle cx="26" cy="26" r="24" stroke="rgba(243,237,229,0.6)" strokeWidth="0.5" fill="none" />
    <circle cx="26" cy="26" r="20" stroke="rgba(243,237,229,0.4)" strokeWidth="0.5" fill="none" />
    <line x1="26" y1="4"  x2="26" y2="48" stroke="rgba(243,237,229,0.25)" strokeWidth="0.5" />
    <line x1="4"  y1="26" x2="48" y2="26" stroke="rgba(243,237,229,0.25)" strokeWidth="0.5" />
    <line x1="10" y1="10" x2="42" y2="42" stroke="rgba(243,237,229,0.18)" strokeWidth="0.5" />
    <line x1="42" y1="10" x2="10" y2="42" stroke="rgba(243,237,229,0.18)" strokeWidth="0.5" />
  </svg>
);

/* ─── Static star & petal data (memoised outside component) ─── */
const STARS = Array.from({ length: 45 }, (_, i) => ({
  key: i,
  style: {
    left:   `${(i * 2.27 + 5) % 100}%`,
    top:    `${(i * 3.81 + 3) % 100}%`,
    width:  `${1 + (i % 3)}px`,
    height: `${1 + (i % 3)}px`,
    animationDuration: `${2.5 + (i * 0.41) % 3.5}s`,
    animationDelay:    `${(i * 0.33) % 4}s`,
  },
}));

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  key: i,
  style: {
    left:              `${(i * 5.8 + 2) % 100}%`,
    width:             `${5 + (i % 5) * 2}px`,
    height:            `${5 + (i % 5) * 2}px`,
    background:        i % 3 === 0
      ? 'rgba(224, 208, 186, 0.35)'
      : i % 3 === 1
        ? 'rgba(150, 0, 24, 0.25)'
        : 'rgba(255,255,255,0.2)',
    animationDuration: `${11 + (i * 1.9) % 9}s`,
    animationDelay:    `${(i * 0.95) % 12}s`,
  },
}));

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
const ConviteV2 = () => {
  const navigate = useNavigate();

  /* phases: 0 = idle envelope | 1 = opening | 2 = invitation card | 3 = RSVP */
  const [phase, setPhase]               = useState(0);
  const [sealCracking, setSealCracking] = useState(false);
  const [flapOpen, setFlapOpen]         = useState(false);
  const [letterRising, setLetterRising] = useState(false);
  const [cardVisible, setCardVisible]   = useState(false);

  /* RSVP state */
  const [isPresent, setIsPresent]   = useState(true);
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestNames, setGuestNames]   = useState(['']);
  const [message, setMessage]         = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  /* ── Envelope click handler ── */
  const handleEnvelopeClick = () => {
    if (phase !== 0) return;
    setPhase(1);

    // 1. Seal cracks
    setSealCracking(true);

    // 2. Flap opens
    setTimeout(() => setFlapOpen(true), 420);

    // 3. Letter rises from envelope
    setTimeout(() => setLetterRising(true), 950);

    // 4. Full card slides in
    setTimeout(() => {
      setCardVisible(true);
      setPhase(2);
    }, 1900);
  };

  /* ── RSVP submit ── */
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    try {
      await createRsvp({
        name: guestNames[0],
        guestNames,
        guestsCount,
        isPresent,
        message,
      });
      setRsvpSuccess(true);
    } catch {
      alert('Erro ao confirmar. Tente novamente.');
    } finally {
      setRsvpLoading(false);
    }
  };

  /* ── Guest count change ── */
  const handleGuestsCountChange = (count) => {
    setGuestsCount(count);
    setGuestNames(prev => {
      const names = [...prev];
      if (count > names.length) {
        for (let i = names.length; i < count; i++) names.push('');
      } else {
        names.length = count;
      }
      return names;
    });
  };

  const openMap = () => window.open('https://maps.app.goo.gl/7rEsVvH3enzoVaZW7', '_blank');

  /* ══════════════════════════════
     RENDER
     ══════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: '#0b1c2d' }}>

      {/* ══ ENVELOPE SCENE ══ */}
      <div
        className="cv2-scene"
        style={{
          opacity:       cardVisible ? 0 : 1,
          pointerEvents: cardVisible ? 'none' : 'all',
          zIndex: cardVisible ? -1 : 50,
        }}
      >
        {/* Ambient glow spots */}
        <div className="cv2-glow" style={{
          width: '420px', height: '420px',
          top: '25%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(150,0,24,0.07) 0%, transparent 70%)',
        }} />
        <div className="cv2-glow" style={{
          width: '300px', height: '200px',
          bottom: '10%', right: '5%',
          background: 'radial-gradient(ellipse, rgba(11,40,70,0.5) 0%, transparent 70%)',
        }} />

        {/* Stars */}
        {STARS.map(s => <div key={s.key} className="cv2-star" style={s.style} />)}

        {/* Petals */}
        {PETALS.map(p => <div key={p.key} className="cv2-petal" style={p.style} />)}

        {/* Label above envelope */}
        <div style={{
          textAlign: 'center',
          marginBottom: '28px',
          opacity: phase === 0 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
          <p style={{
            fontFamily: "'The Seasons', cursive",
            color: 'rgba(224, 208, 186, 0.6)',
            fontSize: '12px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
          }}>
            Convite de Casamento
          </p>
        </div>

        {/* ── ENVELOPE ── */}
        <div
          className={`cv2-env-wrapper ${phase === 1 ? 'opening' : ''}`}
          onClick={handleEnvelopeClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleEnvelopeClick()}
          aria-label="Abrir convite"
        >
          {/* Body (clips the letter) */}
          <div className="cv2-env-body">
            {/* Beige interior */}
            <div className="cv2-env-interior" />

            {/* Front fold triangles */}
            <div className="cv2-fold-left" />
            <div className="cv2-fold-right" />
            <div className="cv2-fold-bottom" />

            {/* Inner border decoration */}
            <div className="cv2-env-border" />

            {/* Letter peeking out */}
            <div className={`cv2-letter-peek ${letterRising ? 'rising' : ''}`}>
              <span className="cv2-letter-peek-monogram">Paulo &amp; Sara</span>
            </div>
          </div>

          {/* Top flap (3-D rotation) */}
          <div className={`cv2-flap-wrap ${flapOpen ? 'open' : ''}`}>
            <div className="cv2-flap-front" />
          </div>

          {/* Wax seal */}
          {!flapOpen && (
            <div className="cv2-seal-wrap">
              <div className={`cv2-seal ${sealCracking ? 'cracking' : ''}`}>
                <SealCracks />
                <span className="cv2-seal-text">P&amp;S</span>
              </div>
            </div>
          )}
        </div>

        {/* Hint */}
        {phase === 0 && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              color: 'rgba(224, 208, 186, 0.45)',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              animation: 'hintPulse 2.2s ease-in-out infinite',
            }}>
              ✦&nbsp;&nbsp;Toque para abrir&nbsp;&nbsp;✦
            </p>
          </div>
        )}
      </div>

      {/* ══ CARD OVERLAY ══ */}
      <div className={`cv2-card-overlay ${cardVisible ? 'visible' : ''}`}>

        {/* ── INVITATION CARD (phase 2) ── */}
        {phase === 2 && (
          <div className="cv2-paper-card">
            <div className="cv2-paper">
              {/* Corner brackets */}
              <div className="cv2-corner cv2-corner-tl" />
              <div className="cv2-corner cv2-corner-tr" />
              <div className="cv2-corner cv2-corner-bl" />
              <div className="cv2-corner cv2-corner-br" />

              <div style={{ position: 'relative', zIndex: 1 }}>

                {/* Monogram seal */}
                <div className="cv2-reveal cv2-d1" style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '76px', height: '76px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 32%, #d40018 0%, #960018 45%, #7a0013 80%, #5e000f 100%)',
                    boxShadow: '0 6px 24px rgba(150, 0, 24, 0.32), 0 0 0 2px rgba(224,208,186,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    }} />
                    <span style={{
                      fontFamily: "'The Seasons', cursive",
                      color: 'rgba(243, 237, 229, 0.95)',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                      position: 'relative',
                    }}>P&amp;S</span>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="cv2-reveal cv2-d1" style={{ textAlign: 'center', marginBottom: '4px' }}>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#960018',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                  }}>
                    Juntos para sempre
                  </p>
                </div>

                <OrnamentDivider />

                {/* Names */}
                <div className="cv2-reveal cv2-d2" style={{ textAlign: 'center', margin: '24px 0' }}>
                  <h1 style={{
                    fontFamily: "'The Seasons', cursive",
                    color: '#0b1c2d',
                    fontSize: 'clamp(44px, 9vw, 68px)',
                    lineHeight: 1.05,
                    margin: 0,
                    letterSpacing: '0.02em',
                  }}>
                    Paulo
                  </h1>

                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '18px',
                    margin: '10px 0',
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(11,28,45,0.12)' }} />
                    <FaHeart style={{ color: '#960018', fontSize: '18px' }} />
                    <div style={{ flex: 1, height: '1px', background: 'rgba(11,28,45,0.12)' }} />
                  </div>

                  <h1 style={{
                    fontFamily: "'The Seasons', cursive",
                    color: '#0b1c2d',
                    fontSize: 'clamp(44px, 9vw, 68px)',
                    lineHeight: 1.05,
                    margin: 0,
                    letterSpacing: '0.02em',
                  }}>
                    Sara
                  </h1>
                </div>

                <OrnamentDivider />

                {/* Invitation text */}
                <div className="cv2-reveal cv2-d3" style={{ textAlign: 'center', margin: '22px 0' }}>
                  <p style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#0b1c2d',
                    fontSize: '15px',
                    lineHeight: 1.85,
                    fontStyle: 'italic',
                    opacity: 0.8,
                    maxWidth: '420px',
                    margin: '0 auto',
                  }}>
                    Com alegria e amor, temos a honra de convidar você para celebrar conosco o início da nossa mais linda história — o nosso casamento.
                  </p>
                </div>

                {/* Date box */}
                <div className="cv2-reveal cv2-d4 cv2-date-box">
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#960018',
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    opacity: 0.85,
                  }}>
                    Data &amp; Hora
                  </p>
                  <p style={{
                    fontFamily: "'The Seasons', cursive",
                    color: '#0b1c2d',
                    fontSize: 'clamp(22px, 5vw, 32px)',
                    marginBottom: '4px',
                    lineHeight: 1.2,
                  }}>
                    15 de Agosto de 2026
                  </p>
                  <p style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#0b1c2d',
                    fontSize: '18px',
                    opacity: 0.65,
                  }}>
                    às 16h00
                  </p>
                </div>

                {/* Location */}
                <div className="cv2-reveal cv2-d5 cv2-location">
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#960018',
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginBottom: '14px',
                    opacity: 0.85,
                  }}>
                    Local
                  </p>

                  {/* Map embed */}
                  <div className="cv2-map-wrap">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.311536674392!2d-49.22018179999999!3d-16.761169099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935efac0b5335f7b%3A0x9eeb1523ef70191!2sCh%C3%A1cara%20Primos%20-%20Eventos%20e%20Buffet!5e0!3m2!1spt-BR!2sbr!4v1776725739931!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      color: '#0b1c2d',
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}>
                      Chácara Primos - Eventos
                    </p>
                    <p style={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#0b1c2d',
                      fontSize: '12px',
                      opacity: 0.65,
                      lineHeight: 1.7,
                    }}>
                      Rua X-033, 174 Sítio santa luzia Sitio - Sítios Santa Luzia, Aparecida de Goiânia - GO, 74921-410<br />
                    </p>
                    <button className="cv2-btn-map" onClick={openMap}>
                      <FaMapMarkerAlt /> Ver no mapa
                    </button>
                  </div>
                </div>

                <OrnamentDivider />

                {/* Bible verse */}
                <div className="cv2-reveal cv2-d6" style={{ textAlign: 'center', margin: '18px 0' }}>
                  <p style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#0b1c2d',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    lineHeight: 1.85,
                    opacity: 0.7,
                    maxWidth: '380px',
                    margin: '0 auto',
                  }}>
                    "O amor tudo sofre, tudo crê, tudo espera, tudo suporta."
                  </p>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#960018',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    marginTop: '8px',
                    opacity: 0.75,
                  }}>
                    1 Coríntios 13:7
                  </p>
                </div>

                <OrnamentDivider />

                {/* CTAs */}
                <div className="cv2-reveal cv2-d7" style={{ textAlign: 'center', marginTop: '30px' }}>
                  <button className="cv2-btn-primary" onClick={() => setPhase(3)}>
                    Confirmar Presença
                  </button>

                  <div style={{ marginTop: '14px' }}>
                    <button className="cv2-btn-ghost" onClick={() => navigate('/presentes')}>
                      <FaGift style={{ fontSize: '11px' }} />
                      Lista de Presentes
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── RSVP FORM (phase 3) ── */}
        {phase === 3 && (
          <div className="cv2-rsvp-wrap">
            <button className="cv2-back-btn" onClick={() => setPhase(2)}>
              <FaArrowLeft style={{ fontSize: '10px' }} />
              Voltar ao convite
            </button>

            <div className="cv2-paper">
              <div className="cv2-corner cv2-corner-tl" />
              <div className="cv2-corner cv2-corner-tr" />
              <div className="cv2-corner cv2-corner-bl" />
              <div className="cv2-corner cv2-corner-br" />

              <div style={{ position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                  <h2 style={{
                    fontFamily: "'The Seasons', cursive",
                    color: '#0b1c2d',
                    fontSize: 'clamp(28px, 6vw, 36px)',
                    margin: 0,
                  }}>
                    Sua Presença
                  </h2>
                  <p style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#0b1c2d',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    opacity: 0.6,
                    margin: '8px 0 0',
                  }}>
                    Confirme sua presença neste momento especial
                  </p>
                </div>

                <OrnamentDivider />

                {!rsvpSuccess ? (
                  <form onSubmit={handleRsvpSubmit}>
                    {/* Presence toggle */}
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <p style={{
                        fontFamily: 'Playfair Display, serif',
                        color: '#0b1c2d',
                        fontSize: '15px',
                        marginBottom: '16px',
                        opacity: 0.85,
                      }}>
                        Você estará presente?
                      </p>
                      <div className="cv2-presence-toggle">
                        <button
                          type="button"
                          className={`cv2-toggle-yes ${!isPresent ? 'inactive' : ''}`}
                          onClick={() => setIsPresent(true)}
                        >
                          Sim, estarei!
                        </button>
                        <button
                          type="button"
                          className={`cv2-toggle-no ${isPresent ? 'inactive' : ''}`}
                          onClick={() => setIsPresent(false)}
                        >
                          Não poderei ir
                        </button>
                      </div>
                    </div>

                    {isPresent && (
                      <>
                        {/* Guest count */}
                        <div style={{ marginBottom: '16px' }}>
                          <label className="cv2-field-label">Número de Pessoas</label>
                          <select
                            className="cv2-select"
                            value={guestsCount}
                            onChange={e => handleGuestsCountChange(parseInt(e.target.value))}
                          >
                            {[1, 2, 3, 4].map(n => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? 'Pessoa' : 'Pessoas'}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Guest names */}
                        {guestNames.map((name, i) => (
                          <div key={i} style={{ marginBottom: '12px' }}>
                            <label className="cv2-field-label">
                              {i === 0 ? 'Seu Nome Completo' : `Nome do Convidado ${i + 1}`}
                            </label>
                            <input
                              className="cv2-input"
                              type="text"
                              required
                              value={name}
                              onChange={e => {
                                const names = [...guestNames];
                                names[i] = e.target.value;
                                setGuestNames(names);
                              }}
                              placeholder={i === 0 ? 'Nome completo' : 'Nome completo'}
                            />
                          </div>
                        ))}
                      </>
                    )}

                    {/* Message */}
                    <div style={{ marginBottom: '24px' }}>
                      <label className="cv2-field-label">Recado aos Noivos (Opcional)</label>
                      <textarea
                        className="cv2-textarea"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Deixe uma mensagem especial..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rsvpLoading}
                      className="cv2-btn-submit"
                    >
                      {rsvpLoading ? 'Enviando...' : 'Confirmar Resposta'}
                    </button>
                  </form>
                ) : (
                  <div className="cv2-success">
                    <div className="cv2-success-icon">
                      <FaHeart style={{ color: '#960018', fontSize: '26px' }} />
                    </div>
                    <h3 style={{
                      fontFamily: "'The Seasons', cursive",
                      color: '#0b1c2d',
                      fontSize: '30px',
                      marginBottom: '10px',
                    }}>
                      Obrigado!
                    </h3>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      color: '#0b1c2d',
                      fontSize: '15px',
                      fontStyle: 'italic',
                      opacity: 0.7,
                      marginBottom: '28px',
                      lineHeight: 1.7,
                    }}>
                      {isPresent
                        ? 'Sua presença foi confirmada com sucesso. Nos vemos no grande dia!'
                        : 'Recebemos sua resposta. Obrigado por nos avisar.'}
                    </p>
                    <button
                      className="cv2-btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      onClick={() => navigate('/presentes')}
                    >
                      <FaGift style={{ fontSize: '12px' }} />
                      Lista de Presentes
                    </button>
                  </div>
                )}

                {/* Verse footer */}
                <OrnamentDivider />
                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <p style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#0b1c2d',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    opacity: 0.55,
                    lineHeight: 1.7,
                  }}>
                    "O amor tudo sofre, tudo crê, tudo espera, tudo suporta."
                  </p>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#960018',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    marginTop: '5px',
                    opacity: 0.7,
                  }}>
                    1 Coríntios 13:7
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConviteV2;
