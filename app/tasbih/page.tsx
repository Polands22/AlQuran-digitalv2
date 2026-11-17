'use client';
import { useState } from 'react';
import { useLS } from '@/lib/storage';
const D = ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar', 'Laa ilaaha illallah', 'Astaghfirullah'];
export default function Tasbih() {
  const [c, setC] = useLS('ch_tas', 0);
  const [target, setTarget] = useState(33);
  const [dz, setDz] = useState(D[0]);
  const tap = () => { const n = c + 1; setC(n); navigator.vibrate?.(target && n % target === 0 ? [80, 40, 80] : 15); };
  return (
    <div className="card text-center">
      <h1 className="mb-3 font-display text-2xl font-bold">Tasbih Digital</h1>
      <select className="btn mr-2" value={dz} onChange={(e) => setDz(e.target.value)}>{D.map((x) => <option key={x}>{x}</option>)}</select>
      <select className="btn" value={target} onChange={(e) => setTarget(+e.target.value)}><option value={33}>33</option><option value={99}>99</option><option value={0}>Tanpa target</option></select>
      <button onClick={tap} aria-label="Tambah hitungan" className="mx-auto my-6 grid h-52 w-52 select-none place-items-center rounded-full border-[6px] border-gold bg-em font-display text-6xl text-white transition active:scale-95">{c}</button>
      <p className="mb-3 text-mute">{dz}{target ? ` · putaran ke-${Math.floor(c / target) + (c % target ? 1 : 0)}, ${c % target || (c ? target : 0)}/${target}` : ''}</p>
      <button className="btn" onClick={() => setC(0)}>Atur ulang</button>
    </div>
  );
}
