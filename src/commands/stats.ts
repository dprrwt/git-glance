import { getCommitStats, isGitRepo } from '../utils/git';
import * as fmt from '../utils/format';

interface StatsOptions {
  limit?: number;
}

export async function stats(options: StatsOptions = {}): Promise<void> {
  if (!(await isGitRepo())) {
    console.log(fmt.error('Error: Not a git repository'));
    process.exit(1);
  }

  const limit = options.limit;
  const commitStats = await getCommitStats(limit);

  console.log(fmt.header('📈 Commit Statistics'));
  
  if (limit) {
    console.log(fmt.dim(`  (Analyzing last ${limit} commits)\n`));
  }

  // Overview
  console.log(fmt.table([
    ['Total Commits', String(commitStats.totalCommits)],
    ['Contributors', String(commitStats.authors.size)],
    ['First Commit', fmt.formatDate(commitStats.firstCommit)],
    ['Last Commit', fmt.formatDate(commitStats.lastCommit)],
    ['Commits/Day', fmt.formatNumber(commitStats.commitsPerDay)],
  ]));

  // Calculate project age
  if (commitStats.firstCommit && commitStats.lastCommit) {
    const ageMs = commitStats.lastCommit.getTime() - commitStats.firstCommit.getTime();
    const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    let ageStr: string;
    if (years > 0) {
      ageStr = `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 !== 1 ? 's' : ''}`;
    } else if (months > 0) {
      ageStr = `${months} month${months > 1 ? 's' : ''}, ${days % 30} day${days % 30 !== 1 ? 's' : ''}`;
    } else {
      ageStr = `${days} day${days !== 1 ? 's' : ''}`;
    }
    
    console.log(`\n  ${fmt.label('Project Age')} ${fmt.value(ageStr)}`);
  }

  // All Contributors (sorted)
  console.log(fmt.header('👥 All Contributors'));
  
  const sorted = [...commitStats.authors.entries()].sort((a, b) => b[1] - a[1]);
  const maxCount = sorted[0]?.[1] || 1;
  
  for (const [author, count] of sorted) {
    const percentage = (count / commitStats.totalCommits) * 100;
    const bar = fmt.progressBar(count, maxCount, 20);
    console.log(`  ${bar} ${fmt.value(author.padEnd(25))} ${fmt.highlight(String(count).padStart(5))} ${fmt.dim(`(${percentage.toFixed(1)}%)`)}`);
  }

  console.log('');
}
