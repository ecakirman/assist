---
id: cli-extension
title: assist extension and netcap
group: CLI
order: 30
covers:
  - cli:extension
  - cli:netcap
  - cli:netcap extract-linkedin-posts
---

See [Browser extension](../browser-extension/) for installing and using the assist extension.

## assist extension

- `assist extension` prints the folder to load the extension from unpacked: in Chrome with **Load unpacked** on `chrome://extensions`, or in Firefox with **Load Temporary Add-on** on `about:debugging`, picking its `manifest.json`. On WSL it copies the extension to `C:\tools\extension` and prints that path.
- `assist extension --url` prints the download link of the latest signed Firefox build.
- `assist extension --sign` signs the extension with your Mozilla add-ons API key, in `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET`, and prints the `.xpi` to install.

## assist netcap

netcap records the `fetch` and XHR requests a browser page makes, with their responses, to a JSONL file. It pairs with its own browser extension.

- `assist netcap` starts the recorder and prints the extension's folder. Load it unpacked as above; Firefox needs version 128 or later. Browse, and matching requests are added to `~/.assist/netcap/capture.jsonl`. Press **Ctrl+C** to stop.
  - `-f <text>` records only requests whose URL contains `text`.
  - `-o <dir>` writes the file to another folder, and `-p <port>` listens on a port other than 8723.
  - Run it again after changing `-f` or `-p`, and reload the extension.
- `assist netcap extract-linkedin-posts [file]` reads the LinkedIn posts out of a capture, with each one's text, author, mentions, links and permalink, and writes them to `posts.json` beside it.
