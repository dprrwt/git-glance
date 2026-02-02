import { getCommitsSince, getRecentCommits, isGitRepo, getRepoInfo } from '../utils/git';
import * as fmt from '../utils/format';

interface ChangelogOptions {
  since?: string;
  count?: number;
  markdown?: boolean;
}

export async function changelog(options: ChangelogOptions = {}): Promise<void> {
  if (!(await isGitRepo())) {
    console.log(fmt.error('Error: Not a git repository'));
    process.exit(1);
  }

  const repo = await getRepoInfo();
  const commits = options.since
    ? await getCommitsSince(options.since)
    : await getRecentCommits(options.count || 20);

  if (commits.length === 0) {
    console.log(fmt.warning('No commits found for the specified period.'));
    return;
  }

  if (options.markdown) {
    outputMarkdown(repo.name, commits, options.since);
  } else {
    outputPretty(commits, options.since);
  }
}

interface CommitInfo {
  hash: string;
  date: string;
  message: string;
  author: string;
}

function outputPretty(commits: CommitInfo[], since?: string): void {
  const title = since ? `Changes since ${since}` : 'Recent Changes';
  console.log(fmt.header(`📋 ${title}`));

  // Group by date
  const byDate = new Map<string, CommitInfo[]>();
  for (const commit of commits) {
    const existing = byDate.get(commit.date) || [];
    existing.push(commit);
    byDate.set(commit.date, existing);
  }

  for (const [date, dateCommits] of byDate) {
    console.log(`\n  ${fmt.highlight(date)}`);
    for (const commit of dateCommits) {
      console.log(`    ${fmt.dim('•')} ${fmt.value(commit.message)}`);
      console.log(`      ${fmt.dim(`${commit.hash} by ${commit.author}`)}`);
    }
  }

  console.log('');
}

function outputMarkdown(repoName: string, commits: CommitInfo[], since?: string): void {
  const title = since ? `Changes since ${since}` : 'Changelog';
  
  console.log(`# ${repoName} - ${title}\n`);

  // Group by date
  const byDate = new Map<string, CommitInfo[]>();
  for (const commit of commits) {
    const existing = byDate.get(commit.date) || [];
    existing.push(commit);
    byDate.set(commit.date, existing);
  }

  for (const [date, dateCommits] of byDate) {
    console.log(`## ${date}\n`);
    for (const commit of dateCommits) {
      console.log(`- ${commit.message} (\`${commit.hash}\` by ${commit.author})`);
    }
    console.log('');
  }
}
