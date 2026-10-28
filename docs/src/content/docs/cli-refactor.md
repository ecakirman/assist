---
id: cli-refactor
title: assist refactor and assist complexity
group: CLI
order: 19
covers:
  - cli:refactor check
  - cli:refactor extract
  - cli:refactor ignore
  - cli:refactor rename file
  - cli:refactor rename symbol
  - cli:refactor restructure
  - cli:complexity
  - cli:complexity cyclomatic
  - cli:complexity halstead
  - cli:complexity maintainability
  - cli:complexity sloc
---

These commands work on TypeScript projects. [Refactoring and code quality](../code-quality/) covers the slash commands that drive them.

## Refactoring

The commands that change files are dry runs by default: they print what they would do. Add `--apply` to do it.

- `assist refactor check [pattern]` lists files over 100 lines. `--max-lines <n>` changes the limit, and `--modified`, `--staged` or `--unstaged` check only those changes.
- `assist refactor ignore <file>` exempts a file from `refactor check`, allowing it its current length plus ten lines. Exemptions are kept in `refactor.yml`.
- `assist refactor rename file <source> <destination>` moves a file and updates every import of it.
- `assist refactor rename symbol <file> <oldName> <newName>` renames a variable, function, class or type everywhere it's used.
- `assist refactor extract <file> <functionName> <destination>` moves a function, and the private helpers only it uses, into a new file and imports it back.
- `assist refactor restructure [root]` plans where every file under `root` belongs by its imports. `--apply` moves the files, rewrites their imports and removes emptied folders. `--check` lists files that differ from the plan and fails if there are any, so it can run as a [verify](../verify/) check. See [Restructuring folders](../code-quality/#restructuring-folders) for its settings.

## Complexity

The metric commands take a file glob and an optional `--threshold`, and fail when a result crosses it.

- `assist complexity <pattern>` reports every metric below for a single matching file, or maintainability alone when several match. A bare file name matches anywhere in the repo.
- `assist complexity cyclomatic [pattern]` scores the branching in each function.
- `assist complexity halstead [pattern]` reports Halstead volume, difficulty and effort for each function.
- `assist complexity maintainability [pattern]` scores each file's maintainability from 0 to 100. `--threshold` is the minimum score, and `--ignore <glob>` excludes more files on top of `complexity.ignore`.
- `assist complexity sloc [pattern]` counts each file's source lines.
