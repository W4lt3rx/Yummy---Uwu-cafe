export type Role = 'admin' | 'worker';
export type LocaleType = 'yummy' | 'uwu';
export type ContextType = LocaleType | 'admin_panel' | null;

export interface User {
  id: string;
  username: string;
  password: string; // Plain text for this demo as requested
  role: Role;
  allowedLocales: LocaleType[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  icon: string; // Emoji or URL
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface TimeLog {
  id: string;
  userId: string;
  username: string;
  locale: LocaleType;
  type: 'entrada' | 'pausa' | 'salida';
  timestamp: string; // ISO String
}

// New Interface for Completed Shifts (History)
export interface ShiftLog {
  id: string;
  userId: string;
  username: string;
  locale: LocaleType;
  startTime: string; // ISO
  endTime: string; // ISO
  totalPauseTime: number; // ms
  totalWorkTime: number; // ms (End - Start - Pause)
}

export interface SaleLog {
  id: string;
  userId: string;
  username: string;
  locale: LocaleType;
  items: CartItem[];
  total: number;
  timestamp: string;
}

// Session state to track current active work session
export interface WorkSession {
  isActive: boolean;
  isOnPause: boolean;
  startTime: string | null;
  lastPauseTime: string | null;
  totalPauseTime: number; // in milliseconds
}

export const WEBHOOK_CONFIG = {
  yummy: {
    TIME_LOG: "YOUR_DISCORD_WEBHOOK_URL_UWU_TIME",
    SALES_LOG: "YOUR_DISCORD_WEBHOOK_URL_UWU_TIME"
  },
  uwu: {
    TIME_LOG: "https://discord.com/api/webhooks/1468247783545901069/NHxdUGcqhzSs4tcNHTMFhYrO2MTT5GSLtpE6l5dJGZBC9ytHaz-e3-DcW6ONLiHfEGpr",
    SALES_LOG: "https://discord.com/api/webhooks/1468234728904593623/JQNF4EqPXKfkjiMIsnErJyJ2E-udICTQma5Ix6gkSs4EPDq7afc9g_s-JFlqAbiFvv1n"
  },
 };