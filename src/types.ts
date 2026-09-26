export type ProductCategory = 
  | 'all'
  | 'classic-cakes'
  | 'gourmet-tiers'
  | 'desserts-tarts'
  | 'cookies-bakes'
  | 'viennoiserie'
  | 'gift-hampers';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  weight: string;
  servings: string;
  badge?: string;
  isEggless: boolean;
  isGlutenFree?: boolean;
  isNutFree?: boolean;
  hasFrenchButter?: boolean;
  occasion?: ('birthday' | 'anniversary' | 'tea-party' | 'luxury-gift')[];
  description: string;
  leadTime: string;
  imageType: 'valrhona-truffle' | 'hazelnut-truffle' | 'tropical-tier' | 'butterscotch-crunch' | 'viennoiserie' | 'rose-macarons' | 'pistachio-tart' | 'raspberry-tier' | 'basque-cheesecake' | 'mille-feuille' | 'valrhona-brownie';
  inStock: boolean;
  batchCapacity: number;
  batchBooked: number;
  ingredients: {
    name: string;
    description: string;
  }[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  isEggless: boolean;
  plaqueInscription?: string;
  dispatchSlot: string;
  quantity: number;
  imageType: Product['imageType'];
}

export interface BespokeCakeConfig {
  occasion: string;
  tierSize: '1-tier' | '2-tier' | '3-tier';
  tierLabel: string;
  spongeFlavor: string;
  fillingFlavor: string;
  exteriorFinish: string;
  finishPrice: number;
  dietary: 'standard' | 'eggless' | 'gluten-friendly';
  plaqueMessage: string;
  deliveryDate: string;
  fulfillmentMethod: 'pickup' | 'chilled-van';
  moodboardImage?: string;
  customNotes?: string;
}

export interface KitchenOrder {
  id: string;
  time: string;
  tag?: string;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  vipStatus?: string;
  confectionName: string;
  confectionSpecs: string[];
  netWeight?: string;
  internalDowels?: boolean;
  plaqueInscription: string;
  slotTime: string;
  destination: string;
  assignedVan: string;
  driverName?: string;
  stage: 'deck-baking' | 'decorating' | 'qc-chill' | 'ready-dispatch';
  stageNote?: string;
}

export interface FleetVan {
  id: string;
  number: string;
  driverName: string;
  driverPhone: string;
  status: 'en-route' | 'docked' | 'standby';
  specialty: string;
  temperature: number;
  humidity: number;
  speed: string;
  vibrationStatus: string;
  currentLocation: string;
  eta: string;
  orderPayload: string;
  percentCompleted: number;
}

export interface PantryItem {
  name: string;
  stock: string;
  threshold: string;
  status: 'healthy' | 'reorder-sent' | 'near-warning';
}

export interface BespokeInquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  submittedTime: string;
  status: 'awaiting-triage' | 'chef-pricing' | 'tasting-scheduled' | 'quote-sent' | 'hearth-booked';
  eventType: string;
  eventDate: string;
  guestScale: string;
  dietaryStandard: string;
  exteriorFinish: string;
  tierArchitecture: {
    tier: string;
    description: string;
    weight: string;
  }[];
  moodboardImages: string[];
  quoteTariff: {
    baseStructure: number;
    sugarwork: number;
    goldLeafing: number;
    refrigeratedLogistics: number;
    recommendedTotal: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'patron' | 'pastry_chef' | 'admin';
  phone?: string;
  createdAt?: string;
}

export interface TastingReservation {
  id?: string;
  flightName: string;
  reservationDate: string;
  timeSlot: string;
  guestCount: number;
  patronName: string;
  patronPhone: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
