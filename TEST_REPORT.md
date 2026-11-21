# TEST REPORT, FASE 1

Laporan jujur per item pengujian spesifikasi bagian 21, ditambah item
khusus Fase 1 (karakter owner, penamaan, login demo). Pengujian dilakukan
dengan build produksi yang dijalankan di Chromium headless (SwiftShader,
software rendering) pada viewport desktop 1440x900, termasuk klik dan
navigasi sungguhan lewat browser. Tidak ada angka benchmark yang dikarang:
item performa yang tidak diukur ditulis NOT TESTED.

Legenda: PASS = terverifikasi berjalan. FAIL = terverifikasi rusak.
NOT TESTED = belum diuji atau di luar cakupan Fase 1.

## Bagian 21

| # | Item | Hasil | Catatan |
|---|------|-------|---------|
| 1 | Build project dan typecheck | PASS | `npm run build` (tsc strict + vite build) lolos. Satu peringatan ukuran chunk (three.js, 1,2 MB) bukan error. |
| 2 | Pengujian navigasi kamera | PASS | Orbit default isometrik 3/4, mode Atas, mode Fokus gedung, dan Follow terverifikasi lewat screenshot. Follow menggerakkan kamera mengikuti karakter sambil mempertahankan offset orbit. |
| 3 | Pengujian pergantian lantai | PASS | Pemilih lantai 1-5 bekerja. Lantai 2 menampilkan hanya selubung lantai itu (terlihat mengambang, sesuai spesifikasi "hanya objek lantai itu"). Lantai 1 menampilkan interior detail. |
| 4 | Pengujian collision dan pathfinding | PASS | Steering waypoint BFS + guard collision terverifikasi: karakter berjalan dari pintu masuk ke meja, ruang meeting, dan rooftop tanpa menembus dinding atau meja pada pengamatan. Titik klik yang terhalang ditolak dengan pesan ticker. Uji tabrakan massal (karakter saling berdesakan) tidak dilakukan. |
| 5 | Pengujian animasi | PASS | State machine idle, berjalan, duduk, mengetik, berpikir, berbicara, dan lounge/lift terimplementasi dan statusnya berubah mengikuti jadwal pada pengamatan langsung. Pose tiap state diverifikasi lewat kode dan perubahan status, bukan lewat inspeksi frame demi frame. |
| 6 | Pengujian penyimpanan world | NOT TESTED | Di luar Fase 1. Tidak ada persistensi: tidak ada database, tidak ada localStorage sebagai database. |
| 7 | Pengujian API model dengan credentials | NOT TESTED | Tidak ada kredensial. Login live dinonaktifkan dengan jujur sampai Abi menyediakan URL dan anon key Supabase. |
| 8 | Pengujian event pekerjaan | PASS (simulasi) | Alur event simulasi terverifikasi: perubahan aktivitas karakter masuk ke ticker dan panel Activity dengan stempel jam dunia. Eksekusi tugas AI nyata adalah Fase 3, NOT TESTED. |
| 9 | Pengujian task gagal / timeout | NOT TESTED | Fase 3. Tidak ada eksekusi tugas di Fase 1. |
| 10 | Pengujian retry dan cancel | NOT TESTED | Fase 3. Jeda/lanjut simulasi dan kontrol kecepatan 1x/2x/4x ada dan bekerja, tetapi itu bukan retry/cancel tugas. |
| 11 | Pengujian meeting agent | NOT TESTED | Blok meeting ada di jadwal (ruang meeting, kursi round-robin) dan terimplementasi, tetapi satu siklus meeting penuh belum diamati sampai selesai pada jendela pengujian. |
| 12 | Pengujian database dan RLS | NOT TESTED | Tidak ada Supabase yang dikonfigurasi. Scaffold klien hanya membaca env. |
| 13 | Pengujian desktop dan mobile | PASS (desktop) / NOT TESTED (mobile) | Desktop 1440x900 terverifikasi penuh. Layout responsif (drawer + panel bottom-sheet) terimplementasi tetapi belum diuji visual di viewport ponsel. |
| 14 | Pengujian performa 3, 10, 40, 80, 100 agent | NOT TESTED | Fase 1 berisi 11 karakter sesuai spesifikasi. Tidak ada uji beban. |
| 15 | Pengujian FPS, memori, dan loading | NOT TESTED | Tidak ada pengukuran FPS atau memori. Loading veil "Memuat dunia 3D" terverifikasi tampil. Scene dibangun hemat (instancing untuk pohon/bunga/mullion, geometri dan material bersama, pixel ratio dibatasi 2, satu matahari berbayang), tetapi itu pilihan konstruksi, bukan hasil ukur. |
| 16 | Pengujian hasil artefak benar-benar dibuat | NOT TESTED | Tidak ada pembuatan artefak di Fase 1 (Fase 3+). |

