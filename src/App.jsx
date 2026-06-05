import { useState, useEffect, useRef } from 'react'
import './App.css'

const STEPS = [-2, -1, 0, 1, 2, 3, 4, 5, 6];

const generateTypeScale = (baseSize, multiplier) => {
  const base = parseFloat(baseSize) || 16;
  const r = parseFloat(multiplier) || 1;

  return STEPS.map((step) => {
    const sizePx = base * Math.pow(r, step);
    return {
      step,
      label: `${step >= 0 ? '+' : ''}${step}`,
      px: `${sizePx.toFixed(1)}px`,
      rem: `${(sizePx / 16).toFixed(3)}rem`,
    };
  });
};

const RATIOS = [
  { name: 'Minor Second', value: 1.067 },
  { name: 'Major Second', value: 1.125 },
  { name: 'Minor Third', value: 1.200 },
  { name: 'Major Third', value: 1.250 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Augmented Fourth', value: 1.414 },
  { name: 'Perfect Fifth', value: 1.500 },
  { name: 'Golden Ratio', value: 1.618 },
];
const RATIO_MIN = 1.067;
const RATIO_MAX = 1.618;

const FAQS = [
  { q: 'Is RATIO free to use?', a: 'Yes. RATIO is completely free, with no signup, no limits, and no premium tier.' },
  { q: 'Does RATIO store my data?', a: 'No. Every scale is computed in your browser. Nothing is uploaded, saved, or tracked.' },
  { q: 'Can I use the generated code commercially?', a: 'Yes. The CSS, Tailwind, and values you export are yours to use in any project, without attribution.' },
  { q: 'What scales does RATIO support?', a: 'Eight musical-interval ratios — Minor Second through the Golden Ratio — plus any custom ratio you enter.' },
];

const SPECIMEN = 'Typography is the craft of endowing human language with a durable visual form';

function App() {
  const [baseSize, setBaseSize] = useState(16);
  const [multiplier, setMultiplier] = useState(1.414);
  const [customMultiplier, setCustomMultiplier] = useState('');
  const [copied, setCopied] = useState(null);
  const reticleRef = useRef(null);

  const typeScale = generateTypeScale(baseSize, multiplier);

  // Bespoke cursor — a graduation reticle that sharpens to a crosshair over the stage
  useEffect(() => {
    const reticle = reticleRef.current;
    if (!reticle || window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      const overStage = e.target.closest && e.target.closest('.stage');
      reticle.classList.toggle('is-reading', Boolean(overStage));
    };
    const tick = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      reticle.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const selectRatio = (value) => {
    setMultiplier(value);
    setCustomMultiplier('');
  };

  const handleCustomMultiplier = (e) => {
    const raw = e.target.value;
    setCustomMultiplier(raw);
    const value = parseFloat(raw);
    if (!isNaN(value) && value > 0 && value < 100) {
      setMultiplier(value);
    }
  };

  const stepBase = (delta) => setBaseSize((prev) => Math.min(120, Math.max(8, (parseFloat(prev) || 16) + delta)));

  const cssCode = typeScale.map((s) => `--text-step${s.step}: ${s.rem};`).join('\n');
  const tailwindCode = typeScale.map((s) => `'step${s.step}': '${s.rem}',`).join('\n');

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch (err) {
      console.error('Clipboard access denied:', err);
    }
  };

  return (
    <div className="bench">
      <div className="bench__texture" aria-hidden="true" />
      <div ref={reticleRef} className="reticle" aria-hidden="true" />

      <div className="bench__inner">
        {/* Top rail */}
        <header className="rail">
          <a className="rail__mark" href="/">
            <span className="frac">
              <span>RA</span>
              <span className="frac__bar" />
              <span>TIO</span>
            </span>
            <span className="rail__word">Proportion Bench</span>
          </a>
          <nav className="rail__nav">
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
            <a className="rail__credit" href="https://velocity.calyvent.com" target="_blank" rel="noopener">
              <span className="dot" />
              Calibrated by <b>Velocity</b>
            </a>
          </nav>
        </header>

        {/* Masthead */}
        <section className="masthead">
          <div className="masthead__eyebrow">Typographic Scale Calculator · Free · Client-side</div>
          <h1 className="masthead__title">RATIO<span className="slash">⁄</span></h1>
          <p className="masthead__lead">
            Tune a base size against a harmonic ratio and read the entire hierarchy as a single
            calibrated ladder. Export <b>CSS custom properties</b> or a <b>Tailwind</b> scale in one motion.
          </p>
        </section>

        {/* Workspace */}
        <div className="work">
          {/* Control deck */}
          <aside className="deck">
            <div>
              <div className="field__head">
                <span className="field__label">Base Size</span>
                <span className="field__hint">Step 0 anchor</span>
              </div>
              <div className="gauge">
                <input
                  type="number"
                  value={baseSize}
                  min="8"
                  max="120"
                  onChange={(e) => setBaseSize(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  onBlur={(e) => { if (!e.target.value || parseFloat(e.target.value) < 8) setBaseSize(16); }}
                  aria-label="Base size in pixels"
                />
                <span className="gauge__unit">px</span>
                <div className="gauge__steppers">
                  <button onClick={() => stepBase(1)} aria-label="Increase base size">+</button>
                  <button onClick={() => stepBase(-1)} aria-label="Decrease base size">−</button>
                </div>
              </div>
            </div>

            <div>
              <div className="field__head">
                <span className="field__label">Ratio</span>
                <span className="field__hint">{multiplier.toFixed(3)}×</span>
              </div>
              <div className="ratios">
                {RATIOS.map((r) => {
                  const w = ((r.value - RATIO_MIN) / (RATIO_MAX - RATIO_MIN)) * 100;
                  return (
                    <button
                      key={r.name}
                      className={`ratio${multiplier === r.value ? ' is-active' : ''}`}
                      onClick={() => selectRatio(r.value)}
                    >
                      <span className="ratio__val">{r.value.toFixed(3)}</span>
                      <span className="ratio__name">{r.name}</span>
                      <span className="ratio__bar" style={{ '--w': `${w}%` }} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="field__head">
                <span className="field__label">Custom Ratio</span>
                <span className="field__hint">1.000 – 99</span>
              </div>
              <div className="custom">
                <input
                  type="number"
                  step="0.001"
                  value={customMultiplier}
                  onChange={handleCustomMultiplier}
                  placeholder="e.g. 1.500"
                  aria-label="Custom ratio"
                />
                <span className="custom__tag">×</span>
              </div>
            </div>
          </aside>

          {/* Specimen stage */}
          <main className="stage">
            <div className="stage__head">
              <h2 className="stage__title">Specimen Ladder</h2>
              <span className="stage__count">{typeScale.length} steps</span>
            </div>

            {[...typeScale].reverse().map((s) => (
              <div key={s.step} className={`rung${s.step === 0 ? ' is-base' : ''}`}>
                <div className="rung__grad">
                  <span className="rung__tick" />
                  <span className="rung__step">{s.label}</span>
                </div>
                <div className="rung__specimen" style={{ fontSize: s.rem }}>
                  {SPECIMEN}
                </div>
                <div className="rung__read">
                  <b>{s.px}</b>
                  {s.rem}
                </div>
              </div>
            ))}

            {/* Export plates */}
            <section className="export">
              <div className="stage__head">
                <h2 className="stage__title">Export</h2>
                <span className="stage__count">copy &amp; paste</span>
              </div>
              <div className="export__grid">
                <div className="plate">
                  <div className="plate__head">
                    <span className="plate__label">CSS · :root variables</span>
                    <button
                      className={`plate__copy${copied === 'css' ? ' is-copied' : ''}`}
                      onClick={() => copyToClipboard(`:root {\n${cssCode.split('\n').map((l) => `  ${l}`).join('\n')}\n}`, 'css')}
                    >
                      {copied === 'css' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre><code>{cssCode}</code></pre>
                </div>
                <div className="plate">
                  <div className="plate__head">
                    <span className="plate__label">Tailwind · fontSize</span>
                    <button
                      className={`plate__copy${copied === 'tw' ? ' is-copied' : ''}`}
                      onClick={() => copyToClipboard(tailwindCode, 'tw')}
                    >
                      {copied === 'tw' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre><code>{tailwindCode}</code></pre>
                </div>
              </div>
            </section>

            {/* Field notes */}
            <section className="notes">
              <h2 className="notes__title">Field Notes</h2>
              {FAQS.map((f, i) => (
                <div className="note" key={f.q}>
                  <span className="note__idx">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Velocity signature plate — the traffic driver */}
            <a className="signature" href="https://velocity.calyvent.com" target="_blank" rel="noopener">
              <span className="signature__l">
                <span className="signature__eyebrow">Calibrated &amp; built by</span>
                <span className="signature__name">Velocity</span>
                <span className="signature__sub">Digital Architecture House</span>
              </span>
              <span className="signature__cta">
                Visit the studio <span className="signature__arrow">→</span>
              </span>
            </a>
          </main>
        </div>

        {/* Colophon */}
        <footer className="colophon">
          <span>RATIO — A Calyvent instrument</span>
          <span>
            <a href="https://velocity.calyvent.com" target="_blank" rel="noopener">Velocity</a>
            {' · '}
            <a href="/privacy.html">Privacy</a>
            {' · '}
            <a href="/terms.html">Terms</a>
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App
