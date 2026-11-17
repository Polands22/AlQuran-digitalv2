'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import type { SurahDetail } from '@/lib/api';
import { useLS } from '@/lib/storage';
import { usePlayer } from './PlayerProvider';

type BM = { k: string; s: number; a: number; t: string };

export default function SurahView({ d, bis }: { d: SurahDetail; bis: string }) {
  const P = usePlayer();
  const [set, setSet] = useLS('ch_set', { ar: true, lat: true, id: true, fa: 34, ft: 16 });
  const [bm, setBm] = useLS<BM[]>('ch_bm', []);
  const [last, setLast] = useLS<{ s: number; a: number } | null>('ch_last', null);

  useEffect(() => {
    const h = location.hash;
    if (h) setTimeout(() => document.querySelector(h)?.scrollIntoView({ block: 'center' }), 200);
  }, [d.nomor]);
  useEffect(() => {
    if (P.cur.s === d.nomor && P.cur.n) document.getElementById('a-' + P.cur.n)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [P.cur.n]);

  const text = (n: number) => { const a = d.ayat[n - 1]; return `${a.teksArab}\n\n${a.teksLatin}\n\n"${a.teksIndonesia}"\n— QS. ${d.namaLatin}: ${n}`; };
  const copy = async (n: number) => { try { await navigator.clipboard.writeText(text(n)); alert('Ayat disalin'); } catch { alert('Gagal menyalin'); } };
  const share = async (n: number) => {
    if (navigator.share) { try { await navigator.share({ title: 'Al-Qur’an – Cahaya Hati', text: text(n) }); } catch {} }
    else copy(n);
  };
  const toggleBm = (a: number) => setBm((p) => { const k = `${d.nomor}:${a}`; return p.some((x) => x.k === k) ? p.filter((x) => x.k !== k) : [...p, { k, s: d.nomor, a, t: d.namaLatin }]; });
  const tog = (k: 'ar' | 'lat' | 'id') => setSet((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-3">
      <div className="card border-t-4 border-t-gold text-center">
        <p className="ar text-center font-arab text-5xl text-em">{d.nama}</p>
        <h1 className="font-display text-2xl font-bold">{d.nomor}. {d.namaLatin} – {d.arti}</h1>
        <p className="text-sm text-mute">{d.jumlahAyat} ayat · {d.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}</p>
        <p className="mt-2 text-sm text-mute" dangerouslySetInnerHTML={{ __html: d.deskripsi }} />
        <button className="btn-p mt-3" onClick={() => P.playFull(d)}>▶ Putar satu surah</button>
      </div>
      <div className="card flex flex-wrap items-center gap-4 text-sm">
        {(['ar', 'lat', 'id'] as const).map((k) => (
          <label key={k} className="flex items-center gap-1"><input type="checkbox" className="accent-em" checked={set[k]} onChange={() => tog(k)} />{k === 'ar' ? 'Arab' : k === 'lat' ? 'Latin' : 'Terjemahan'}</label>
        ))}
        <label>Arab <input type="range" className="accent-em" min={22} max={60} value={set.fa} onChange={(e) => setSet((p) => ({ ...p, fa: +e.target.value }))} /></label>
        <label>Teks <input type="range" className="accent-em" min={13} max={26} value={set.ft} onChange={(e) => setSet((p) => ({ ...p, ft: +e.target.value }))} /></label>
      </div>
      {bis && set.ar && <p className="ar text-center font-arab text-3xl text-em" style={{ textAlign: 'center' }}>{bis}</p>}
      {d.ayat.map((a) => {
        const playing = P.cur.playing && P.cur.s === d.nomor && P.cur.n === a.nomorAyat;
        const here = P.cur.s === d.nomor && P.cur.n === a.nomorAyat;
        return (
          <article id={`a-${a.nomorAyat}`} key={a.nomorAyat} className={`card scroll-mt-32 transition ${playing ? 'border-gold shadow-[0_0_0_3px_rgba(184,137,43,.3)]' : ''} ${last?.s === d.nomor && last.a === a.nomorAyat ? 'border-l-4 border-l-em' : ''}`}>
            <div className="mb-2 flex items-center gap-1.5">
              <span className="mr-auto grid h-9 min-w-9 place-items-center rounded-full border-2 border-gold text-sm font-bold text-gold">{a.nomorAyat}</span>
              <button className="ico" aria-label="Putar ayat" onClick={() => (here ? P.toggle() : P.playAyah(d, a.nomorAyat))}>{playing ? '⏸' : '▶'}</button>
              <button className="ico" aria-label="Bookmark" onClick={() => toggleBm(a.nomorAyat)}>{bm.some((x) => x.k === `${d.nomor}:${a.nomorAyat}`) ? '★' : '☆'}</button>
              <button className="ico" aria-label="Tandai terakhir dibaca" onClick={() => setLast({ s: d.nomor, a: a.nomorAyat })}>📍</button>
              <button className="ico" aria-label="Salin" onClick={() => copy(a.nomorAyat)}>⎘</button>
              <button className="ico" aria-label="Bagikan" onClick={() => share(a.nomorAyat)}>⇪</button>
            </div>
            {set.ar && <p className="ar font-arab" style={{ fontSize: set.fa }}>{a.teksArab}</p>}
            {set.lat && <p className="my-1.5 italic text-em" style={{ fontSize: set.ft }}>{a.teksLatin}</p>}
            {set.id && <p style={{ fontSize: set.ft }}>{a.teksIndonesia}</p>}
          </article>
        );
      })}
      <div className="flex justify-between py-4">
        {d.nomor > 1 ? <Link className="btn" href={`/surah/${d.nomor - 1}`}>‹ Sebelumnya</Link> : <span />}
        {d.nomor < 114 && <Link className="btn" href={`/surah/${d.nomor + 1}`}>Berikutnya ›</Link>}
      </div>
    </div>
  );
}
