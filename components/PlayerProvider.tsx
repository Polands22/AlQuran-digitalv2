'use client';
// Pemain audio global di layout: audio tidak terputus saat berpindah halaman.
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { QARI, type SurahDetail } from '@/lib/api';

type Cur = { s: number; n: number | null; playing: boolean };
type Ctx = { playAyah: (d: SurahDetail, n: number) => void; playFull: (d: SurahDetail) => void; toggle: () => void; cur: Cur };
const PCtx = createContext<Ctx>(null as any);
export const usePlayer = () => useContext(PCtx);
const fmt = (t: number) => (isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '0:00');

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const a = useRef<HTMLAudioElement>(null);
  const q = useRef<{ d: SurahDetail | null; i: number; full: boolean; reps: number }>({ d: null, i: 0, full: false, reps: 0 });
  const [title, setTitle] = useState('Pilih ayat atau surah untuk diputar');
  const [cur, setCur] = useState<Cur>({ s: 0, n: null, playing: false });
  const [open, setOpen] = useState(false);
  const y0 = useRef(0);
  const [t, setT] = useState(0), [dur, setDur] = useState(0);
  const [qari, setQari] = useState('05'), [spd, setSpd] = useState(1), [rep, setRep] = useState(1), [auto, setAuto] = useState(true);

  const load = useCallback((qr = qari, sp = spd) => {
    const el = a.current!, { d, i, full } = q.current;
    if (!d) return;
    el.src = full ? d.audioFull[qr] : d.ayat[i].audio[qr];
    el.playbackRate = sp;
    el.play().catch(() => setTitle('Audio gagal dimuat. Coba qari lain atau periksa koneksi.'));
    q.current.reps = 0;
    setCur((c) => ({ ...c, s: d.nomor, n: full ? null : i + 1 }));
    setTitle(full ? `${d.namaLatin} – satu surah penuh` : `${d.namaLatin} : ayat ${i + 1}`);
    if (!full) try { localStorage.setItem('ch_last', JSON.stringify({ s: d.nomor, a: i + 1 })); } catch {}
  }, [qari, spd]);

  const playAyah = (d: SurahDetail, n: number) => { q.current = { d, i: n - 1, full: false, reps: 0 }; load(); };
  const playFull = (d: SurahDetail) => { q.current = { d, i: 0, full: true, reps: 0 }; load(); };
  const toggle = () => { const el = a.current!; if (el.src) el.paused ? el.play() : el.pause(); };
  const ended = () => {
    const x = q.current, el = a.current!;
    if (x.full || !x.d) return;
    if (++x.reps < rep) { el.currentTime = 0; el.play(); return; }
    if (auto && x.i < x.d.ayat.length - 1) { x.i++; load(); }
  };
  const sel = 'max-w-[150px] rounded-lg border border-line bg-card p-1';

  return (
    <PCtx.Provider value={{ playAyah, playFull, toggle, cur }}>
      {children}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-gold bg-card"
        onTouchStart={(e) => (y0.current = e.touches[0].clientY)}
        onTouchEnd={(e) => { const dy = e.changedTouches[0].clientY - y0.current; if (dy > 60) setOpen(false); else if (dy < -60) setOpen(true); }}
      >
        <audio ref={a} onEnded={ended}
          onPlay={() => setCur((c) => ({ ...c, playing: true }))} onPause={() => setCur((c) => ({ ...c, playing: false }))}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onError={() => a.current?.src && setTitle('Audio gagal dimuat. Coba qari lain atau periksa koneksi.')} />
        <button className="mx-auto block w-full py-1.5" aria-label={open ? 'Sembunyikan pemutar' : 'Buka pemutar'} onClick={() => setOpen(!open)}>
          <span className="mx-auto block h-1.5 w-12 rounded-full bg-line" />
        </button>
        <div className="mx-auto max-w-3xl px-2 pb-2 text-xs">
          {open ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex basis-full items-center gap-2">
                <b className="flex-1 truncate text-sm">{title}</b>
                <button className="ico shrink-0" onClick={() => setOpen(false)} aria-label="Sembunyikan pemutar">⌄</button>
              </div>
              <button className="ico" onClick={toggle} aria-label="Putar/Jeda">{cur.playing ? '⏸' : '▶'}</button>
              <button className="ico" aria-label="Stop" onClick={() => { const el = a.current!; el.pause(); el.currentTime = 0; }}>■</button>
              <button className="ico" aria-label="Putar ulang" onClick={() => { const el = a.current!; if (el.src) { el.currentTime = 0; el.play(); } }}>↺</button>
              <span>{fmt(t)}</span>
              <input type="range" className="min-w-[110px] flex-1 accent-em" min={0} max={dur || 0} step={0.1} value={t} onChange={(e) => (a.current!.currentTime = +e.target.value)} aria-label="Progress" />
              <span>{fmt(dur)}</span>
              <input type="range" className="w-16 accent-em" min={0} max={1} step={0.05} defaultValue={1} onChange={(e) => (a.current!.volume = +e.target.value)} aria-label="Volume" />
              <select className={sel} value={spd} onChange={(e) => { setSpd(+e.target.value); a.current!.playbackRate = +e.target.value; }} aria-label="Kecepatan">
                {[0.75, 1, 1.25, 1.5].map((v) => <option key={v} value={v}>{v}×</option>)}
              </select>
              <select className={sel} value={qari} onChange={(e) => { setQari(e.target.value); load(e.target.value); }} aria-label="Qari">
                {Object.entries(QARI).map(([k, n]) => <option key={k} value={k}>{n}</option>)}
              </select>
              <select className={sel} value={rep} onChange={(e) => setRep(+e.target.value)} aria-label="Ulangi ayat">
                {[1, 3, 5, 10].map((v) => <option key={v} value={v}>Ulang {v}×</option>)}
              </select>
              <label className="flex items-center gap-1"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="accent-em" />Autoplay</label>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button className="ico shrink-0" onClick={toggle} aria-label="Putar/Jeda">{cur.playing ? '⏸' : '▶'}</button>
              <b className="flex-1 truncate text-sm">{title}</b>
              <button className="ico shrink-0" onClick={() => setOpen(true)} aria-label="Buka pemutar">⌃</button>
            </div>
          )}
        </div>
      </div>
    </PCtx.Provider>
  );
}
