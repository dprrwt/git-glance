# git-glance

> Beautiful git repository summaries, statistics, and changelogs

[![npm version](https://img.shields.io/npm/v/git-glance.svg)](https://www.npmjs.com/package/git-glance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g git-glance
```

Or use directly:

```bash
npx git-glance
```

## Usage

Run `git-glance` in any git repository:

### Summary (default)

```bash
git-glance
# or
git-glance summary
```

Shows:
- Repository info (branch, status, remote)
- Commit statistics
- Top contributors with progress bars
- Recent commits

### Statistics

```bash
git-glance stats
git-glance stats --limit 100  # Analyze last 100 commits only
```

Shows detailed commit statistics:
- Total commits
- All contributors with commit counts
- Project age
- Commits per day

### Changelog

```bash
git-glance changelog
git-glance log                        # Alias
git-glance log --since "1 week ago"   # Since specific date
git-glance log --count 50             # Last 50 commits
git-glance log --markdown             # Output as markdown
```

Generates a formatted changelog grouped by date.

## Examples

### Repository Summary

```
═══ 📊 my-project ═══

  Branch:   main
  Status:   ✓ Clean
  Remote:   git@github.com:user/my-project.git

═══ 📈 Statistics ═══

  Total Commits:  142
  Contributors:   3
  First Commit:   Jan 15, 2024
  Last Commit:    Feb 3, 2024
  Commits/Day:    7.5

═══ 👥 Top Contributors ═══

  ███████████████░░░░░ John Doe (95 commits, 67%)
  ████████░░░░░░░░░░░░ Jane Smith (35 commits, 25%)
  ██░░░░░░░░░░░░░░░░░░ Bob Wilson (12 commits, 8%)
```

### Markdown Changelog

```bash
git-glance log --since "last week" --markdown > CHANGELOG.md
```

## License

MIT © [Deepankar Rawat](https://github.com/dprrwt)
