import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSurah } from '@/lib/api';
import SurahView from '@/components/SurahView';
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: { nomor: string } }): Promise<Metadata> {
  try {
    const d = await getSurah(+params.nomor);
    return { title: `Surah ${d.namaLatin} (${d.nama})`, description: `Baca Surah ${d.namaLatin} – ${d.arti}, ${d.jumlahAyat} ayat, lengkap dengan latin, terjemahan, dan audio.` };
  } catch { return { title: 'Surah' }; }
}

export default async function Page({ params }: { params: { nomor: string } }) {
  const n = +params.nomor;
  if (!(n >= 1 && n <= 114)) notFound();
  try {
    const d = await getSurah(n);
    // Basmalah diambil dari ayat 1 Al-Fatihah (API), bukan ditulis manual. Al-Fatihah & At-Taubah tidak ditampilkan terpisah.
    const bis = n === 1 || n === 9 ? '' : (await getSurah(1)).ayat[0].teksArab;
    return <SurahView d={d} bis={bis} />;
  } catch (e: any) {
    return <p className="py-10 text-center text-mute">Surah gagal dimuat ({e.message}). Muat ulang halaman ini.</p>;
  }
}
