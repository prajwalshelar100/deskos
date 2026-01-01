import React, { useState } from 'react';

type CalcMode = 'standard' | 'programmer' | 'units' | 'constants';

type Operator = '+' | '-' | '*' | '/';

const PHYSICS_CONSTANTS = [
  {
    name: 'Speed of Light',
    symbol: 'c',
    value: 299792458,
    display: '299,792,458',
    unit: 'm/s',
  },
  {
    name: 'Planck Constant',
    symbol: 'h',
    value: 6.626e-34,
    display: '6.626 × 10⁻³⁴',
    unit: 'J·s',
  },
  {
    name: 'Gravitational Constant',
    symbol: 'G',
    value: 6.674e-11,
    display: '6.674 × 10⁻¹¹',
    unit: 'm³/kg·s²',
  },
  {
    name: 'Boltzmann Constant',
    symbol: 'k',
    value: 1.380e-23,
    display: '1.380 × 10⁻²³',
    unit: 'J/K',
  },
  {
    name: 'Electron Mass',
    symbol: 'mₑ',
    value: 9.109e-31,
    display: '9.109 × 10⁻³¹',
    unit: 'kg',
  },
];

const Calculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('standard');
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);

  /* ---------- INPUT ---------- */

  const handleDigit = (digit: string) => {
    setDisplay(prev => {
      if (digit === '.' && prev.includes('.')) return prev;
      return prev === '0' ? digit : prev + digit;
    });
  };

  const handleOperator = (op: Operator) => {
    const current = parseFloat(display);

    if (storedValue !== null && operator) {
      const result = compute(storedValue, current, operator);
      setStoredValue(result);
      setDisplay('0');
    } else {
      setStoredValue(current);
      setDisplay('0');
    }

    setOperator(op);
  };

  const handleEquals = () => {
    if (storedValue === null || operator === null) return;

    const result = compute(storedValue, parseFloat(display), operator);
    setDisplay(String(result));
    setStoredValue(null);
    setOperator(null);
  };

  const handleSpecial = (btn: string) => {
    if (btn === 'AC') {
      setDisplay('0');
      setStoredValue(null);
      setOperator(null);
    }

    if (btn === '±') {
      setDisplay(d =>
        d.startsWith('-') ? d.slice(1) : '-' + d
      );
    }

    if (btn === '%') {
      setDisplay(d => String(parseFloat(d) / 100));
    }
  };

  /* ---------- LOGIC ---------- */

  const compute = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
    }
  };

  /* ---------- RENDER ---------- */

  const renderStandard = () => (
    <div className="grid grid-cols-4 gap-2">
      {['AC', '±', '%', '÷'].map(btn => (
        <button
          key={btn}
          onClick={() =>
            btn === '÷'
              ? handleOperator('/')
              : handleSpecial(btn)
          }
          className="h-14 rounded-full bg-white/10 text-white font-bold"
        >
          {btn}
        </button>
      ))}

      {[
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
      ].flat().map(btn => (
        <button
          key={btn}
          onClick={() =>
            /\d/.test(btn)
              ? handleDigit(btn)
              : handleOperator(
                  btn === '×' ? '*' : btn as Operator
                )
          }
          className={`h-14 rounded-full font-bold text-white ${
            /\d/.test(btn)
              ? 'bg-white/5'
              : 'bg-orange-500'
          }`}
        >
          {btn}
        </button>
      ))}

      <button
        onClick={() => handleDigit('0')}
        className="col-span-2 h-14 rounded-full bg-white/5 text-white font-bold text-left px-6"
      >
        0
      </button>

      <button
        onClick={() => handleDigit('.')}
        className="h-14 rounded-full bg-white/5 text-white font-bold"
      >
        .
      </button>

      <button
        onClick={handleEquals}
        className="h-14 rounded-full bg-orange-500 text-white font-bold"
      >
        =
      </button>
    </div>
  );

  const renderProgrammer = () => {
    const value = Number.isInteger(Number(display))
      ? Number(display)
      : 0;

    return (
      <div className="space-y-4">
        <div className="bg-black/40 p-4 rounded-xl font-mono text-xs">
          <div>HEX: {value.toString(16).toUpperCase()}</div>
          <div>DEC: {value}</div>
          <div>OCT: {value.toString(8)}</div>
          <div>BIN: {value.toString(2)}</div>
        </div>
        {renderStandard()}
      </div>
    );
  };

  const renderConstants = () => (
    <div className="space-y-3">
      {PHYSICS_CONSTANTS.map(c => (
        <div
          key={c.name}
          className="bg-white/5 p-4 rounded-xl flex justify-between"
        >
          <div>
            <div className="text-xs text-white/40">{c.name}</div>
            <div className="font-mono">{c.symbol} = {c.display}</div>
            <div className="text-xs text-blue-400">{c.unit}</div>
          </div>
          <button
            onClick={() => setDisplay(String(c.value))}
            className="px-3 py-1 bg-blue-600 rounded text-xs font-bold"
          >
            USE
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[#1c1c1c] text-white flex flex-col">
      <div className="flex border-b border-white/10">
        {(['standard', 'programmer', 'units', 'constants'] as CalcMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 text-xs uppercase ${
              mode === m ? 'text-blue-400' : 'text-white/40'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="text-right mb-4">
          <div className="text-5xl font-light truncate">{display}</div>
        </div>

        <div className="flex-1">
          {mode === 'standard' && renderStandard()}
          {mode === 'programmer' && renderProgrammer()}
          {mode === 'constants' && renderConstants()}
          {mode === 'units' && (
            <div className="text-white/30 italic text-center p-8">
              Unit conversion coming soon…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
