'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const NAV = [['/', 'Beranda'], ['/juz', 'Juz'], ['/bookmark', 'Bookmark'], ['/tasbih', 'Tasbih'], ['/doa', 'Doa'], ['/asma', 'Asmaul Husna']];
export default function Header() {
  const p = usePathname();
  const toggle = () => {
    const d = document.documentElement.classList.toggle('dark');
    localStorage.setItem('ch_theme', d ? 'dark' : 'light');
  };
  return (
    <header className="sticky top-0 z-20 border-b-2 border-gold bg-card">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex h-14 items-center">
          <Link href="/" className="mr-auto font-display text-xl font-bold text-em">☪ Cahaya Hati</Link>
          <button onClick={toggle} className="btn" aria-label="Ganti mode gelap/terang">🌓</button>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-1.5">
          {NAV.map(([h, l]) => (
            <Link key={h} href={h} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${p === h ? 'bg-em text-white' : 'text-mute'}`}>{l}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
