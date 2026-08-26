const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
});

function formatMonth(isoDate: string): string {
  const formatted = monthFormatter.format(new Date(isoDate));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function formatPeriod(startDate: string, endDate: string | null): string {
  const start = formatMonth(startDate);
  const end = endDate ? formatMonth(endDate) : 'н.в.';

  return `${start} — ${end}`;
}
