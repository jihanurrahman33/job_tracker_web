import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null, formatStr = 'MMM d, yyyy'): string {
  if (!dateString) return '—';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      // Fallback for custom formats like "2026-09-15 14:00"
      const fallback = new Date(dateString);
      if (isValid(fallback)) {
        return format(fallback, formatStr);
      }
      return dateString;
    }
    return format(date, formatStr);
  } catch {
    return dateString || '—';
  }
}

export function formatDateTime(dateString?: string | null): string {
  return formatDate(dateString, 'MMM d, yyyy • h:mm a');
}

export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    const fallback = new Date(dateString);
    if (isValid(fallback)) {
      return formatDistanceToNow(fallback, { addSuffix: true });
    }
    return dateString;
  } catch {
    return dateString || '—';
  }
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = 'USD'
): string {
  if (!min && !max) return 'Not disclosed';
  
  const curr = (currency || 'USD').toUpperCase();
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BDT: '৳',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
  };

  const symbol = symbolMap[curr];
  const numFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });

  if (symbol) {
    if (min && max) {
      if (min === max) {
        return `${symbol}${numFormatter.format(min)}`;
      }
      return `${symbol}${numFormatter.format(min)} - ${symbol}${numFormatter.format(max)}`;
    }
    if (min) {
      return `From ${symbol}${numFormatter.format(min)}`;
    }
    if (max) {
      return `Up to ${symbol}${numFormatter.format(max)}`;
    }
  }

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    });

    if (min && max) {
      if (min === max) {
        return formatter.format(min);
      }
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    if (min) {
      return `From ${formatter.format(min)}`;
    }
    if (max) {
      return `Up to ${formatter.format(max)}`;
    }
  } catch {
    if (min && max) {
      return `${curr} ${numFormatter.format(min)} - ${curr} ${numFormatter.format(max)}`;
    }
    if (min) return `From ${curr} ${numFormatter.format(min)}`;
    if (max) return `Up to ${curr} ${numFormatter.format(max)}`;
  }

  return 'Not disclosed';
}

export function formatPercent(rate: number = 0): string {
  return `${Math.round(rate * 100)}%`;
}

export function toInputDateTimeValue(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isValid(date)) {
      // Return YYYY-MM-DDTHH:mm
      return date.toISOString().slice(0, 16);
    }
    return '';
  } catch {
    return '';
  }
}

export function toInputDateValue(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isValid(date)) {
      return date.toISOString().slice(0, 10);
    }
    return '';
  } catch {
    return '';
  }
}

