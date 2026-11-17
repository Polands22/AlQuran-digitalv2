import type { Metadata } from 'next';
import DoaList from '@/components/DoaList';
export const metadata: Metadata = { title: 'Doa Harian' };
export const revalidate = 86400;
export default async function DoaPage() {
  let d: any[] = [];
  try {
    const r = await fetch('https://equran.id/api/doa', { next: { revalidate: 86400 } });
    const j = await r.json();
    d = Array.isArray(j) ? j : j.data;
  } catch {}
  return (
    <div className="space-y-3">
      <h1 className="font-display text-2xl font-bold">Doa Harian</h1>
      {d?.length ? <DoaList data={d} /> : <p className="py-10 text-center text-mute">Doa gagal dimuat. Muat ulang halaman ini.</p>}
    </div>
  );
}
