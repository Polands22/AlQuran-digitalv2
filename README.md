# Al-Qur'an Digital – Cahaya Hati (Next.js 14 + Tailwind + TypeScript)

## Menjalankan
    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

Butuh Node 18.17+ dan koneksi internet (data dari equran.id, jadwal salat dari api.aladhan.com).

## Struktur
- `app/` halaman (beranda, surah/[nomor], juz, bookmark, tasbih, doa, asma) + `api/search`
- `components/PlayerProvider.tsx` pemutar audio global (di layout, tidak putus saat pindah halaman)
- `lib/api.ts` fetcher equran.id (cache 24 jam), konstanta juz, qari
- `lib/storage.ts` hook localStorage (bookmark, terakhir dibaca, pengaturan)

## Catatan
- Teks Arab, latin, terjemahan, dan audio selalu dari API, tidak ada data ayat lokal.
- Arti Asmaul Husna (`lib/api.ts`) ditulis manual: mohon verifikasi sebelum rilis.
