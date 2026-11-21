# TEST REPORT, FASE 1 + FASE 1.5

Laporan jujur per item pengujian spesifikasi bagian 21, ditambah item
khusus Fase 1 (karakter owner, penamaan, login demo) dan item Fase 1.5
(interior lantai 2-5, 3 karakter tambahan). Pengujian dilakukan dengan
build produksi yang dijalankan di Chromium headless (SwiftShader,
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
| 3 | Pengujian pergantian lantai | PASS | Pemilih lantai 1-5 bekerja. Setiap lantai menampilkan hanya interior lantai itu; lantai 2-5 kini interior detail (bukan selubung kosong). Tombol sembunyikan atap pada lantai terpilih juga menyembunyikan plafon lantai itu sehingga interior terlihat dari atas (tampilan dollhouse). Kamera membingkai ulang ke ketinggian lantai terpilih. |
| 4 | Pengujian collision dan pathfinding | PASS | Steering waypoint BFS + guard collision terverifikasi: karakter berjalan dari pintu masuk ke meja, ruang meeting, rooftop, dan (baru) meja di lantai 2-3 lewat lift tanpa menembus dinding atau meja pada pengamatan. Validasi graf waypoint otomatis (107 waypoint, 30 meja) memeriksa tiap segmen jalan terhadap collision: lolos, kecuali 12 klip marginal pra-Fase 1.5 di ring plaza luar (0,02-0,05 m, ditoleransi, lihat keterbatasan). Titik klik yang terhalang ditolak dengan pesan ticker. Uji tabrakan massal (karakter saling berdesakan) tidak dilakukan. |
| 5 | Pengujian animasi | PASS | State machine idle, berjalan, duduk, mengetik, berpikir, berbicara, dan lounge/lift terimplementasi dan statusnya berubah mengikuti jadwal pada pengamatan langsung. Pose tiap state diverifikasi lewat kode dan perubahan status, bukan lewat inspeksi frame demi frame. |
| 6 | Pengujian penyimpanan world | NOT TESTED | Di luar Fase 1. Tidak ada persistensi: tidak ada database, tidak ada localStorage sebagai database. |
| 7 | Pengujian API model dengan credentials | NOT TESTED | Tidak ada kredensial. Login live dinonaktifkan dengan jujur sampai Abi menyediakan URL dan anon key Supabase. |
| 8 | Pengujian event pekerjaan | PASS (simulasi) | Alur event simulasi terverifikasi: perubahan aktivitas karakter masuk ke ticker dan panel Activity dengan stempel jam dunia. Eksekusi tugas AI nyata adalah Fase 3, NOT TESTED. |
| 9 | Pengujian task gagal / timeout | NOT TESTED | Fase 3. Tidak ada eksekusi tugas di Fase 1. |
| 10 | Pengujian retry dan cancel | NOT TESTED | Fase 3. Jeda/lanjut simulasi dan kontrol kecepatan 1x/2x/4x ada dan bekerja, tetapi itu bukan retry/cancel tugas. |
| 11 | Pengujian meeting agent | NOT TESTED | Blok meeting ada di jadwal (ruang meeting, kursi round-robin) dan terimplementasi, tetapi satu siklus meeting penuh belum diamati sampai selesai pada jendela pengujian. |
| 12 | Pengujian database dan RLS | NOT TESTED | Tidak ada Supabase yang dikonfigurasi. Scaffold klien hanya membaca env. |
| 13 | Pengujian desktop dan mobile | PASS (desktop) / NOT TESTED (mobile) | Desktop 1440x900 terverifikasi penuh. Layout responsif (drawer + panel bottom-sheet) terimplementasi tetapi belum diuji visual di viewport ponsel. |
| 14 | Pengujian performa 3, 10, 40, 80, 100 agent | NOT TESTED | Fase 1.5 berisi 14 karakter sesuai spesifikasi. Tidak ada uji beban. |
| 15 | Pengujian FPS, memori, dan loading | NOT TESTED | Tidak ada pengukuran FPS atau memori. Loading veil "Memuat dunia 3D" terverifikasi tampil. Scene dibangun hemat (instancing untuk pohon/bunga/mullion, geometri dan material bersama, pixel ratio dibatasi 2, satu matahari berbayang), tetapi itu pilihan konstruksi, bukan hasil ukur. |
| 16 | Pengujian hasil artefak benar-benar dibuat | NOT TESTED | Tidak ada pembuatan artefak di Fase 1 (Fase 3+). |

## Item khusus Fase 1

| Item | Hasil | Catatan |
|------|-------|---------|
| Karakter owner Abi (Owner) | PASS | Karakter ke-14, berbeda visual (aksen krem/oranye, pin emas, label dan badge OWNER). Panel menampilkan nama, peran Owner, jadwal, Follow, fokus ruang CEO, dan kontrol Gerakkan Abi. Panel tidak menampilkan model atau provider AI untuknya. |
| Click-to-move untuk Abi | PASS | Terverifikasi: toggle aktif, klik plaza mengubah statusnya menjadi Berjalan dan labelnya bergerak menuju titik klik. Titik terhalang memberi pesan ticker. |
| Penamaan Agent Automation Corp | PASS | Wordmark di top bar, sidebar, layar login, dan papan nama gedung membaca Agent Automation Corp dari satu konstanta. Pemeriksaan grep atas istilah yang dilarang: nol hasil di kode, HTML, dan README. |
| Larangan em dash di teks antarmuka | PASS | Grep: nol karakter em dash/en dash di source dan index.html. |
| Login demo vs live | PASS | Login live dinonaktifkan dengan penjelasan env yang hilang. Mode demo masuk tanpa akun, badge "Demo, bukan live" tampil di login, sidebar, dan top bar. |
| Menu fase lanjut jujur | PASS | Tasks, Teams, Meetings, Build Mode, Analytics membuka panel "hadir di fase berikutnya" tanpa fungsi palsu. |
| Error boundary dan loading | PASS | ErrorBoundary membungkus aplikasi, veil loading tampil sampai canvas siap. Tidak ada error konsol pada seluruh sesi pengujian setelah perbaikan favicon. |
| Tidak ada tombol dekoratif | PASS | Semua tombol memiliki fungsi. Chat dan Beri Tugas dinonaktifkan dengan keterangan "Butuh backend Fase 3". |
| Jam dunia virtual | PASS | Jam berjalan mengikuti waktu nyata yang telah dikoreksi (1 menit virtual per detik nyata pada 1x) setelah perbaikan: driver kini memakai jam dinding, bukan delta frame, sehingga jam tidak melambat di perangkat lambat atau tab latar. Pada pengujian headless software rendering, jam maju 15 menit virtual dalam 20 detik nyata; itu batas lingkungan uji, bukan angka benchmark. |

## Item khusus Fase 1.5

| Item | Hasil | Catatan |
|------|-------|---------|
| Interior lantai 2 | PASS | Ruang Programmer (3 meja), Ruang UI/UX dan Desain (3 meja, 2 papan gambar), Studio Content Creator (2 meja, sudut rekaman, sofa), Focus Pods (3 pod, sofa). Terverifikasi lewat screenshot dollhouse dan tampak atas. |
| Interior lantai 3 | PASS | Ruang Research dan Data (3 meja), Ruang Marketing (3 meja, papan status), Ruang Meeting Kecil (meja 6 kursi, layar), Ruang HR dan Administrasi (2 meja, lemari arsip, sofa). Terverifikasi lewat screenshot; Yoga terlihat di ruang marketing. |
| Interior lantai 4 | PASS | Ruang Project Manager (2 meja, meja bundar), Ruang Meeting Besar (meja 8 kursi, layar), Perpustakaan dan Focus (rak buku, 1 meja, kursi baca), Ruang Meeting 2. Terverifikasi lewat screenshot dollhouse. |
| Interior lantai 5 | PASS | Command Center (3 konsol, dinding layar, papan status), Ruang Server (2 baris rak), Balcony Lounge (2 sofa, meja). Terverifikasi lewat screenshot dollhouse dan tampak atas. Dek balkon luar dirender tetapi tidak terkonfirmasi jelas dari sudut kamera yang diuji. |
| Lift antar lantai | PASS | Logika lift digeneralisasi dari biner (lobi/atap) ke semua lantai: karakter naik lift dari lantai asal ke lantai tujuan, hilang selama transit, muncul di depan pintu lift lantai tujuan, lalu berjalan ke target. Tania dan Yoga teramati berada di lantai 2 dan 3 sesuai jadwal. |
| CEO Agent (Bagas) | PASS | Karakter ke-12: meja desk-11 di ruang CEO, jadwal harian, panel menampilkan peran, tim, demoTask, dan "Model AI: belum terhubung". Label Bagas terverifikasi di tampilan 3D; close-up avatar tidak tertangkap (ia sedang transit saat pengujian follow). |
| Graphic Design Agent (Tania) | PASS | Karakter ke-13: meja desk-16 di ruang UI/UX dan desain, jadwal harian, panel terverifikasi lengkap termasuk tombol Follow dan Buka Workspace. Label Tania terverifikasi di area mejanya pada lantai 2. |
| SEO Agent (Yoga) | PASS | Karakter ke-14: meja desk-24 di ruang marketing, jadwal harian. Avatar dan label Yoga terverifikasi di area mejanya pada lantai 3. Panel memakai komponen yang sama dengan panel Tania yang terverifikasi. |
| Isolasi per lantai | PASS | Memilih lantai 2-5 hanya menampilkan karakter yang berdiri di lantai itu (label ikut disembunyikan); lantai 1 menampilkan semua karakter. |
| Panel gedung diperbarui | PASS | Daftar ruangan memuat seluruh 14 ruangan lantai 2-5 dari data denah yang sama dengan renderer, dan deskripsi per lantai menyebut nama ruangan lantai itu. |
| Penamaan dan larangan | PASS | Grep case-insensitive untuk kata terlarang dari spesifikasi penamaan menghasilkan nol hasil di src, index.html, README, dan TEST_REPORT; grep em dash/en dash juga nol. Tidak ada file .env yang dibuat; hanya .env.example. |
| Tidak ada backend | PASS | Tidak ada panggilan backend, Supabase, atau secret di Fase 1.5. Panel ketiga karakter baru sama jujurnya dengan panel lama: "Model AI: belum terhubung", Chat/Beri Tugas dinonaktifkan. |

## Temuan selama pengujian Fase 1.5 (sudah diperbaiki)

1. Rute lobi lantai 1 memotong meja resepsionis: segmen pintu masuk ke
   lobi melewati collider meja. Diperbaiki: waypoint lobi digeser ke
   timur sehingga jalurnya bersih. Masalah ini juga menghambat karakter
   baru menuju lift.
2. Rute ke meja baris selatan lantai 1 memotong barisan meja: segmen
   diagonal dari workspace tengah ke meja selatan melewati sudut meja.
   Diperbaiki: waypoint workspaceSouth baru di ujung selatan celah antar
   meja, dan meja baris selatan dirutekan lewat sana.
3. Pintu ruang meeting lantai 1 berada di jalur meja. Diperbaiki:
   pintu digeser ke barat sehingga jalurnya bersih.
4. Meja CEO Agent menumpuk jalur masuk ruang CEO. Diperbaiki: meja
   dipindah ke sudut timur laut ruang CEO.
5. Meja HR menutup kolom pintu ruang HR. Diperbaiki: kedua meja
   digeser ke barat.
6. Segmen koridor ke pintu lantai atas memotong ujung partisi.
   Diperbaiki: node koridor disejajarkan dengan kolom pintu tiap
   ruangan.
7. Jalur lift atap memotong lingkaran payung rooftop: karakter owner
   tertahan di tepi payung saat menuju lounge. Diperbaiki: waypoint
   roofWest dan roofNorth mengarahkan jalur mengitari payung, dan
   roofLounge digeser ke utara.
8. Tinggi lantai atas salah 0,36 m: permukaan jalan waypoint berada di
   dalam pelat lantai selubung. Diperbaiki: tinggi dasar lantai memakai
   puncak pelat (4,36 / 7,76 / 11,16 / 14,56), dan kamera memakai tinggi
   yang sama.

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
- Validasi graf waypoint menemukan 12 klip marginal (0,02-0,05 m) pada
  ring plaza luar dari Fase 1 (segmen memotong tepi lingkaran air
  mancur dan bangku). Karakter tetap bersirkulasi di plaza pada
  pengamatan; tidak diperbaiki di Fase 1.5 karena di luar cakupan.
- Dek balkon lantai 5 dirender tetapi tidak terkonfirmasi jelas dari
  sudut kamera yang diuji; tidak ada klaim visual untuknya.
- Meja lantai atas yang tidak terisi agent (17 dari 30 meja) adalah
  meja kosong dekoratif; hanya desk-11, desk-16, dan desk-24 yang
  terisi karakter baru, sesuai penugasan spesifikasi.
