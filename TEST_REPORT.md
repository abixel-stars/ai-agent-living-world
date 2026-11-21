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

## Batch 2: perbaikan gedung, roster, dan performa (2026-11-21)

Bagian Fase 1 dan Fase 1.5 di atas menggambarkan keadaan SEBELUM rebuild
Batch 2 (gedung 5 lantai, 14 karakter, 30 meja). Bagian ini menggantikannya
untuk jumlah lantai, roster, dan denah: gedung kini 3 lantai, 7 karakter,
6 meja agent + 1 meja CEO. Pengujian dilakukan dengan build produksi yang
dijalankan di Chromium headless (SwiftShader) pada viewport desktop
1440x900 dan viewport ponsel 390x844, termasuk klik dan navigasi sungguhan
lewat browser. Tidak ada angka benchmark yang dikarang: performa yang
tidak diukur ditulis NOT MEASURED / NOT TESTED.

Tafsir yang dipakai (kata-kata Abi adalah otoritas; tafsir dicatat di sini):

- Butir 2, "lantai tidak mengapung": satu lantai ditampilkan dengan grup
  lantai digeser ke permukaan tanah (y = 0), lantai lain dan atap
  disembunyikan, karakter di lantai itu digeser tampil sama jauhnya ke
  bawah, kamera dibingkai ulang lewat mode fokus yang sudah ada.
  CameraRig tidak diubah; pemilih lantai mengalihkan orbit ke fokus saat
  satu lantai dipilih, dan kembali ke orbit saat gedung utuh dipilih.
  Lantai 1 tetap berarti tampilan gedung utuh, sesuai semantik pemilih
  lantai sebelumnya.
- Butir 4, "7 meja": 6 meja agent + 1 meja CEO untuk Abi. String peran:
  Ayu "Analis", Fajar "Tester", karakter baru "Asisten Owner" dan
  "Penyusun Sistem" (tanpa akhiran Agent, mengikuti wording perintah);
  peran Kirana ("Manager Agent") dan Bimo ("Programmer Agent") tidak diubah.
- Butir 5, "ruangan dibongkar dan diatur ulang": denah lantai 2-3 disusun
  ulang dari kit furnitur yang sudah ada; ruangan yang dikorbankan atau
  digabung dicatat persis di bawah.

| # | Item Batch 2 | Hasil | Catatan |
|---|------|-------|---------|
| 1 | Tampilan gedung utuh: lantai 2+ berperabot dan terlihat dari luar | PASS | Seluruh lantai 2 dan 3 dirender berperabot pada tampilan gedung utuh, terlihat lewat kaca selubung (kaca luar baru, opacity 0,22). Terverifikasi lewat screenshot eksterior sebelum dan sesudah memilih lantai. |
| 2 | Tampilan satu lantai: lantai tidak mengapung, di permukaan tanah | PASS | Hanya lantai terpilih yang dirender, digeser ke y = 0, tanpa pelat melayang di bawahnya. Terverifikasi lewat screenshot lantai 2, lantai 3, dan lompatan Buka Workspace ke lantai 2. |
| 3 | Tampilan satu lantai: atap hilang, tidak menutupi interior | PASS | Atap dan pelat plafon lantai yang ditampilkan selalu disembunyikan pada tampilan satu lantai; interior terlihat terbuka dari depan. Terverifikasi lewat screenshot yang sama. |
| 4 | Roster dipangkas ke 6 agent + Abi, 7 karakter, 7 meja | PASS | Kirana (Manager), Sari (Asisten Owner, BARU), Bimo (Programmer), Rizky (Penyusun Sistem, BARU), Ayu (Analis), Fajar (Tester), plus Abi (Owner). Nama baru Sari dan Rizky sebelumnya tidak dipakai di kode. Karakter lain (Sinta, Dimas, Raka, Nadia, Lestari, Gilang, Bagas, Tania, Yoga) dihapus total: definisi, jadwal, meja, dan entri panel. Hitungan diturunkan dari data (AGENTS.length); panel Agents, panel gedung, dan top bar konsisten. Buka Workspace melompat ke lantai meja agent yang bersangkutan (terverifikasi untuk Rizky, lantai 2) dan Follow bekerja pada tampilan satu lantai. |
| 5 | Gedung 3 lantai, ruangan diatur ulang, bug objek bangunan dicari dan diperbaiki | PASS | Denah baru di bawah. Bug yang ditemukan dan diperbaiki dicatat di bawah; graf waypoint divalidasi ulang (59 waypoint, 0 tautan menggantung, tiap lantai terhubung penuh dari liftnya, 0 klip tabrakan pada segmen dalam ruangan). |
| 6 | Optimisasi perangkat rendah | PASS (konstruksi) / NOT MEASURED (angka) | Pixel ratio dibatasi (Auto maks 1,75; Low 1), peta bayangan 2048 ke 1024, meja dan kursi di-instance (DeskSet/ChairSet), geometri dan material bersama sudah dipakai sebelumnya (termasuk model avatar), tidak ada alokasi per frame pada loop simulasi dan animasi yang diaudit. FPS dan memori NOT MEASURED: tidak ada jalur pengukuran nyata pada run headless ini, tidak ada angka yang diklaim. Render viewport ponsel 390x844 terverifikasi tampil tanpa kerusakan layout; kelancaran di ponsel kelas menengah sungguhan NOT TESTED. |

