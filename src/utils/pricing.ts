import { CartItem, PriceBreakdown } from '../types';

export const PRICING_CONFIG = {
  deliveryFee: 40,
  freeDeliveryThreshold: 499,
  taxRate: 0.05,
} as const;

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= PRICING_CONFIG.freeDeliveryThreshold ? 0 : PRICING_CONFIG.deliveryFee;
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * PRICING_CONFIG.taxRate);
}

/**
 * The single source of truth for order totals. Nothing here is ever written to a
 * store — the cart persists only items, and every screen derives money from this.
 */
export function calculatePricing(items: CartItem[]): PriceBreakdown {
  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(subtotal);
  return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax };
}

export function amountToFreeDelivery(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= PRICING_CONFIG.freeDeliveryThreshold) return 0;
  return PRICING_CONFIG.freeDeliveryThreshold - subtotal;
}

export function countCartItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
