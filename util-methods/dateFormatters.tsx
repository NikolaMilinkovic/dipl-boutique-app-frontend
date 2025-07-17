export function getFormattedDate(date: string | Date): string {
  return new Date(date)
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/\//g, '.');
}
export function getFormattedDateWithoutTime(date: string | Date): string {
  return new Date(date)
    .toLocaleDateString('sr-Latn', {
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    .replace(/\//g, '.');
}
export function getCurrentDate(separator: string = '.'): string {
  return new Date().toLocaleDateString('en-UK').replace(/\//g, separator);
}
