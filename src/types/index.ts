export type Account = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  section: string;
  isVeg: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  ratingCount: number;
  cuisines: string[];
  categoryIds: string[];
  deliveryTimeMins: number;
  priceForTwo: number;
  address: string;
  promoted: boolean;
};

export type CartItem = {
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  image: string;
  isVeg: boolean;
  qty: number;
};

export type PriceBreakdown = {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

export const ORDER_STATUSES = [
  'Order Placed',
  'Accepted',
  'Preparing',
  'Out for Delivery',
  'Delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';

export type DeliveryDetails = {
  fullName: string;
  phone: string;
  address: string;
  instructions: string;
  paymentMethod: PaymentMethod;
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  pricing: PriceBreakdown;
  delivery: DeliveryDetails;
  placedAt: number;
  completedStatus: OrderStatus | null;
};

export type AsyncState<T> = {
  data: T;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};