## Denah 3 lantai dan ruangan yang dikorbankan

Lantai 1 (tetap): Lobi, Area resepsionis, Ruang CEO, Workspace terbuka
(2 meja: Kirana, Sari), Ruang meeting, Rooftop lounge di atap.

Lantai 2: Ruang Programmer (Bimo), Ruang Penyusun Sistem (Rizky, memakai
kit desain: papan gambar dan rak), Ruang Meeting Kecil, Focus Pods.

Lantai 3: Ruang Analis dan Data (Ayu, memakai kit riset: rak dan
whiteboard), Ruang Meeting Besar, Ruang Server (Fajar), Lounge.

Dikorbankan seluruhnya: Studio Content Creator, Ruang Marketing, Ruang HR
dan Administrasi, Ruang Project Manager, Perpustakaan dan Focus, Command
Center, Balcony Lounge beserta dek balkon luar, dan Ruang Meeting 2
sebagai ruangan terpisah. Digabung atau dinamai ulang: Ruang UI/UX dan
Desain menjadi Ruang Penyusun Sistem (kit sama); Ruang Research dan Data
menjadi Ruang Analis dan Data (kit sama); Ruang Meeting Besar pindah dari
lantai 4 ke lantai 3; Ruang Server pindah dari lantai 5 ke lantai 3.
Lift, tangga, koridor, dan toilet dekoratif dipertahankan di tiap lantai
atas. Meja kosong dekoratif tidak ada lagi: semua 6 meja agent terisi.

## Bug objek bangunan: ditemukan dan diperbaiki

1. Interior lantai atas tidak dirender pada tampilan gedung utuh
   (UpperFloors hanya tampil saat satu lantai dipilih, dan selubung atas
   ikut hilang saat atap disembunyikan). Diperbaiki: semua lantai
   dirender pada tampilan gedung utuh; tombol sembunyikan atap kini hanya
   menyembunyikan teras atap pada tampilan itu.
2. Selubung lantai tunggal melayang pada ketinggian aslinya dengan atap
   dan plafon menutupi interior. Diperbaiki: translasi ke tanah,
   plafon selalu terbuka pada tampilan satu lantai, atap disembunyikan,
   kamera dibingkai ulang (lihat tafsir butir 2).
3. Pelat atap ganda yang sebidang dengan plafon lantai teratas (risiko
   z-fighting). Diperbaiki: pelat ganda dihapus; ROOF_Y didefinisikan
   ulang ke puncak plafon (11,16 m) sehingga dek teras duduk di atasnya
   tanpa tumpang tindih.
4. Kaca lantai dasar lebih pendek 0,04 m dari plafon (celah tembus
   pandang di sekeliling). Diperbaiki: kaca dan tiang mullion depan
   diperpanjang hingga bertemu plafon.
5. Panel pintu toilet melayang 0,02 m dari muka blok toilet.
   Diperbaiki: panel dan rambu digeser menempel pada muka blok.
6. Kaca selubung terlalu buram (opacity 0,38) sehingga interior lantai
   atas sulit dibaca dari luar. Diperbaiki: material kaca luar khusus
   opacity 0,22 hanya untuk selubung; partisi kaca interior tetap 0,38.
