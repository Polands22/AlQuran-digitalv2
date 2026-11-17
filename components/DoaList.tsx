'use client';
import { useState } from 'react';
type Doa = { id: number; nama: string; ar: string; tr: string; idn: string; grup?: string; tentang?: string };
export default function DoaList({ data }: { data: Doa[] }) {
  const [q, setQ] = useState('');
  const v = q.trim().toLowerCase();
  const f = data.filter((x) => !v || [x.nama, x.grup, x.tr, x.idn, x.tentang].some((s) => s?.toLowerCase().includes(v)) || x.ar?.includes(q.trim()));
  return (
    <div className="space-y-3">
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari doa (misal: makan, tidur, safar)…" aria-label="Cari doa" />
      {!f.length && <p className="py-10 text-center text-mute">Doa tidak ditemukan. Coba kata kunci lain.</p>}
      {f.map((x) => (
        <article key={x.id ?? x.nama} className="card">
          <b>{x.nama}</b>
          <p className="ar font-arab text-3xl">{x.ar}</p>
          <p className="italic text-em">{x.tr}</p>
          <p>{x.idn}</p>
        </article>
      ))}
    </div>
  );
}
