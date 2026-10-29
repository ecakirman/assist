---
id: dotnet
title: .NET
group: Integrations
order: 8
covers:
  - claude:inspect
  - config:dotnet.inspect.suppress
---

Run `/inspect` in a .NET repo to find dead code in the `.cs` files you've changed. The agent groups what it finds and suggests fixes. It takes the same options as [`assist dotnet inspect`](../cli-dotnet/), such as `/inspect --all` for every issue rather than only dead code.

Inspections need JetBrains' command-line tools:

```bash
dotnet tool install -g JetBrains.ReSharper.GlobalTools
```

## Suppressing issues

To leave an issue type out of every inspection, add its id to `dotnet.inspect.suppress`:

```bash
assist config set dotnet.inspect.suppress CSharpWarnings::CS0168
```
