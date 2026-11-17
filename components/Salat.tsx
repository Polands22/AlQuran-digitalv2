'use client';
import { useEffect, useState } from 'react';
import { useLS } from '@/lib/storage';
const W: [string, string][] = [['Subuh', 'Fajr'], ['Dzuhur', 'Dhuhr'], ['Ashar', 'Asr'], ['Maghrib', 'Maghrib'], ['Isya', 'Isha']];
export default function Salat() {
  const [city, setCity] = useLS('ch_city', 'Jakarta');
  const [draft, setDraft] = useState('');
  const [t, setT] = useState<Record<string, string> | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    setDraft(city); setErr(false); setT(null);
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=20`)
      .then((r) => r.json()).then((j) => setT(j.data.timings)).catch(() => setErr(true));
  }, [city]);
  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <b>Jadwal salat hari ini</b>
        <span className="flex gap-1"><input className="w-32 rounded-lg border border-line bg-card px-2 py-1" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Kota" /><button className="btn !py-1" onClick={() => setCity(draft.trim() || 'Jakarta')}>Ubah</button></span>
      </div>
      {err ? <p className="mt-2 text-mute">Jadwal tidak tersedia. Periksa nama kota atau koneksi.</p>
        : !t ? <p className="mt-2 text-mute">Memuat…</p>
        : <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">{W.map(([n, k]) => <span key={k}><b>{n}</b> {t[k]}</span>)}</div>}
    </div>
  );
}
