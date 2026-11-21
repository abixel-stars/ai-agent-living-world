import type { AgentDef, NavKey, OwnerDef, ScheduleBlock } from '../types'

/** The 6 AI agent avatars. Provider/model fields are deliberately absent:
 *  no provider is connected in Phase 1, and the UI must say so honestly. */
export const AGENTS: AgentDef[] = [
  { id: 'kirana', name: 'Kirana', role: 'Manager Agent', team: 'Manajemen', personality: 'Tenang, rapi, menjaga ritme tim.', demoTask: 'Tugas demo: menyusun agenda tim', color: '#2F7D6B', outfit: 'jacket', hair: 'bun', skin: '#E8B98F', deskId: 'desk-1' },
  { id: 'sari', name: 'Sari', role: 'Asisten Owner', team: 'Manajemen', personality: 'Sigap, rapi, menjaga agenda owner.', demoTask: 'Tugas demo: menyiapkan agenda owner', color: '#C65D7B', outfit: 'shirt', hair: 'long', skin: '#F0C49C', deskId: 'desk-2' },
  { id: 'bimo', name: 'Bimo', role: 'Programmer Agent', team: 'Teknologi', personality: 'Fokus, senang memecahkan masalah.', demoTask: 'Tugas demo: merapikan komponen UI', color: '#4E7FA6', outfit: 'sweater', hair: 'short', skin: '#D9A06B', deskId: 'desk-3' },
  { id: 'rizky', name: 'Rizky', role: 'Penyusun Sistem', team: 'Teknologi', personality: 'Terstruktur, senang merancang alur sistem.', demoTask: 'Tugas demo: merapikan alur sistem', color: '#4A7C59', outfit: 'sweater', hair: 'fade', skin: '#D9A06B', deskId: 'desk-4' },
  { id: 'ayu', name: 'Ayu', role: 'Analis', team: 'Data', personality: 'Teliti, bicara dengan angka.', demoTask: 'Tugas demo: memeriksa angka aktivitas', color: '#7A6FB8', outfit: 'shirt', hair: 'bun', skin: '#EFC39A', deskId: 'desk-5' },
  { id: 'fajar', name: 'Fajar', role: 'Tester', team: 'Kualitas', personality: 'Sistematis, tidak mudah puas.', demoTask: 'Tugas demo: memeriksa jalur klik avatar', color: '#C99A2E', outfit: 'sweater', hair: 'short', skin: '#C98A54', deskId: 'desk-6' },
]

/** Abi, the human owner of the office. Seventh character, not an AI agent. */
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
  sari: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 25, activity: 'sitting', location: 'desk', label: 'Menyiapkan agenda' },
    { start: 130, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 190, activity: 'talking', location: 'lobby', label: 'Mendampingi di lobi' },
    { start: 250, activity: 'sitting', location: 'desk', label: 'Menyiapkan agenda' },
    { start: 380, activity: 'break', location: 'plaza', label: 'Istirahat di plaza' },
    { start: 430, activity: 'sitting', location: 'desk', label: 'Menyiapkan agenda' },
    { start: 615, activity: 'walking', location: 'entrance', label: 'Pulang' },
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
  rizky: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'typing', location: 'desk', label: 'Menyusun sistem di meja' },
    { start: 140, activity: 'thinking', location: 'desk', label: 'Merancang alur sistem' },
    { start: 210, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 280, activity: 'typing', location: 'desk', label: 'Menyusun sistem di meja' },
    { start: 400, activity: 'break', location: 'plaza', label: 'Istirahat di plaza' },
    { start: 450, activity: 'typing', location: 'desk', label: 'Menyusun sistem di meja' },
    { start: 625, activity: 'walking', location: 'entrance', label: 'Pulang' },
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
  fajar: [
    { start: 0, activity: 'walking', location: 'entrance', label: 'Tiba di kantor pusat' },
    { start: 30, activity: 'sitting', location: 'desk', label: 'Memeriksa di meja' },
    { start: 150, activity: 'meeting', location: 'meeting', label: 'Rapat tim' },
    { start: 220, activity: 'thinking', location: 'desk', label: 'Menyusun daftar uji' },
    { start: 330, activity: 'break', location: 'lobby', label: 'Kopi di lobi' },
    { start: 380, activity: 'sitting', location: 'desk', label: 'Memeriksa di meja' },
    { start: 620, activity: 'walking', location: 'entrance', label: 'Pulang' },
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
  { key: 'agents', label: 'Agents', phase: 1, note: '6 agent dan pemilik' },
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
