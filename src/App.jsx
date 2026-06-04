import { useState } from 'react'
import './App.css'

const generateTypeScale = (baseSize, multiplier) => {
  const base = parseFloat(baseSize);
  const r = parseFloat(multiplier);
  const steps = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
  
  return steps.map((step) => {
    const sizePx = base * Math.pow(r, step);
    const sizeRem = sizePx / 16;
    
    return {
      step: step,
      label: `Step ${step >= 0 ? '+' : ''}${step}`,
      px: `${sizePx.toFixed(1)}px`,
      rem: `${sizeRem.toFixed(3)}rem`
    };
  });
};

const MULTIPLIERS = {
  'Minor Second': 1.067,
  'Major Second': 1.125,
  'Minor Third': 1.200,
  'Major Third': 1.250,
  'Perfect Fourth': 1.333,
  'Augmented Fourth': 1.414,
  'Perfect Fifth': 1.500,
  'Golden Ratio': 1.618,
};

function App() {
  const [baseSize, setBaseSize] = useState(16);
  const [multiplier, setMultiplier] = useState(1.414);
  const [customMultiplier, setCustomMultiplier] = useState('');
  const [copied, setCopied] = useState(false);

  const typeScale = generateTypeScale(baseSize, multiplier);

  const handleMultiplierChange = (value) => {
    setMultiplier(value);
    setCustomMultiplier('');
  };

  const handleCustomMultiplierChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMultiplier(value);
      setCustomMultiplier(e.target.value);
    }
  };

  const generateCSSCode = () => {
    return typeScale.map(step => `  --text-step${step.step}: ${step.rem};`).join('\n');
  };

  const generateTailwindCode = () => {
    return typeScale.map(step => `    'text-step${step.step}': '${step.rem}'`).join(',\n');
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-chassis text-carbon font-sans">
      {/* Top Bar - Logo */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-chassis border-b border-carbon/10 flex items-center px-6 z-50">
        <div className="flex items-center gap-4">
          <div className="logo-fraction">
            <div className="logo-numerator">RA</div>
            <div className="logo-line"></div>
            <div className="logo-denominator">TIO</div>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-carbon/60">RATIO</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="pt-16 flex min-h-screen">
        {/* Left Control Column */}
        <div className="w-80 border-r border-carbon/10 p-6 flex flex-col gap-8">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-carbon/60 mb-3">
              BASE SIZE (PX)
            </label>
            <input
              type="number"
              value={baseSize}
              onChange={(e) => setBaseSize(parseFloat(e.target.value) || 16)}
              className="w-full bg-chassis border border-carbon/20 px-4 py-3 text-sm font-mono focus:outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-carbon/60 mb-3">
              MULTIPLIER
            </label>
            <div className="flex flex-col gap-2">
              {Object.entries(MULTIPLIERS).map(([name, value]) => (
                <button
                  key={name}
                  onClick={() => handleMultiplierChange(value)}
                  className={`text-left px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all ${
                    multiplier === value
                      ? 'bg-signal text-white'
                      : 'bg-chassis border border-carbon/20 hover:border-signal'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-carbon/60 mb-3">
              CUSTOM MULTIPLIER
            </label>
            <input
              type="number"
              step="0.001"
              value={customMultiplier}
              onChange={handleCustomMultiplierChange}
              placeholder="1.000"
              className="w-full bg-chassis border border-carbon/20 px-4 py-3 text-sm font-mono focus:outline-none focus:border-ochre"
            />
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="flex-1 p-8 flex flex-col gap-8">
          {/* Visual Specimen List */}
          <div className="flex-1">
            <h2 className="text-xs font-bold tracking-widest uppercase text-carbon/60 mb-6">
              TYPE SPECIMEN
            </h2>
            <div className="space-y-4">
              {typeScale.map((step) => (
                <div
                  key={step.step}
                  className="flex items-baseline gap-6 border-b border-carbon/10 pb-4"
                >
                  <div className="w-24 text-xs font-mono text-carbon/60">
                    {step.label}
                  </div>
                  <div
                    className="flex-1 font-sans"
                    style={{ fontSize: step.rem }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div className="w-32 text-xs font-mono text-carbon/60 text-right">
                    {step.px} / {step.rem}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Export */}
          <div className="border-t border-carbon/10 pt-8">
            <h2 className="text-xs font-bold tracking-widest uppercase text-carbon/60 mb-4">
              CODE EXPORT
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-carbon/60 mb-2">
                  CSS ROOT VARIABLES
                </label>
                <pre className="bg-carbon/5 p-4 text-xs font-mono text-carbon/80 overflow-x-auto">
                  <code>{generateCSSCode()}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(generateCSSCode())}
                  className="mt-2 w-full bg-chassis border border-carbon/20 px-4 py-2 text-xs font-bold tracking-widest uppercase hover:bg-signal hover:text-white transition-colors"
                >
                  {copied ? 'COPIED' : 'COPY CSS'}
                </button>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-carbon/60 mb-2">
                  TAILWIND CONFIG
                </label>
                <pre className="bg-carbon/5 p-4 text-xs font-mono text-carbon/80 overflow-x-auto">
                  <code>{generateTailwindCode()}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(generateTailwindCode())}
                  className="mt-2 w-full bg-chassis border border-carbon/20 px-4 py-2 text-xs font-bold tracking-widest uppercase hover:bg-signal hover:text-white transition-colors"
                >
                  {copied ? 'COPIED' : 'COPY TAILWIND'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
