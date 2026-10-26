---
id: cli-nodes
title: assist sessions nodes
group: CLI
order: 6
covers:
  - cli:sessions nodes
  - cli:sessions nodes link
  - cli:sessions nodes unlink
  - cli:sessions nodes doctor
  - cli:sessions nodes logs
  - config:sessions.links
---

These manage [links to other machines](../sessions-linked-nodes/). A link's name must match the peer's `sessions.nodeName`.

## Commands

- `assist sessions nodes` lists this node and each linked node with its link state. `--json` prints the same as JSON.
- `assist sessions nodes link <name> --tailscale <host> --port <port>` links a peer over [Tailscale](../sessions-linked-nodes/#linking-over-tailscale) by its Tailscale machine name and web server port.
- `assist sessions nodes link <name> <url>` links a peer at any URL that reaches its web server, such as `http://127.0.0.1:3101` for another node on the same machine.
- `assist sessions nodes unlink <name>` removes a link.
- `assist sessions nodes doctor [name]` checks each step of every link, or just one, and stops at the first that fails with what to do about it. `--json` prints the result as JSON.
- `assist sessions nodes logs <name>` prints a linked node's daemon log (`-n <lines>`, default 200). `--json` prints the result as JSON.

## When a link won't connect

Start with `assist sessions nodes doctor <name>`, then read the peer's side with `assist sessions nodes logs <name>`.
