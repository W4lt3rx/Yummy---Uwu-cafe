import { User, Product, TimeLog, SaleLog, LocaleType, WorkSession, ShiftLog } from '../types';

// Initial Data Seed
const INITIAL_USERS: User[] = [
  { id: '0', username: 'admin', password: '123', role: 'admin', allowedLocales: ['yummy', 'uwu'] },
  { id: '1', username: 'jefe', password: '123', role: 'admin', allowedLocales: ['yummy', 'uwu'] },
  { id: '2', username: 'empleado1', password: '123', role: 'worker', allowedLocales: ['yummy'] },
  { id: '3', username: 'empleado2', password: '123', role: 'worker', allowedLocales: ['uwu'] },
];

const INITIAL_PRODUCTS_YUMMY: Product[] = [
  { id: 'y1', name: 'Helado Fresa', price: 5, icon: '🍓', category: 'Helados' },
  { id: 'y2', name: 'Helado Vainilla', price: 5, icon: '🍦', category: 'Helados' },
  { id: 'y3', name: 'Banana Split', price: 12, icon: '🍌', category: 'Especiales' },
];

const INITIAL_PRODUCTS_UWU: Product[] = [
  { id: 'u1', name: 'Café Latte', price: 4, icon: '☕', category: 'Bebidas' },
  { id: 'u2', name: 'Matcha Cake', price: 6, icon: '🍰', category: 'Postres' },
  { id: 'u3', name: 'Boba Tea', price: 5, icon: '🧋', category: 'Bebidas' },
];

// Helper to simulate reading/writing JSON files
const getJSON = <T>(key: string, initialData: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveJSON = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const StorageService = {
  // --- Users ---
  getUsers: (): User[] => getJSON('users.json', INITIAL_USERS),
  saveUser: (user: User) => {
    const users = getJSON('users.json', INITIAL_USERS);
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    saveJSON('users.json', users);
  },
  deleteUser: (id: string) => {
    let users = getJSON('users.json', INITIAL_USERS);
    users = users.filter(u => u.id !== id);
    saveJSON('users.json', users);
  },

  // --- Products ---
  getProducts: (locale: LocaleType): Product[] => {
    return locale === 'yummy' 
      ? getJSON('productos_yummy.json', INITIAL_PRODUCTS_YUMMY)
      : getJSON('productos_uwu.json', INITIAL_PRODUCTS_UWU);
  },
  saveProducts: (locale: LocaleType, products: Product[]) => {
    const key = locale === 'yummy' ? 'productos_yummy.json' : 'productos_uwu.json';
    saveJSON(key, products);
  },

  // --- Logs (Raw Events) ---
  getTimeLogs: (): TimeLog[] => getJSON('logs_horario.json', []),
  addTimeLog: (log: TimeLog) => {
    const logs = getJSON('logs_horario.json', []);
    logs.unshift(log); // Add to beginning
    saveJSON('logs_horario.json', logs);
  },
  
  // --- Shift Logs (History with duration) ---
  getShiftLogs: (): ShiftLog[] => getJSON('historial_turnos.json', []),
  addShiftLog: (shift: ShiftLog) => {
    const logs = getJSON('historial_turnos.json', []);
    logs.unshift(shift);
    saveJSON('historial_turnos.json', logs);
  },
  deleteShiftLog: (id: string) => {
    let logs = getJSON('historial_turnos.json', []);
    logs = logs.filter((l: ShiftLog) => l.id !== id);
    saveJSON('historial_turnos.json', logs);
  },
  clearUserShiftLogs: (userId: string) => {
    let logs = getJSON('historial_turnos.json', []);
    logs = logs.filter((l: ShiftLog) => l.userId !== userId);
    saveJSON('historial_turnos.json', logs);
  },
  clearAllShiftLogs: () => {
    saveJSON('historial_turnos.json', []);
  },

  getSaleLogs: (): SaleLog[] => getJSON('logs_calculadora.json', []),
  addSaleLog: (log: SaleLog) => {
    const logs = getJSON('logs_calculadora.json', []);
    logs.unshift(log);
    saveJSON('logs_calculadora.json', logs);
  },

  // --- Session State (Per User) ---
  getSession: (userId: string): WorkSession => {
    const key = `session_${userId}`;
    return getJSON(key, {
      isActive: false,
      isOnPause: false,
      startTime: null,
      lastPauseTime: null,
      totalPauseTime: 0
    });
  },
  saveSession: (userId: string, session: WorkSession) => {
    saveJSON(`session_${userId}`, session);
  }
};