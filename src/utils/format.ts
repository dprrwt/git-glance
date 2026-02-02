import chalk from 'chalk';

export function header(text: string): string {
  return chalk.bold.cyan(`\n═══ ${text} ═══\n`);
}

export function label(text: string): string {
  return chalk.gray(text + ':');
}

export function value(text: string | number): string {
  return chalk.white(String(text));
}

export function highlight(text: string | number): string {
  return chalk.yellow(String(text));
}

export function success(text: string): string {
  return chalk.green(text);
}

export function warning(text: string): string {
  return chalk.yellow(text);
}

export function error(text: string): string {
  return chalk.red(text);
}

export function dim(text: string): string {
  return chalk.gray(text);
}

export function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number, decimals: number = 1): string {
  if (Number.isInteger(num)) return String(num);
  return num.toFixed(decimals);
}

export function progressBar(current: number, total: number, width: number = 20): string {
  const percentage = Math.min(1, current / total);
  const filled = Math.round(width * percentage);
  const empty = width - filled;
  
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

export function table(rows: [string, string][]): string {
  const maxLabel = Math.max(...rows.map(r => r[0].length));
  
  return rows
    .map(([l, v]) => `  ${label(l.padEnd(maxLabel))} ${value(v)}`)
    .join('\n');
}
