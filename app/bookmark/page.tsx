'use client';
import Link from 'next/link';
import { useLS } from '@/lib/storage';
export default function Bookmark() {
  const [bm, setBm] = useLS<{ k: string; s: number; a: number; t: string }[]>('ch_bm', []);
  return (
    <div>
      <h1 className="mb-3 font-display text-2xl font-bold">Bookmark</h1>
      {!bm.length && <p className="py-10 text-center text-mute">Belum ada bookmark. Ketuk ☆ pada ayat untuk menyimpannya.</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {bm.map((x) => (
          <div key={x.k} className="flex items-center gap-2 rounded-xl border border-line bg-card p-3">
            <Link href={`/surah/${x.s}#a-${x.a}`} className="mr-auto"><b>{x.t}</b><small className="block text-mute">Ayat {x.a}</small></Link>
            <button className="ico" aria-label="Hapus bookmark" onClick={() => setBm((p) => p.filter((y) => y.k !== x.k))}>★</button>
          </div>
        ))}
      </div>
    </div>
  );
}
