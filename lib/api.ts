export const API = 'https://equran.id/api/v2';
export type Surah = { nomor: number; nama: string; namaLatin: string; jumlahAyat: number; tempatTurun: string; arti: string; deskripsi: string; audioFull: Record<string, string> };
export type Ayat = { nomorAyat: number; teksArab: string; teksLatin: string; teksIndonesia: string; audio: Record<string, string> };
export type SurahDetail = Surah & { ayat: Ayat[] };

async function j<T>(p: string): Promise<T> {
  const r = await fetch(API + p, { next: { revalidate: 86400 } });
  if (!r.ok) throw new Error(`API equran.id ${r.status}`);
  return (await r.json()).data;
}
export const getSurahs = () => j<Surah[]>('/surat');
export const getSurah = (n: number) => j<SurahDetail>('/surat/' + n);

export const QARI: Record<string, string> = {
  '01': 'Abdullah Al-Juhany', '02': 'Abdul Muhsin Al-Qasim', '03': 'Abdurrahman As-Sudais',
  '04': 'Ibrahim Al-Dossari', '05': 'Misyari Rasyid Al-Afasy',
};
// Titik awal 30 juz [surah, ayat] (metadata navigasi; teks ayat tetap dari API)
export const JUZ: [number, number][] = [[1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],[9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],[29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]];
export const DAILY: [number, number][] = [[2,255],[94,5],[13,28],[2,286],[39,53],[65,3],[3,139],[2,152],[29,69],[93,3],[20,46],[2,153]];
export const ARTI = 'Maha Pengasih|Maha Penyayang|Maha Merajai|Maha Suci|Maha Memberi Kesejahteraan|Maha Memberi Keamanan|Maha Memelihara|Maha Perkasa|Maha Kuasa|Maha Megah|Maha Pencipta|Maha Mengadakan|Maha Membentuk Rupa|Maha Pengampun|Maha Memaksa|Maha Pemberi|Maha Pemberi Rezeki|Maha Pembuka|Maha Mengetahui|Maha Menyempitkan|Maha Melapangkan|Maha Merendahkan|Maha Meninggikan|Maha Memuliakan|Maha Menghinakan|Maha Mendengar|Maha Melihat|Maha Menetapkan|Maha Adil|Maha Lembut|Maha Mengetahui Rahasia|Maha Penyantun|Maha Agung|Maha Pengampun|Maha Mensyukuri|Maha Tinggi|Maha Besar|Maha Menjaga|Maha Pemberi Kecukupan|Maha Membuat Perhitungan|Maha Luhur|Maha Pemurah|Maha Mengawasi|Maha Mengabulkan|Maha Luas|Maha Bijaksana|Maha Mengasihi|Maha Mulia|Maha Membangkitkan|Maha Menyaksikan|Maha Benar|Maha Memelihara Urusan|Maha Kuat|Maha Kokoh|Maha Melindungi|Maha Terpuji|Maha Menghitung|Maha Memulai|Maha Mengembalikan|Maha Menghidupkan|Maha Mematikan|Maha Hidup|Maha Berdiri Sendiri|Maha Menemukan|Maha Mulia|Maha Esa|Maha Esa|Maha Dibutuhkan|Maha Kuasa|Maha Menentukan|Maha Mendahulukan|Maha Mengakhirkan|Maha Awal|Maha Akhir|Maha Nyata|Maha Tersembunyi|Maha Memerintah|Maha Tinggi|Maha Dermawan|Maha Penerima Tobat|Maha Pemberi Balasan|Maha Pemaaf|Maha Pengasih|Penguasa Kerajaan|Pemilik Kebesaran dan Kemuliaan|Maha Adil|Maha Mengumpulkan|Maha Kaya|Maha Memberi Kekayaan|Maha Mencegah|Maha Pemberi Derita|Maha Pemberi Manfaat|Maha Pemberi Cahaya|Maha Pemberi Petunjuk|Maha Pencipta Tanpa Contoh|Maha Kekal|Maha Pewaris|Maha Pandai|Maha Sabar'.split('|');
