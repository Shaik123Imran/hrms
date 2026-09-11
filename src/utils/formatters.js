const incomeTaxFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function currencyINR(amount) {
  if (amount == null) return '—';
  return incomeTaxFormat.format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', options);
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const options = { day: '2-digit', month: 'short' };
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', options);
}

export function getInitials(firstName, lastName) {
  return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
}

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function hoursBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const minutes = timeToMinutes(checkOut) - timeToMinutes(checkIn);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}