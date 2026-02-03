#!/usr/bin/env node

import { Command } from 'commander';
import { summary } from './commands/summary';
import { stats } from './commands/stats';
import { changelog } from './commands/changelog';

const program = new Command();

program
  .name('git-glance')
  .description('Beautiful git repository summaries, statistics, and changelogs')
  .version('1.0.0');

// Default command: summary
program
  .command('summary', { isDefault: true })
  .description('Show repository summary (default)')
  .action(async () => {
    await summary();
  });

// Stats command
program
  .command('stats')
  .description('Show detailed commit statistics')
  .option('-l, --limit <number>', 'Limit to last N commits', parseInt)
  .action(async (options) => {
    await stats(options);
  });

// Changelog command
program
  .command('changelog')
  .alias('log')
  .description('Generate changelog from commits')
  .option('-s, --since <date>', 'Show commits since date (e.g., "1 week ago", "2024-01-01")')
  .option('-n, --count <number>', 'Number of commits to show', parseInt)
  .option('-m, --markdown', 'Output in markdown format')
  .action(async (options) => {
    await changelog(options);
  });

program.parse();
