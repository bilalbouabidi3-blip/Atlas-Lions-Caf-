export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'food' | 'dessert' | 'combo';
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'preparing' | 'completed';
  timestamp: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string; // Emoji or URL
  awayFlag: string; // Emoji or URL
  time: string;
  date: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: string;
  isMorocco?: boolean;
}

export enum AppRoute {
  HOME = '/',
  MENU = '/menu',
  CART = '/cart',
  ADMIN = '/admin',
  FAN_ZONE = '/fan-zone',
}

// AI Related Types
export type AspectRatio = '16:9' | '9:16';
export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedVideo {
  uri: string;
  expiry: string;
}

// Updated Context Definition
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  placeOrder: () => string | null;
  cancelOrder: (id: string) => void;
  orders: Order[];
  tableId: string | null;
  setTableId: (id: string) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  matches: Match[]; // Added matches to context
}