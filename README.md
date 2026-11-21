# Agent Automation Corp, Living World 3D

Dunia 3D kantor pusat Agent Automation Corp: 6 AI agent dan pemiliknya,
Abi (Owner), bergerak mengikuti jadwal visual harian di dalam satu gedung
kantor 3 lantai dengan interior detail di semua lantai. Ini adalah
**Fase 1** dari spesifikasi MASTER_PROMPT (7 fase), ditambah interior
lantai 2-5 dan 3 karakter tambahan pada **Fase 1.5**. Semua yang berjalan
di sini adalah **simulasi visual**. Tidak ada pekerjaan AI nyata, tidak ada
backend, tidak ada provider model yang terhubung.

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan, http://localhost:5173
npm run build    # typecheck + build produksi
npm run preview  # sajikan hasil build, http://localhost:4173
```

Membutuhkan Node.js 20+.

## Mode demo vs mode live

Aplikasi membuka layar login untuk Abi (pemilik). Karena belum ada backend
yang dikonfigurasi, login live dinonaktifkan dengan penjelasan jujur di
layar, dan tersedia tombol **Masuk Mode Demo**: dunia 3D lengkap, lokal
saja, tanpa akun, tanpa menyimpan data, dengan badge "Demo, bukan live"
di seluruh antarmuka.

Untuk mengaktifkan login live nanti, salin `.env.example` menjadi `.env`
dan isi kredensial proyek Supabase milik Abi:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Jangan menulis secret apa pun di dalam kode. Tanpa kedua variabel ini,
aplikasi tetap berjalan penuh dalam mode demo. Kredensial Supabase dan
kunci provider LLM (Fase 3) harus disediakan Abi; tidak ada yang dibuat
atau ditebak di repo ini.

## Yang ada di Fase 1

- Dunia 3D: lahan kantor pusat, jalan, taman, plaza dan air mancur,
  parkir dengan mobil dekoratif, pepohonan, lampu jalan, dan gedung
  kantor pusat 3 lantai. Interior detail di semua lantai: lantai 1
  (lobi dan resepsionis, ruang CEO, workspace terbuka, satu ruang
  meeting), lantai 2 (ruang programmer, ruang penyusun sistem, ruang
  meeting kecil, focus pods), lantai 3 (ruang analis dan data, ruang
  meeting besar, ruang server, lounge). Lift, tangga, koridor, dan toilet
  dekoratif di tiap lantai atas. Rooftop lounge di atap.
- Kamera: tampilan isometrik 3/4 bawaan, orbit bebas (drag), zoom
  (wheel), mode Atas, mode Fokus gedung, dan Follow untuk mengikuti
  satu karakter. Klik gedung membuka panel gedung. Tombol sembunyikan
  atap dan pemilih lantai (memilih satu lantai menampilkan hanya
  interior lantai itu; tombol sembunyikan atap juga membuka plafon
  lantai terpilih untuk tampilan dollhouse). Karakter naik lift antar
  lantai mengikuti jadwalnya.
- 7 karakter geometri prosedural (bukan gambar 2D, tanpa unduhan model
  eksternal): 6 AI agent dengan tampilan berbeda-beda, ditambah
  **Abi (Owner)**, karakter ke-7 yang berbeda secara visual (aksen
  krem dan oranye, pin emas, label dan badge OWNER) dan bukan AI agent.
  Panel Abi menampilkan jadwalnya, kontrol Follow, fokus ruang CEO, dan
  **Gerakkan Abi**: saat aktif, klik lantai atau plaza untuk
  mengarahkan Abi ke titik itu. Titik yang terhalang ditolak dengan
  pesan di ticker.
- Animasi state machine: idle, berjalan, duduk, mengetik, berpikir,
  berbicara, dengan transisi natural. Steering waypoint di lantai detail
  dan jalur luar, dengan collision sederhana yang nyata (karakter tidak
  menembus dinding, meja, atau satu sama lain).
- Jam dunia virtual (terpisah dari jam nyata) dan pencahayaan siang
  dengan bayangan lembut yang berubah mengikuti fase hari.
- Simulasi jadwal harian yang terlihat: berangkat, bekerja di meja,
  meeting, istirahat, pulang. Semua label demo jujur: penghitung agent
  aktif, tugas berjalan, dan biaya API menampilkan nilai demo (Rp 0).
- State Zustand yang dibentuk untuk koneksi backend (status agent dan
  event tugas mengikuti pemetaan event spesifikasi bagian 8), siap
  disambung di Fase 3. Tidak ada panggilan backend di Fase 1.
- Menu fase lanjut (Tasks, Teams, Meetings, Build Mode, Analytics)
  tampil sebagai navigasi, tetapi membuka status jujur "hadir di fase
  berikutnya", bukan fungsi palsu.

## Struktur folder

```
src/
  auth/         LoginScreen + scaffold klien Supabase (env only)
  avatars/      Model karakter prosedural + lapisan avatar + animasi
  components/   AppShell, Sidebar, TopBar, RightPanel, BottomToolbar,
                WorldCanvas, ErrorBoundary, panels/
  data/         worldData: definisi agent, owner, jadwal, navigasi, nama
  simulation/   Engine simulasi + driver jam dunia
  state/        Zustand store
  types/        Tipe bersama
  world/        Layout, material, gedung, interior, area luar, kamera,
                pencahayaan
```

Nama dunia dan semua string penamaan terpusat di `src/data/worldData.ts`
(`WORLD_NAME`). Penamaan memakai Agent Automation Corp dan kantor pusat
saja.

## Backlog (Fase 2-7, belum dibangun)

Fase 2: gedung pendukung, area rekreasi dan apartemen agent, mode
bangun. (Interior lantai 2-5 sudah dibangun pada Fase 1.5.) Fase 3:
orkestrasi backend dan eksekusi tugas AI nyata, integrasi provider
model, chat dan pemberian tugas. Fase 4: meeting multi-agent dan
kolaborasi. Fase 5: database Supabase, auth penuh, RLS, dan persistensi
world. Fase 6: build mode lanjutan dan analitik. Fase 7: polish,
performa skala besar, dan rilis. Detail status pengujian jujur ada di
`TEST_REPORT.md`.
