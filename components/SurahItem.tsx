import Link from 'next/link';
import type { Surah } from '@/lib/api';
export default function SurahItem({ s, href }: { s: Surah; href?: string }) {
  return (
    <Link href={href || `/surah/${s.nomor}`} className="flex items-center gap-3 rounded-xl border border-line bg-card p-3 transition hover:-translate-y-0.5 hover:border-gold">
      <span className="grid h-9 min-w-9 place-items-center rounded-full border-2 border-gold text-sm font-bold text-gold">{s.nomor}</span>
      <span><b>{s.namaLatin}</b><small className="block text-mute">{s.arti} · {s.jumlahAyat} ayat · {s.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}</small></span>
      <span className="ml-auto font-arab text-2xl text-em">{s.nama}</span>
    </Link>
  );
}
