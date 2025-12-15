import { MenuItem, Match } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Atlas Mint Tea',
    description: 'Traditional Moroccan mint tea, served hot and sweet.',
    price: 15,
    category: 'coffee',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    name: 'Casablanca Coffee',
    description: 'Strong espresso with a touch of milk and spices.',
    price: 20,
    category: 'coffee',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: '3',
    name: 'Tajine Burger',
    description: 'Spiced beef patty with preserved lemon sauce and olives.',
    price: 65,
    category: 'food',
    image: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: '4',
    name: 'Marrakech Panini',
    description: 'Grilled chicken, harissa mayo, and melted cheese.',
    price: 45,
    category: 'food',
    image: 'https://picsum.photos/400/300?random=4',
  },
  {
    id: '5',
    name: 'Gazelle Horns',
    description: 'Almond pastry coated in orange blossom water.',
    price: 12,
    category: 'dessert',
    image: 'https://picsum.photos/400/300?random=5',
  },
  {
    id: '6',
    name: 'AFCON Victory Combo',
    description: '2 Burgers, 2 Fries, and 2 Drinks for the match.',
    price: 120,
    category: 'combo',
    image: 'https://picsum.photos/400/300?random=6',
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'combo', label: 'Match Combos' },
  { id: 'food', label: 'Food' },
  { id: 'coffee', label: 'Drinks' },
  { id: 'dessert', label: 'Sweets' },
];

export const MATCHES: Match[] = [
  {
    id: 'm1',
    homeTeam: 'Morocco',
    awayTeam: 'Egypt',
    homeFlag: '🇲🇦',
    awayFlag: '🇪🇬',
    time: '20:00',
    date: 'Today',
    status: 'live',
    score: '1 - 0',
    isMorocco: true,
  },
  {
    id: 'm2',
    homeTeam: 'Senegal',
    awayTeam: 'Cameroon',
    homeFlag: '🇸🇳',
    awayFlag: '🇨🇲',
    time: '17:00',
    date: 'Today',
    status: 'finished',
    score: '2 - 2',
  },
  {
    id: 'm3',
    homeTeam: 'Nigeria',
    awayTeam: 'Ivory Coast',
    homeFlag: '🇳🇬',
    awayFlag: '🇨🇮',
    time: '21:00',
    date: 'Tomorrow',
    status: 'upcoming',
  },
  {
    id: 'm4',
    homeTeam: 'Algeria',
    awayTeam: 'Tunisia',
    homeFlag: '🇩🇿',
    awayFlag: '🇹🇳',
    time: '18:00',
    date: 'Tomorrow',
    status: 'upcoming',
  }
];