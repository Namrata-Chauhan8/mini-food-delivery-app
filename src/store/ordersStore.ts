import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, DeliveryDetails, Order, OrderStatus, PriceBreakdown } from '../types';
import { createOrderId } from '../utils/id';
import { asyncStorage, STORAGE_KEYS } from './storage';

type PlaceOrderInput = {
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  pricing: PriceBreakdown;
  delivery: DeliveryDetails;
};

type OrdersState = {
  /** Newest first, so the history screen can render without sorting. */
  orders: Order[];
  hydrated: boolean;
  placeOrder: (input: PlaceOrderInput) => Order;
  /** Called once the tracking simulation reaches its terminal status. */
  markCompleted: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  clear: () => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      hydrated: false,

      placeOrder: (input) => {
        const order: Order = {
          id: createOrderId(),
          ...input,
          placedAt: Date.now(),
          completedStatus: null,
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      markCompleted: (orderId, status) =>
        set((state) => {
          const target = state.orders.find((o) => o.id === orderId);
          if (!target || target.completedStatus === status) return state;
          return {
            orders: state.orders.map((o) =>
              o.id === orderId ? { ...o, completedStatus: status } : o,
            ),
          };
        }),

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      clear: () => set({ orders: [] }),
    }),
    {
      name: STORAGE_KEYS.orders,
      storage: asyncStorage,
      partialize: (state) => ({ orders: state.orders }),
      onRehydrateStorage: () => () => {
        useOrdersStore.setState({ hydrated: true });
      },
    },
  ),
);
