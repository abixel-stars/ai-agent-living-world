import type { AgentDef, NavKey, OwnerDef, ScheduleBlock } from '../types'

/** The 10 AI agent avatars. Provider/model fields are deliberately absent:
 *  no provider is connected in Phase 1, and the UI must say so honestly. */
export const AGENTS: AgentDef[] = [
  { id: 'kirana', name: 'Kirana', role: 'Manager Agent', team: 'Manajemen', personality: 'Tenang, rapi, menjaga ritme tim.', demoTask: 'Tugas demo: menyusun agenda tim', color: '#2F7D6B', outfit: 'jacket', hair: 'bun', skin: '#E8B98F', deskId: 'desk-1' },
  { id: 'bimo', name: 'Bimo', role: 'Programmer Agent', team: 'Teknologi', personality: 'Fokus, senang memecahkan masalah.', demoTask: 'Tugas demo: merapikan komponen UI', color: '#4E7FA6', outfit: 'sweater', hair: 'short', skin: '#D9A06B', deskId: 'desk-2' },
  { id: 'sinta', name: 'Sinta', role: 'UI/UX Designer Agent', team: 'Desain', personality: 'Detail, visual, suka mencoba variasi.', demoTask: 'Tugas demo: sketsa ulang panel agent', color: '#E8823F', outfit: 'shirt', hair: 'long', skin: '#F0C49C', deskId: 'desk-3' },
  { id: 'dimas', name: 'Dimas', role: 'Research Agent', team: 'Riset', personality: 'Penasaran, banyak membaca dan mencatat.', demoTask: 'Tugas demo: merangkum tren antarmuka', color: '#5B8C4A', outfit: 'sweater', hair: 'short', skin: '#C98F5F', deskId: 'desk-4' },
  { id: 'ayu', name: 'Ayu', role: 'Data Analyst Agent', team: 'Data', personality: 'Teliti, bicara dengan angka.', demoTask: 'Tugas demo: memeriksa angka aktivitas', color: '#7A6FB8', outfit: 'shirt', hair: 'bun', skin: '#EFC39A', deskId: 'desk-5' },
  { id: 'raka', name: 'Raka', role: 'Marketing Agent', team: 'Pemasaran', personality: 'Energik, suka bercerita.', demoTask: 'Tugas demo: menyusun draf pengumuman', color: '#C4574E', outfit: 'jacket', hair: 'fade', skin: '#DDA276', deskId: 'desk-6' },
  { id: 'nadia', name: 'Nadia', role: 'Copywriter Agent', team: 'Konten', personality: 'Luwes, peka pada nada tulisan.', demoTask: 'Tugas demo: menulis ulang sambutan dunia', color: '#D97B9E', outfit: 'shirt', hair: 'long', skin: '#F2CDAE', deskId: 'desk-7' },
  { id: 'fajar', name: 'Fajar', role: 'QA Agent', team: 'Kualitas', personality: 'Sistematis, tidak mudah puas.', demoTask: 'Tugas demo: memeriksa jalur klik avatar', color: '#C99A2E', outfit: 'sweater', hair: 'short', skin: '#C98A54', deskId: 'desk-8' },
  { id: 'lestari', name: 'Lestari', role: 'Finance Analyst Agent', team: 'Keuangan', personality: 'Hati hati, rapi soal anggaran.', demoTask: 'Tugas demo: menghitung biaya simulasi', color: '#4A6B8A', outfit: 'jacket', hair: 'bun', skin: '#E6B787', deskId: 'desk-9' },
  { id: 'gilang', name: 'Gilang', role: 'Administrative Agent', team: 'Operasional', personality: 'Ramah, sigap membantu.', demoTask: 'Tugas demo: menata jadwal ruangan', color: '#8A6B4A', outfit: 'shirt', hair: 'fade', skin: '#D89B62', deskId: 'desk-10' },
]

/** Abi, the human owner of the campus. Eleventh character, not an AI agent. */
export const OWNER: OwnerDef = {
  id: 'owner',
  name: 'Abi',
  displayName: 'Abi (Owner)',
  role: 'Owner, Agent Automation Corp',
  color: '#E8823F',
  outfit: 'jacket',
  hair: 'short',
  skin: '#E8B184',
}