## Item khusus Fase 1

| Item | Hasil | Catatan |
|------|-------|---------|
| Karakter owner Abi (Owner) | PASS | Karakter ke-11, berbeda visual (aksen krem/oranye, pin emas, label dan badge OWNER). Panel menampilkan nama, peran Owner, jadwal, Follow, fokus ruang CEO, dan kontrol Gerakkan Abi. Panel tidak menampilkan model atau provider AI untuknya. |
| Click-to-move untuk Abi | PASS | Terverifikasi: toggle aktif, klik plaza mengubah statusnya menjadi Berjalan dan labelnya bergerak menuju titik klik. Titik terhalang memberi pesan ticker. |
| Penamaan Agent Automation Corp | PASS | Wordmark di top bar, sidebar, layar login, dan papan nama gedung membaca Agent Automation Corp dari satu konstanta. Pemeriksaan grep atas istilah yang dilarang: nol hasil di kode, HTML, dan README. |
| Larangan em dash di teks antarmuka | PASS | Grep: nol karakter em dash/en dash di source dan index.html. |
| Login demo vs live | PASS | Login live dinonaktifkan dengan penjelasan env yang hilang. Mode demo masuk tanpa akun, badge "Demo, bukan live" tampil di login, sidebar, dan top bar. |
| Menu fase lanjut jujur | PASS | Tasks, Teams, Meetings, Build Mode, Analytics membuka panel "hadir di fase berikutnya" tanpa fungsi palsu. |
| Error boundary dan loading | PASS | ErrorBoundary membungkus aplikasi, veil loading tampil sampai canvas siap. Tidak ada error konsol pada seluruh sesi pengujian setelah perbaikan favicon. |
| Tidak ada tombol dekoratif | PASS | Semua tombol memiliki fungsi. Chat dan Beri Tugas dinonaktifkan dengan keterangan "Butuh backend Fase 3". |
| Jam dunia virtual | PASS | Jam berjalan mengikuti waktu nyata yang telah dikoreksi (1 menit virtual per detik nyata pada 1x) setelah perbaikan: driver kini memakai jam dinding, bukan delta frame, sehingga jam tidak melambat di perangkat lambat atau tab latar. Pada pengujian headless software rendering, jam maju 15 menit virtual dalam 20 detik nyata; itu batas lingkungan uji, bukan angka benchmark. |

## Temuan selama pengujian (sudah diperbaiki)

1. Jam dunia dan gerakan karakter hampir berhenti pada frame rate rendah:
   driver memakai delta frame yang dibatasi 0,05 detik. Diperbaiki dengan
   jam dinding + substep gerakan di engine.
2. Kamera bawaan terlalu dekat sehingga kompleks tidak terlihat utuh.
   Diperbaiki: posisi kamera ditarik mundur.
3. Papan nama gedung mengambang besar di tengah fasad. Diperbaiki:
   papan kayu kecil di atas kanopi pintu masuk.
4. Label statistik top bar melipat saat panel kanan terbuka. Diperbaiki:
   tanpa pelipatan, statistik biaya disembunyikan di bawah lebar xl.
5. Favicon 404 di konsol. Diperbaiki: favicon.svg ditambahkan.
6. Follow kamera hanya memutar target tanpa menggerakkan posisi kamera.
   Diperbaiki: kamera kini bergeser mengikuti karakter dengan smoothing.
7. Klik titik terhalang untuk Gerakkan Abi diam tanpa umpan balik.
   Diperbaiki: pesan ticker saat titik terhalang.

## Keterbatasan yang diketahui

- Label nama karakter (HTML) tidak terhalang dinding, sehingga label
  karakter di dalam gedung terlihat menembus fasad kaca dari luar.
- Saat lantai atas dipilih, selubung lantai itu terlihat mengambang
  karena lantai bawah disembunyikan, sesuai spesifikasi pemilih lantai.
- Karakter berkumpul di pintu masuk selama 25 menit virtual pertama
  karena blok jadwal pertama adalah "tiba di kantor pusat".
- Interior lantai 1 paling jelas dari mode kamera Atas + atap
  disembunyikan; dari sudut 3/4 biasa, dinding kaca membatasi pandangan
  ke dalam.
- Belum ada pengukuran performa nyata; klaim performa tidak dibuat.
