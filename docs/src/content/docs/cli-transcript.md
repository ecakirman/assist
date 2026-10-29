---
id: cli-transcript
title: assist transcript
group: CLI
order: 26
covers:
  - cli:transcript configure
  - cli:transcript list
  - cli:transcript move
  - cli:transcript clean
  - cli:transcript merge
---

See [Meeting transcripts](../transcripts/) for processing a folder of transcripts with `/transcripts`.

## Commands

- `assist transcript configure` asks for the pick-up, transcripts and summary folders.
- `assist transcript clean <path>` prints a `.vtt` file as a readable markdown transcript, one paragraph per speaker turn. `--timestamps` starts each turn with its time, and `--format vtt` prints a tidied `.vtt` instead.
- `assist transcript merge <path...> --out <file>` combines several `.vtt` files into one, on a single timeline.
  - `--select <file>` keeps only the passages a JSON file names, as `{ "keep": [{ "file", "from", "to" }], "removed": ["reason", ...] }`, with times as `--timestamps` prints them. `-` reads it from stdin.
  - `--no-provenance` leaves out the notes naming the source files, where each passage came from and how many were removed. Use it when the merged transcript goes to people who shouldn't see those.
  - `--widen-audience` removes the asides that only make sense to people who were in the call.
- `assist transcript list` :badge[internal] prints the `.vtt` files waiting in the pick-up folder. Called by `/transcripts`.
- `assist transcript move <file> --date <YYYY-MM-DD> --client <name>` :badge[internal] writes a pick-up file as a dated markdown transcript, archives the original and prints where its summary goes. Called by `/transcripts`.