/** Daily visual schedule per character. Times are virtual minutes since 07:00. */
export const SCHEDULES: Record<string, ScheduleBlock[]> = {
  kirana: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 25, activity: 'sitting', location: 'desk', label: 'Bekerja di meja' },
    { start: 130, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 190, activity: 'break', location: 'plaza', label: 'Istirahat di plaza' },
    { start: 240, activity: 'sitting', location: 'desk', label: 'Bekerja di meja' },
    { start: 380, activity: 'talking', location: 'lobby', label: 'Menyapa di lobi' },
    { start: 430, activity: 'sitting', location: 'desk', label: 'Bekerja di meja' },
    { start: 620, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  bimo: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'typing', location: 'desk', label: 'Mengetik di meja' },
    { start: 150, activity: 'thinking', location: 'desk', label: 'Berpikir di meja' },
    { start: 200, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 260, activity: 'typing', location: 'desk', label: 'Mengetik di meja' },
    { start: 400, activity: 'break', location: 'garden', label: 'Jalan di taman' },
    { start: 450, activity: 'typing', location: 'desk', label: 'Mengetik di meja' },
    { start: 630, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  sinta: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 35, activity: 'typing', location: 'desk', label: 'Mendesain di meja' },
    { start: 130, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 190, activity: 'thinking', location: 'desk', label: 'Mencari ide' },
    { start: 300, activity: 'break', location: 'plaza', label: 'Istirahat di plaza' },
    { start: 350, activity: 'typing', location: 'desk', label: 'Mendesain di meja' },
    { start: 600, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  dimas: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'sitting', location: 'desk', label: 'Membaca di meja' },
    { start: 140, activity: 'thinking', location: 'desk', label: 'Mencatat temuan' },
    { start: 210, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 280, activity: 'break', location: 'garden', label: 'Jalan di taman' },
    { start: 340, activity: 'sitting', location: 'desk', label: 'Membaca di meja' },
    { start: 610, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  ayu: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'typing', location: 'desk', label: 'Mengolah data' },
    { start: 130, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 200, activity: 'thinking', location: 'desk', label: 'Memeriksa angka' },
    { start: 320, activity: 'break', location: 'lobby', label: 'Kopi di lobi' },
    { start: 370, activity: 'typing', location: 'desk', label: 'Mengolah data' },
    { start: 615, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  raka: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 25, activity: 'talking', location: 'lobby', label: 'Menyapa di lobi' },
    { start: 80, activity: 'typing', location: 'desk', label: 'Menulis draf' },
    { start: 160, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 230, activity: 'break', location: 'plaza', label: 'Istirahat di plaza' },
    { start: 290, activity: 'typing', location: 'desk', label: 'Menulis draf' },
    { start: 600, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  nadia: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'typing', location: 'desk', label: 'Menulis di meja' },
    { start: 130, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 200, activity: 'thinking', location: 'desk', label: 'Mencari kata' },
    { start: 310, activity: 'break', location: 'garden', label: 'Jalan di taman' },
    { start: 360, activity: 'typing', location: 'desk', label: 'Menulis di meja' },
    { start: 605, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  fajar: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'sitting', location: 'desk', label: 'Memeriksa di meja' },
    { start: 150, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 220, activity: 'thinking', location: 'desk', label: 'Menyusun daftar uji' },
    { start: 330, activity: 'break', location: 'lobby', label: 'Kopi di lobi' },
    { start: 380, activity: 'sitting', location: 'desk', label: 'Memeriksa di meja' },
    { start: 620, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  lestari: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 35, activity: 'typing', location: 'desk', label: 'Menghitung anggaran' },
    { start: 140, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 210, activity: 'thinking', location: 'desk', label: 'Memeriksa angka' },
    { start: 320, activity: 'break', location: 'plaza', label: 'Istirahat di plaza' },
    { start: 370, activity: 'typing', location: 'desk', label: 'Menghitung anggaran' },
    { start: 610, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  gilang: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 25, activity: 'talking', location: 'lobby', label: 'Membantu di lobi' },
    { start: 90, activity: 'sitting', location: 'desk', label: 'Menata jadwal' },
    { start: 150, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 230, activity: 'break', location: 'garden', label: 'Jalan di taman' },
    { start: 290, activity: 'sitting', location: 'desk', label: 'Menata jadwal' },
    { start: 600, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
  owner: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'thinking', location: 'ceoDesk', label: 'Meninjau kantor pusat' },
    { start: 120, activity: 'talking', location: 'lobby', label: 'Menyapa di lobi' },
    { start: 180, activity: 'sitting', location: 'ceoDesk', label: 'Bekerja di ruang CEO' },
    { start: 300, activity: 'break', location: 'plaza', label: 'Jalan di plaza' },
    { start: 360, activity: 'lounging', location: 'roof', label: 'Santai di rooftop lounge' },
    { start: 460, activity: 'sitting', location: 'ceoDesk', label: 'Bekerja di ruang CEO' },
    { start: 620, activity: 'walking', location: 'entrance', label: 'Pulang' },
  ],
}

export interface NavItem {
  key: NavKey
  label: string
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7
  note: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'world', label: 'World', phase: 1, note: 'Dunia 3D kantor pusat' },
  { key: 'agents', label: 'Agents', phase: 1, note: '10 agent dan pemilik' },
  { key: 'tasks', label: 'Tasks', phase: 3, note: 'Orkestrasi tugas dan eksekusi AI' },
  { key: 'teams', label: 'Teams', phase: 3, note: 'Tim dan departemen' },
  { key: 'meetings', label: 'Meetings', phase: 4, note: 'Rapat antar agent' },
  { key: 'buildings', label: 'Buildings', phase: 1, note: 'Gedung HQ dan lantai' },
  { key: 'build', label: 'Build Mode', phase: 6, note: 'Editor gedung dan furnitur' },
  { key: 'analytics', label: 'Analytics', phase: 3, note: 'Statistik dari database' },
  { key: 'activity', label: 'Activity', phase: 1, note: 'Jejak aktivitas simulasi' },
  { key: 'settings', label: 'Settings', phase: 1, note: 'Pengaturan dunia dan akun' },
]

export const WORLD_NAME = 'Agent Automation Corp'
export const DAY_START_MINUTES = 7 * 60
