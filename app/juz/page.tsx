import type { Metadata } from 'next';
import { JUZ, getSurahs } from '@/lib/api';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Daftar 30 Juz' };
export const revalidate = 86400;
export default async function Juz() {
  const l = await getSurahs().catch(() => null);
  return (
    <div>
      <h1 className="mb-3 font-display text-2xl font-bold">30 Juz</h1>
      <div className="grid gap-2 sm:grid-cols-2">
        {JUZ.map(([s, a], i) => (
          <Link key={i} href={`/surah/${s}#a-${a}`} className="flex items-center gap-3 rounded-xl border border-line bg-card p-3 hover:border-gold">
            <span className="grid h-9 min-w-9 place-items-center rounded-full border-2 border-gold text-sm font-bold text-gold">{i + 1}</span>
            <span><b>Juz {i + 1}</b><small className="block text-mute">Mulai {l ? l[s - 1].namaLatin : 'surah ' + s} ayat {a}</small></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
