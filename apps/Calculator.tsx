
import React, { useState } from 'react';

type CalcMode = 'standard' | 'programmer' | 'units' | 'constants';

const PHYSICS_CONSTANTS = [
  { name: 'Speed of Light', symbol: 'c', value: '299,792,458', unit: 'm/s' },
  { name: 'Planck Constant', symbol: 'h', value: '6.626 x 10⁻³⁴', unit: 'J·s' },
  { name: 'Gravitational Constant', symbol: 'G', value: '6.674 x 10⁻¹¹', unit: 'm³/kg·s²' },
  { name: 'Boltzmann Constant', symbol: 'k', value: '1.380 x 10⁻²³', unit: 'J/K' },
  { name: 'Electron Mass', symbol: 'mₑ', value: '9.109 x 10⁻³¹', unit: 'kg' },
];

const Calculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('standard');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleDigit = (digit: string) => {
    setDisplay(prev => prev === '0' ? digit : prev + digit);
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // Basic parser for display purposes
      const result = eval((equation + display).replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  const renderStandard = () => (
    <div className="grid grid-cols-4 gap-2">
      {['AC', '±', '%', '÷'].map(btn => (
        <button key={btn} onClick={() => btn === 'AC' ? setDisplay('0') : null} className="h-14 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold">{btn}</button>
      ))}
      {['7', '8', '9', '×'].map(btn => (
        <button key={btn} onClick={() => /\d/.test(btn) ? handleDigit(btn) : handleOp(btn)} className={`h-14 rounded-full font-bold ${/\d/.test(btn) ? 'bg-white/5 hover:bg-white/10' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>{btn}</button>
      ))}
      {['4', '5', '6', '-'].map(btn => (
        <button key={btn} onClick={() => /\d/.test(btn) ? handleDigit(btn) : handleOp(btn)} className={`h-14 rounded-full font-bold ${/\d/.test(btn) ? 'bg-white/5 hover:bg-white/10' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>{btn}</button>
      ))}
      {['1', '2', '3', '+'].map(btn => (
        <button key={btn} onClick={() => /\d/.test(btn) ? handleDigit(btn) : handleOp(btn)} className={`h-14 rounded-full font-bold ${/\d/.test(btn) ? 'bg-white/5 hover:bg-white/10' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>{btn}</button>
      ))}
      <button onClick={() => handleDigit('0')} className="h-14 col-span-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-left px-6">0</button>
      <button onClick={() => handleDigit('.')} className="h-14 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold">.</button>
      <button onClick={calculate} className="h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold">=</button>
    </div>
  );

  const renderProgrammer = () => (
    <div className="flex flex-col space-y-4">
      <div className="space-y-1 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs">
        <div className="flex justify-between text-white/40"><span>HEX</span><span className="text-white">{(parseInt(display) || 0).toString(16).toUpperCase()}</span></div>
        <div className="flex justify-between text-white/40"><span>DEC</span><span className="text-white">{display}</span></div>
        <div className="flex justify-between text-white/40"><span>OCT</span><span className="text-white">{(parseInt(display) || 0).toString(8)}</span></div>
        <div className="flex justify-between text-white/40"><span>BIN</span><span className="text-white">{(parseInt(display) || 0).toString(2)}</span></div>
      </div>
      <div className="grid grid-cols-4 gap-2">
         {['A', 'B', 'C', 'D', 'E', 'F'].map(h => (
           <button key={h} className="h-10 rounded-lg bg-white/5 text-white/40 text-xs font-bold" disabled>{h}</button>
         ))}
         <button className="h-10 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold">AND</button>
         <button className="h-10 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold">OR</button>
      </div>
      {renderStandard()}
    </div>
  );

  const renderConstants = () => (
    <div className="space-y-3">
      {PHYSICS_CONSTANTS.map(c => (
        <div key={c.name} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
          <div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{c.name}</div>
            <div className="text-white font-mono">{c.symbol} = {c.value}</div>
            <div className="text-[10px] text-blue-400">{c.unit}</div>
          </div>
          <button 
            onClick={() => setDisplay(c.value.replace(/,/g, '').split(' ')[0])}
            className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-blue-600 rounded-md text-[10px] font-bold transition-all"
          >
            USE
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[#1c1c1c] text-white flex flex-col">
      <div className="flex bg-black/40 border-b border-white/5">
        {(['standard', 'programmer', 'units', 'constants'] as CalcMode[]).map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'text-blue-400 bg-white/5' : 'text-white/20 hover:text-white/60'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="text-right mb-4 shrink-0 overflow-hidden">
          <div className="text-white/30 text-xs font-mono h-4">{equation}</div>
          <div className="text-5xl font-light tracking-tight truncate">{display}</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mode === 'standard' && renderStandard()}
          {mode === 'programmer' && renderProgrammer()}
          {mode === 'constants' && renderConstants()}
          {mode === 'units' && <div className="p-8 text-center text-white/20 italic">Unit conversion engine initializing...</div>}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
