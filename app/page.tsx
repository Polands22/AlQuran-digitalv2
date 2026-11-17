import { DAILY, getSurah, getSurahs } from '@/lib/api';
import HomeClient from '@/components/HomeClient';
export const revalidate = 3600;

export default async function Home() {
  let surahs;
  try { surahs = await getSurahs(); }
  catch (e: any) { return <p className="py-10 text-center text-mute">Data gagal dimuat ({e.message}). Muat ulang halaman ini.</p>; }
  const [s, n] = DAILY[Math.floor(Date.now() / 864e5) % DAILY.length];
  let daily = null;
  try { const d = await getSurah(s); daily = { s, n, nama: d.namaLatin, ar: d.ayat[n - 1].teksArab, id: d.ayat[n - 1].teksIndonesia }; } catch {}
  return <HomeClient surahs={surahs} daily={daily} />;
}
