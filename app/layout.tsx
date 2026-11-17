import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import PlayerProvider from '@/components/PlayerProvider';

export const metadata: Metadata = {
  title: { default: 'Al-Qur’an Digital – Cahaya Hati', template: '%s | Cahaya Hati' },
  description: 'Baca Al-Qur’an 114 surah lengkap: teks Arab, latin, terjemahan Indonesia, dan audio murottal.',
  openGraph: { title: 'Al-Qur’an Digital – Cahaya Hati', description: 'Al-Qur’an 114 surah dengan audio murottal.', type: 'website', locale: 'id_ID' },
};
const THEME = `try{var t=localStorage.getItem('ch_theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
      </head>
      <body>
        <PlayerProvider>
          <Header />
          <main className="mx-auto max-w-3xl px-4 pb-32 pt-4">{children}</main>
        </PlayerProvider>
      </body>
    </html>
  );
}
