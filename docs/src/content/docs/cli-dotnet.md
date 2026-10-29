---
id: cli-dotnet
title: assist dotnet
group: CLI
order: 28
covers:
  - cli:dotnet inspect
  - cli:dotnet check-locks
  - cli:dotnet deps
  - cli:dotnet in-sln
---

See [.NET](../dotnet/) for running inspections from a session with `/inspect`.

## Commands

- `assist dotnet inspect [sln]` runs JetBrains inspections on the `.cs` files you've changed and prints the dead code they find. Without `sln`, it finds the solution in the repo.
  - `--scope all` inspects the whole solution, `--scope base:<ref>` everything changed since `ref`, and `--scope commit:<ref>` one commit.
  - `--all` prints every issue, not only dead code. `--only <ids...>` prints only those issue types, and `--suppress <ids...>` leaves them out, along with those in `dotnet.inspect.suppress`.
  - `--swea` turns on solution-wide analysis, which is slower and more thorough.
  - `--roslyn` runs the Roslyn analyzers through MSBuild instead of JetBrains.
- `assist dotnet check-locks` checks whether a debugger is holding the build output open.
- `assist dotnet deps <csproj>` prints a project's tree of project references and which solutions include it. `--json` prints it as JSON.
- `assist dotnet in-sln <csproj>` prints which solutions reference a project.
