'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Surah } from '@/lib/api';
import { useLS } from '@/lib/storage';
import SurahItem from './SurahItem';
import Salat from './Salat';

type Daily = { s: number; n: number; nama: string; ar: string; id: string };
type Hit = { s: number; name: string; a: number; t: string };

export default function HomeClient({ surahs, daily }: { surahs: Surah[]; daily: Daily | null }) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [last] = useLS<{ s: number; a: number } | null>('ch_last', null);
  const v = q.trim().toLowerCase();
  const m = v.match(/^(\d+)\s*[:\s.]\s*(\d+)$/);
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const f = surahs.filter((s) => !v || String(s.nomor) === v || norm(s.namaLatin).includes(norm(v)) || s.nama.includes(q.trim()) || s.arti.toLowerCase().includes(v));
  const target = m ? surahs[+m[1] - 1] : null;

  useEffect(() => {
    setHits(null);
    if (v.length < 3 || m || /^\d+$/.test(v)) { setBusy(false); return; }
    setBusy(true);
    const c = new AbortController();
    const t = setTimeout(() => fetch('/api/search?q=' + encodeURIComponent(v), { signal: c.signal })
      .then((r) => r.json()).then((h) => { setHits(h); setBusy(false); }).catch(() => {}), 500);
    return () => { clearTimeout(t); c.abort(); };
  }, [v]);

  const h = new Date().getHours();
  const greet = h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
  const lastS = last ? surahs[last.s - 1] : null;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border-b-4 border-gold bg-gradient-to-br from-[#064e38] via-[#0b6b4b] to-[#0f8a62] p-6 text-white">
        <h1 className="font-display text-3xl font-bold">Al-Qur’an Digital</h1>
        <p className="mb-4 mt-1 opacity-90">Assalamu’alaikum warahmatullahi wabarakatuh. {greet}, semoga hati kita selalu tenang bersama Al-Qur’an.</p>
        <Link className="inline-block rounded-xl bg-gold px-4 py-2 font-semibold text-white" href={lastS ? `/surah/${last!.s}#a-${last!.a}` : '/surah/1'}>
          {lastS ? `Lanjutkan membaca: ${lastS.namaLatin} ayat ${last!.a}` : 'Mulai membaca dari Al-Fatihah'}
        </Link>
      </section>
      <div className="flex gap-5 text-sm text-mute"><span>114 surah</span><span>30 juz</span><span>6.236 ayat</span></div>
      {daily && (
        <div className="card">
          <small className="text-gold">Ayat pilihan hari ini · {daily.nama} : {daily.n}</small>
          <p className="ar font-arab text-3xl">{daily.ar}</p>
          <p>{daily.id}</p>
          <Link href={`/surah/${daily.s}#a-${daily.n}`} className="btn mt-2 inline-block">Baca selengkapnya</Link>
        </div>
      )}
      <Salat />
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari surah, nomor, “2:255”, atau kata dalam terjemahan…" aria-label="Pencarian" />
      {m && (target && +m[2] >= 1 && +m[2] <= target.jumlahAyat
        ? <Link className="btn-p inline-block" href={`/surah/${m[1]}#a-${m[2]}`}>Buka {target.namaLatin} ayat {m[2]}</Link>
        : <p className="py-6 text-center text-mute">Surah atau ayat tidak ditemukan.</p>)}
      {busy && <p className="text-mute">Mencari di terjemahan…</p>}
      {hits && (
        <div className="card">
          <b>{hits.length ? `${hits.length} ayat mengandung “${v}”` : `Tidak ada ayat yang mengandung “${v}”`}</b>
          {hits.slice(0, 50).map((x) => (
            <Link key={x.s + ':' + x.a} href={`/surah/${x.s}#a-${x.a}`} className="mt-2 block"><b className="text-em">{x.name} : {x.a}</b> {x.t}</Link>
          ))}
        </div>
      )}
      {!m && (f.length
        ? <div className="grid gap-2 sm:grid-cols-2">{f.map((s) => <SurahItem key={s.nomor} s={s} />)}</div>
        : !hits && !busy && <p className="py-6 text-center text-mute">Tidak ada surah yang cocok. Coba kata lain.</p>)}
    </div>
  );
}
