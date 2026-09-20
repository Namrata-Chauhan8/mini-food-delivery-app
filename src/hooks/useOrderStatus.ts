import { useEffect, useState } from 'react';
import { useOrdersStore } from '../store/ordersStore';
import { Order, ORDER_STATUSES, OrderStatus } from '../types';
import {
  secondsToNextStatus,
  statusIndexFor,
  TERMINAL_STATUS,
} from '../utils/orderStatus';

export type OrderProgress = {
  status: OrderStatus;
  statusIndex: number;
  isComplete: boolean;
  /** Seconds until the next status, or null once delivered. */
  secondsToNext: number | null;
};

/**
 * Drives the live tracking UI. All the arithmetic lives in utils/orderStatus so
 * it stays pure and testable; this hook only supplies the clock and writes the
 * terminal status back to the store exactly once.
 */
export function useOrderStatus(order: Order | undefined): OrderProgress {
  const markCompleted = useOrdersStore((s) => s.markCompleted);
  const [now, setNow] = useState(() => Date.now());

  const isComplete = order
    ? statusIndexFor(order.placedAt, now) >= ORDER_STATUSES.length - 1
    : false;
  const alreadyStored = order?.completedStatus != null;

  // Stop ticking once the order is delivered.
  useEffect(() => {
    if (!order || isComplete) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [order, isComplete]);

  // Persist the terminal status once, so history shows "Delivered" without recomputing.
  useEffect(() => {
    if (order && isComplete && !alreadyStored) {
      markCompleted(order.id, TERMINAL_STATUS);
    }
  }, [order, isComplete, alreadyStored, markCompleted]);

  if (!order) {
    return { status: ORDER_STATUSES[0], statusIndex: 0, isComplete: false, secondsToNext: null };
  }

  const statusIndex = order.completedStatus
    ? ORDER_STATUSES.length - 1
    : statusIndexFor(order.placedAt, now);

  return {
    status: ORDER_STATUSES[statusIndex],
    statusIndex,
    isComplete: statusIndex >= ORDER_STATUSES.length - 1,
    secondsToNext: secondsToNextStatus(order.placedAt, statusIndex, now),
  };
}