7. Whiteboard ruang riset tidak punya collider (karakter bisa menembus
   papan). Diperbaiki: collider ditambahkan pada lantai 3.
8. Dek balkon lantai 5 berada 0,30 m di bawah permukaan lantai interior
   dan melayang di luar kaca. Dihapus bersama pembongkaran lantai 5.
9. Tautan waypoint menggantung setelah meja dihapus (workspaceSouth ke
   meja yang tidak ada, ceoFront ke meja CEO Agent). Diperbaiki: tautan
   dihapus; graf divalidasi ulang tanpa error.

Diperiksa, bukan cacat, dibiarkan apa adanya: kaki avatar terhadap
permukaan lantai (sol sepatu 0,06 m di atas titik asal, permukaan lantai
0,08 m, selisih 0,02 m, tidak terlihat); pendaratan tangga yang
tumpang tindih dengan pelat plafon secara internal (tidak terlihat);
celah 0,16 m di atas partisi kaca (terbaca sebagai celah atas, dibiarkan);
label nama karakter (HTML) yang terlihat menembus kaca dan dinding
(keterbatasan lama, tidak berubah); panel lift dekoratif di dinding timur
lantai dasar (tidak diubah).

Tidak diperbaiki, di luar cakupan Batch 2 (koordinat lahan tidak
diubah): 5 segmen jalur plaza memotong lingkaran air mancur yang
diperluas jari-jari karakter pada sampling segmen (temuan lama Fase 1
yang sama, pada tepi ring plaza luar). Segmen dalam ruangan: 0 klip.

## Tidak diuji pada Batch 2

- Angka FPS, memori, dan waktu muat: NOT MEASURED, tidak ada klaim.
- Kelancaran pada ponsel kelas menengah sungguhan: NOT TESTED, hanya
  render viewport ponsel yang diperiksa.
- Satu siklus meeting penuh sampai selesai: tidak diamati ulang (mesin
  simulasi tidak diubah; validasi graf bersifat statis).
- Gerakkan Abi (click-to-move) pada tampilan satu lantai: NOT TESTED,
  perilaku ground-plane dipertahankan sesuai aturan.
- Tombol sembunyikan atap pada tampilan satu lantai adalah no-op visual
  (atap dan plafon sudah disembunyikan); tombol tetap berfungsi pada
  tampilan gedung utuh.
- Nama papan "Agent Automation Corp" yang mengambang (blok Html di
  HQBuilding) sengaja tidak diubah pada Batch 2; papan nama baru menjadi
  pekerjaan worker berikutnya.
- Tidak ada file .env yang dibuat; hanya .env.example. Tidak ada
  panggilan backend atau secret. Tidak ada push atau deploy.

## Batch 1: layar login dan otorisasi demo (2026-11-21)

Perintah Abi dari screenshot layar login (teks yang dilingkari hijau) dan
tiga poin tertulisnya. Dikerjakan oleh worker login, diverifikasi ulang
oleh koordinator lewat headless Chromium (CDP) pada build akhir.

| # | Perintah | Hasil |
|---|----------|-------|
| 1 | Hapus keterangan yang dilingkari: kotak "Login live belum dikonfigurasi...", badge "Demo, bukan live...", paragraf di bawah tombol demo. Placeholder email menjadi "nama@gmail.com". | PASS. Ketiga teks tidak ada lagi di layar; subtitle disederhanakan menjadi "Pilih mode demo atau login live."; placeholder email persis "nama@gmail.com" (dicek lewat DOM dan screenshot). |
| 2 | Placeholder password menjadi "Password" saja. | PASS. Placeholder password live persis "Password". |
| 3 | Masuk demo memakai otorisasi dulu: nama + password, khusus Abi. Kredensial salah ditolak dan tetap di layar login. Login live tetap nonaktif tanpa teks penjelasan konfigurasi. | PASS. Tombol "Masuk Mode Demo" membuka gate Nama + Password di dalam kartu login. Kredensial salah menampilkan "Nama atau password salah." dan tidak masuk dunia 3D (dicek lewat browser). Kredensial benar masuk ke dunia 3D (dicek lewat browser pada build akhir). Form live tetap terlihat tetapi nonaktif. |

