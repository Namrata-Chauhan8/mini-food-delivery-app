import { Order, ORDER_STATUSES, OrderStatus } from '../types';

/** Seconds after `placedAt` at which each status becomes active. */
export const STATUS_TIMELINE_SECONDS = [0, 8, 16, 24, 32] as const;

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  'Order Placed': 'We have received your order.',
  Accepted: 'The restaurant has accepted your order.',
  Preparing: 'Your food is being freshly prepared.',
  'Out for Delivery': 'Your rider is on the way to you.',
  Delivered: 'Enjoy your meal!',
};

export const TERMINAL_STATUS: OrderStatus = ORDER_STATUSES[ORDER_STATUSES.length - 1];

/**
 * How far the simulation has progressed for an order placed at `placedAt`.
 * Pure and time-injectable, so order progress is derived rather than stored and
 * stays correct across backgrounding and app restarts.
 */
export function statusIndexFor(placedAt: number, now: number = Date.now()): number {
  const elapsedSeconds = (now - placedAt) / 1000;
  let index = 0;
  for (let i = 0; i < STATUS_TIMELINE_SECONDS.length; i += 1) {
    if (elapsedSeconds >= STATUS_TIMELINE_SECONDS[i]) index = i;
  }
  return index;
}

export function statusFor(order: Order, now: number = Date.now()): OrderStatus {
  if (order.completedStatus) return order.completedStatus;
  return ORDER_STATUSES[statusIndexFor(order.placedAt, now)];
}

export function secondsToNextStatus(
  placedAt: number,
  statusIndex: number,
  now: number = Date.now(),
): number | null {
  const nextThreshold = STATUS_TIMELINE_SECONDS[statusIndex + 1];
  if (nextThreshold === undefined) return null;
  return Math.max(0, Math.ceil(nextThreshold - (now - placedAt) / 1000));
}
