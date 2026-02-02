import simpleGit, { SimpleGit, LogResult } from 'simple-git';

export interface RepoInfo {
  name: string;
  branch: string;
  remoteUrl: string | null;
  isClean: boolean;
  uncommittedChanges: number;
}

export interface CommitStats {
  totalCommits: number;
  authors: Map<string, number>;
  firstCommit: Date | null;
  lastCommit: Date | null;
  commitsPerDay: number;
}

export interface CommitInfo {
  hash: string;
  date: string;
  message: string;
  author: string;
}

const git: SimpleGit = simpleGit();

export async function isGitRepo(): Promise<boolean> {
  try {
    await git.revparse(['--is-inside-work-tree']);
    return true;
  } catch {
    return false;
  }
}

export async function getRepoInfo(): Promise<RepoInfo> {
  const status = await git.status();
  const branch = status.current || 'unknown';
  
  let remoteUrl: string | null = null;
  try {
    const remotes = await git.getRemotes(true);
    const origin = remotes.find(r => r.name === 'origin');
    remoteUrl = origin?.refs.fetch || null;
  } catch {
    // No remotes
  }

  // Get repo name from directory or remote
  let name = process.cwd().split(/[/\\]/).pop() || 'unknown';
  if (remoteUrl) {
    const match = remoteUrl.match(/\/([^/]+?)(\.git)?$/);
    if (match) name = match[1];
  }

  return {
    name,
    branch,
    remoteUrl,
    isClean: status.isClean(),
    uncommittedChanges: status.files.length,
  };
}

export async function getCommitStats(limit?: number): Promise<CommitStats> {
  const log: LogResult = await git.log(limit ? ['--max-count=' + limit] : []);
  
  const authors = new Map<string, number>();
  let firstCommit: Date | null = null;
  let lastCommit: Date | null = null;

  for (const commit of log.all) {
    // Count by author
    const author = commit.author_name;
    authors.set(author, (authors.get(author) || 0) + 1);

    // Track dates
    const date = new Date(commit.date);
    if (!firstCommit || date < firstCommit) firstCommit = date;
    if (!lastCommit || date > lastCommit) lastCommit = date;
  }

  // Calculate commits per day
  let commitsPerDay = 0;
  if (firstCommit && lastCommit) {
    const days = Math.max(1, (lastCommit.getTime() - firstCommit.getTime()) / (1000 * 60 * 60 * 24));
    commitsPerDay = log.total / days;
  }

  return {
    totalCommits: log.total,
    authors,
    firstCommit,
    lastCommit,
    commitsPerDay,
  };
}

export async function getRecentCommits(count: number = 10): Promise<CommitInfo[]> {
  const log = await git.log(['--max-count=' + count]);
  
  return log.all.map(commit => ({
    hash: commit.hash.substring(0, 7),
    date: new Date(commit.date).toLocaleDateString(),
    message: commit.message.split('\n')[0], // First line only
    author: commit.author_name,
  }));
}

export async function getCommitsSince(since: string): Promise<CommitInfo[]> {
  const log = await git.log(['--since=' + since]);
  
  return log.all.map(commit => ({
    hash: commit.hash.substring(0, 7),
    date: new Date(commit.date).toLocaleDateString(),
    message: commit.message.split('\n')[0],
    author: commit.author_name,
  }));
}