Interpretasi yang dicatat: pencocokan nama tidak peka huruf besar/kecil
dan spasi di ujung diabaikan; kata sandi dicocokkan persis dengan nilai
yang Abi berikan di chat. Nilai kata sandi hanya ada di perbandingan kode
di `src/auth/LoginScreen.tsx`, tidak di dokumen, komentar, atau laporan
mana pun.

Tidak diuji pada Batch 1: viewport ponsel untuk layar login; alur login
live sungguhan (butuh Supabase Fase 3, di luar cakupan).

## Verifikasi koordinator (build akhir, 2026-11-21)

`npm run build` (tsc + vite) lulus. Grep: 0 kemunculan kata yang
dilarang, 0 em dash di
src/index.html/README/TEST_REPORT, tidak ada file .env. Satu sesi
headless Chromium (CDP, 1440x900) pada production preview: layar login
dan gate, penolakan kredensial salah, masuk dunia 3D, gedung utuh 3
lantai berperabot terlihat dari luar, papan nama di depan kantor tanpa
plakat melayang, drag kamera mengubah sudut pandang, lantai 2 membumi
tanpa atap, panel agent Rizky: semua dicek lewat DOM dan dinilai lewat
screenshot. Nol console error, nol page exception, nol request gagal
pada sesi tersebut. Screenshot koordinator di /tmp/coord-verify/
(01-login, 02-gate, 03-wrong, 04-world, 05-world-settled, 06-dragged,
07-floor2, 08-back-whole, 09-agent-panel). Pengamatan: drag di atas
kanvas dapat membuka panel gedung (klik pada mesh gedung); perilaku
pemilihan lewat klik ini sudah ada sejak Fase 1, bukan regresi Batch 3.
Komentar penjelasan scaffold di `src/auth/supabaseClient.ts` (bukan UI)
sengaja dibiarkan karena tidak tampil di layar.

## Batch 3: kamera bebas, papan nama berdiri (2026-11-21)

Bagian ini hanya menggantikan papan nama mengambang dan perilaku kamera;
jumlah lantai, roster, dan denah Batch 2 tidak berubah. Pengujian
dilakukan dengan build produksi yang dijalankan di Chromium headless
(SwiftShader) pada viewport desktop 1440x900, termasuk klik dan drag
sungguhan lewat browser. Tidak ada angka benchmark yang dikarang.

Tafsir yang dipakai (kata-kata Abi adalah otoritas; tafsir dicatat di sini):

- Butir 1, "kamera tidak terpaku ke 1 sudut": orbit bebas berarti
  putar, geser (pan), dan zoom dengan mouse dan sentuhan, tanpa batas
  polar yang mengunci. Batas yang dipertahankan hanya jarak
  (min 8 m, maks 75 m, seperti sebelumnya), kamera tidak boleh turun di
  bawah permukaan tanah (dijaga tiap frame, y minimum 0,7 m), dan
  target pan dibatasi pada lahan agar pengguna tidak kehilangan situs.
  Batas polar kini 0 sampai 1,64 rad (dari langsung di atas sampai
  sedikit di bawah horizontal); posisi di bawah tanah dicegah oleh
  penjaga ketinggian, bukan oleh batas polar.
- Butir 2, "terlalu kaku": sumber kekakuan yang ditemukan adalah
  `controls.update()` hanya dipanggil saat animasi transisi atau
  follow aktif, sehingga damping OrbitControls tidak pernah bekerja
  pada orbit bebas. Diperbaiki: update dipanggil tiap frame,
  dampingFactor 0,06, drag pengguna membatalkan glide transisi
  (onStart), dan perubahan pilihan (selection) tidak lagi memicu
  ulang bingkai kamera. Mode orbit/fokus/atas/follow memakai
  preset yang sama seperti sebelumnya; bingkai orbit tidak lagi
  ditambah tinggi lantai karena lantai tunggal kini digrounding
  di y = 0, jadi preset orbit yang sama membingkai semua tampilan
  lantai. Perubahan lantai yang butuh bingkai ulang tetap lewat
  pergantian mode di panel, seperti dirancang Batch 2.
