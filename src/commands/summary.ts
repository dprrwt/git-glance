import { getRepoInfo, getCommitStats, getRecentCommits, isGitRepo } from '../utils/git';
import * as fmt from '../utils/format';

export async function summary(): Promise<void> {
  if (!(await isGitRepo())) {
    console.log(fmt.error('Error: Not a git repository'));
    process.exit(1);
  }

  const [repo, stats, recent] = await Promise.all([
    getRepoInfo(),
    getCommitStats(),
    getRecentCommits(5),
  ]);

  // Header
  console.log(fmt.header(`📊 ${repo.name}`));

  // Repository Info
  console.log(fmt.table([
    ['Branch', repo.branch],
    ['Status', repo.isClean ? fmt.success('✓ Clean') : fmt.warning(`${repo.uncommittedChanges} changes`)],
    ['Remote', repo.remoteUrl || fmt.dim('none')],
  ]));

  // Statistics
  console.log(fmt.header('📈 Statistics'));
  console.log(fmt.table([
    ['Total Commits', String(stats.totalCommits)],
    ['Contributors', String(stats.authors.size)],
    ['First Commit', fmt.formatDate(stats.firstCommit)],
    ['Last Commit', fmt.formatDate(stats.lastCommit)],
    ['Commits/Day', fmt.formatNumber(stats.commitsPerDay)],
  ]));

  // Top Contributors
  if (stats.authors.size > 0) {
    console.log(fmt.header('👥 Top Contributors'));
    const sorted = [...stats.authors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    for (const [author, count] of sorted) {
      const percentage = (count / stats.totalCommits) * 100;
      const bar = fmt.progressBar(count, stats.totalCommits, 15);
      console.log(`  ${bar} ${fmt.value(author)} ${fmt.dim(`(${count} commits, ${percentage.toFixed(0)}%)`)}`);
    }
  }

  // Recent Commits
  if (recent.length > 0) {
    console.log(fmt.header('📝 Recent Commits'));
    for (const commit of recent) {
      console.log(`  ${fmt.dim(commit.hash)} ${fmt.value(commit.message)}`);
      console.log(`         ${fmt.dim(`${commit.author} • ${commit.date}`)}`);
    }
  }

  console.log('');
}
