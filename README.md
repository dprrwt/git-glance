# gitsum

> Beautiful git repository summaries, statistics, and changelogs

[![npm version](https://img.shields.io/npm/v/gitsum.svg)](https://www.npmjs.com/package/gitsum)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g gitsum
```

## Usage

Run `gitsum` in any git repository:

### Summary (default)

```bash
gitsum
# or
gitsum summary
```

Shows:
- Repository info (branch, status, remote)
- Commit statistics
- Top contributors with progress bars
- Recent commits

### Statistics

```bash
gitsum stats
gitsum stats --limit 100  # Analyze last 100 commits only
```

Shows detailed commit statistics:
- Total commits
- All contributors with commit counts
- Project age
- Commits per day

### Changelog

```bash
gitsum changelog
gitsum log                        # Alias
gitsum log --since "1 week ago"   # Since specific date
gitsum log --count 50             # Last 50 commits
gitsum log --markdown             # Output as markdown
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
gitsum log --since "last week" --markdown > CHANGELOG.md
```

## License

MIT © [Deepankar Rawat](https://github.com/dprrwt)
