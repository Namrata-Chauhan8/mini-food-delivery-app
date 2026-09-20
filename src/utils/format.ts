export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatRatingCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
  return `${count}+`;
}

export function formatDeliveryTime(mins: number): string {
  return `${mins}-${mins + 10} min`;
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

export function formatOrderDate(epochMs: number): string {
  return new Date(epochMs).toLocaleString('en-IN', DATE_FORMAT);
}

export function formatItemCount(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'items'}`;
}

export function formatOrderId(id: string): string {
  return `#${id.toUpperCase()}`;
}
