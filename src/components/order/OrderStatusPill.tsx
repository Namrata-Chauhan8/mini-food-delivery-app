import { OrderStatus } from '../../types';
import { Badge } from '../common';

const TONE_BY_STATUS: Record<OrderStatus, 'neutral' | 'primary' | 'success' | 'warning'> = {
  'Order Placed': 'neutral',
  Accepted: 'primary',
  Preparing: 'warning',
  'Out for Delivery': 'primary',
  Delivered: 'success',
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  return <Badge label={status} tone={TONE_BY_STATUS[status]} />;
}
