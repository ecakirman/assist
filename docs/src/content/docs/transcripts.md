---
id: transcripts
title: Meeting transcripts
group: Integrations
order: 6
covers:
  - claude:transcripts
  - config:transcript.vttDir
  - config:transcript.transcriptsDir
  - config:transcript.summaryDir
---

assist turns the `.vtt` transcripts your meeting tool exports into dated markdown transcripts, each with a summary.

## Setting up

Run `assist transcript configure` in the repo where you keep transcripts. It asks for three folders:

| Key                         | Folder                                                         |
| --------------------------- | -------------------------------------------------------------- |
| `transcript.vttDir`         | Where you drop the raw `.vtt` files                            |
| `transcript.transcriptsDir` | Where the markdown transcripts are written, by client and date |
| `transcript.summaryDir`     | Where the summaries are written                                |

## Processing transcripts

Drop `.vtt` files into the pick-up folder and run `/transcripts`. For each file, the agent works out the client and meeting date, from the file name or the meeting itself, asking you only when it can't tell. It writes the markdown transcript, moves the original out of the pick-up folder and writes a summary that links to the transcript. It stops when the folder is empty.

To clean up or merge `.vtt` files yourself, see [`assist transcript`](../cli-transcript/).
