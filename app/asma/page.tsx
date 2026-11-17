import type { Metadata } from 'next';
import { ARTI } from '@/lib/api';
export const metadata: Metadata = { title: 'Asmaul Husna' };
export const revalidate = 86400;
export default async function Asma() {
  let d: { number: number; name: string; transliteration: string; en: { meaning: string } }[] = [];
  try { d = (await (await fetch('https://api.aladhan.com/v1/asmaAlHusna', { next: { revalidate: 86400 } })).json()).data; } catch {}
  return (
    <div>
      <h1 className="mb-3 font-display text-2xl font-bold">Asmaul Husna</h1>
      {!d.length && <p className="py-10 text-center text-mute">Data gagal dimuat. Muat ulang halaman ini.</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {d.map((x, i) => (
          <div key={x.number} className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
            <span className="grid h-9 min-w-9 place-items-center rounded-full border-2 border-gold text-sm font-bold text-gold">{x.number}</span>
            <span><b>{x.transliteration}</b><small className="block text-mute">{ARTI[i] || x.en.meaning}</small></span>
            <span className="ml-auto font-arab text-2xl text-em">{x.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