- Butir 3, papan nama: papan Html mengambang dihapus total. Papan baru
  berdiri di plaza, di samping jalur masuk (pusat x -8,4, z -18,3,
  di selatan persimpangan jalur, barat plaza air mancur), menghadap
  sisi jalan dan kamera default dengan yaw -0,45 rad, panel 4,6 x
  1,3 m di atas dua tiang dengan pijakan batu di tanah, puncak panel
  2,15 m, jauh di bawah atap. Huruf dibuat sebagai tekstur canvas
  pada permukaan panel (tanpa fetch font jaringan, tanpa overlay
  DOM), sehingga terbaca dari kamera default dan terhalang geometri
  secara wajar dari belakang. Tidak ada teks lain yang ditambahkan.

| # | Item Batch 3 | Hasil | Catatan |
|---|------|-------|---------|
| 1 | Orbit bebas: putar, pan, zoom, tanpa kunci sudut | PASS | Drag memutar sampai tampak atas penuh (polar 0) dan sampai sudut rendah setinggi jalan tanpa terkunci atau melompat; kamera tetap di atas tanah, tidak ada rongga bawah tanah. Wheel zoom mendekatkan tampilan; right-drag menggeser tampilan dan tetap di situs. Sentuhan NOT TESTED (tidak ada emulasi sentuhan pada run headless ini; handler sentuhan adalah default OrbitControls, tidak diubah). |
| 2 | Gerakan kamera halus, transisi mode tanpa snap | PASS | Transisi orbit ke atas dan kembali ke orbit teramati lewat screenshot tanpa lompatan; damping berjalan tiap frame. Drag saat glide membatalkan glide. Mode Atas bekerja; mode Fokus bekerja lewat pemilih lantai dan Buka Workspace tidak diuji ulang di Batch 3 (logika pemicunya tidak diubah). Follow NOT TESTED: klik label agent lewat DOM tidak membuka panel (label memakai pointer-events-none, seleksi butuh klik 3D pada avatar yang bergerak); cabang follow di kode tidak diubah kecuali pemanggilan update yang kini selalu jalan. |
| 3 | Plakat mengambang dihapus, papan nama berdiri di depan kantor | PASS | Tidak ada lagi blok Html mengambang di HQBuilding (grep: nol). Papan baru terverifikasi lewat screenshot: berdiri di tanah dengan tiang dan pijakan, teks "Agent Automation Corp" terbaca dari kamera default, tidak menutupi pintu masuk atau gedung, sisi belakang polos kayu tanpa teks terbalik. Papan hanya tampil pada tampilan gedung utuh (lantai 1), sesuai syarat; pada tampilan satu lantai papan disembunyikan bersama selubung. |
| 4 | Penamaan dan larangan | PASS | Grep case-insensitive untuk kata terlarang dari spesifikasi penamaan menghasilkan nol hasil di src, index.html, README, dan TEST_REPORT; grep em dash/en dash pada file yang diubah juga nol. Nama di mana-mana tetap "Agent Automation Corp" dari satu konstanta. |
| 5 | Build dan konsol bersih | PASS | `npm run build` (tsc + vite) lolos, hanya peringatan ukuran chunk three.js seperti sebelumnya. Dua run headless: nol console error, nol page exception, nol failed request. |

## Pengamatan Batch 3 (bukan cacat, dicatat apa adanya)

- Pada satu drag ekstrem ke sudut terendah dari jarak dekat, kamera
  berakhir tepat di belakang pagar pembatas sehingga rel pagar tampil
  besar di depan lensa. Itu perilaku kamera bebas pada ketinggian
  minimum, bukan kamera di dalam geometri: kamera tetap di atas
  tanah dan pengguna bisa mengorbit menjauh. Batas ketinggian
  minimum dipertahankan 0,7 m.
- Papan nama memakai tekstur canvas, jadi hurufnya tidak memakai
  font antarmuka secara persis; tampilannya adalah huruf tebal
  sans-serif krem di atas panel kayu, sesuai palet yang ada.
- Tombol sembunyikan atap pada tampilan satu lantai tetap no-op
  visual seperti Batch 2; tidak diubah.

## Tidak diuji pada Batch 3

- Sentuhan (touch) pada perangkat sungguhan: NOT TESTED.
- Mode Follow mengikuti karakter yang berjalan: NOT TESTED, lihat
  tabel di atas.
- FPS, memori, dan kelancaran pada perangkat rendah sungguhan:
  NOT MEASURED / NOT TESTED.
- Tidak ada file .env yang dibuat; hanya .env.example. Tidak ada
  panggilan backend atau secret. Tidak ada push atau deploy.
