import { getSurah } from '@/lib/api';
// Pencarian kata di terjemahan Indonesia; data tiap surah di-cache oleh Next (revalidate 24 jam).
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get('q') || '').toLowerCase().trim();
  if (q.length < 3) return Response.json([]);
  const out: { s: number; name: string; a: number; t: string }[] = [];
  const ids = Array.from({ length: 114 }, (_, i) => i + 1);
  try {
    for (let i = 0; i < 114; i += 10) {
      const ds = await Promise.all(ids.slice(i, i + 10).map(getSurah));
      ds.forEach((d) => d.ayat.forEach((a) => { if (a.teksIndonesia.toLowerCase().includes(q)) out.push({ s: d.nomor, name: d.namaLatin, a: a.nomorAyat, t: a.teksIndonesia }); }));
    }
  } catch { return Response.json([], { status: 502 }); }
  return Response.json(out.slice(0, 100));
}
