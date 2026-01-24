/**
 * Normalizes text to a single line for storage: replaces line breaks with spaces
 * and collapses multiple spaces. Use when saving card title/description so they
 * are stored without break lines; display can still use white-space: pre-line
 * if the source ever contains newlines.
 */
export function normalizeToSingleLine(s: string): string {
  return (s || '').replace(/\r?\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
}
