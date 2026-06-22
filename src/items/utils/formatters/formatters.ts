export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCurrency = (
  amount: number | string,
  {
    currency = 'INR',
    locale,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: FormatCurrencyOptions = {},
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(amount));

export const formatOrderId = (orderId: string) => `#${orderId.trim().slice(-6).toUpperCase()}`;

export const formatOrderNumber = (orderId: string) => `#${orderId.trim().slice(-6).toUpperCase()}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return formatter.format(d);
};

export const formattedAmount = (amount: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getMonthName = (month: number) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[month - 1] || '';
};

/**
 * Text manipulation utilities.
 */

type TruncateOptionsT = {
  position?: 'end' | 'middle' | 'start';
  ellipsis?: string;
};

type TruncateProps = {
  text: string;
  maxLength?: number;
  options?: TruncateOptionsT;
};

/**
 * Truncates text based on length and position.
 */
export const truncateText = ({ text, maxLength = 20, options }: TruncateProps): string => {
  const { position = 'end', ellipsis = '...' } = { ...options };

  const ellipsisLength = ellipsis.length;
  const displayLength = maxLength - ellipsisLength;

  if (text.length <= maxLength) return text;
  if (displayLength <= 0) return ellipsis;

  const half = Math.floor(displayLength / 2);

  switch (position) {
    case 'start':
      return ellipsis + text.slice(-displayLength);
    case 'middle':
      return text.slice(0, half) + ellipsis + text.slice(-half);
    case 'end':
    default:
      return text.slice(0, displayLength) + ellipsis;
  }
};
