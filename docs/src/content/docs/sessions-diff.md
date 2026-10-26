---
id: sessions-diff
title: Diff and file views
group: Sessions
order: 8
covers:
  - config:sessions.includeCommittedChanges
  - route:/diff
  - route:/file
screenshots:
  - file: sessions-diff-panel.png
    alt: A session's diff filling the session area
    route: /sessions
    scene: diff
    waitFor: text=Dark mode toggle
    viewport:
      width: 1440
      height: 640
    actions:
      - click: text=Dark mode toggle
      - press: Alt+D
      - click: "[aria-label='Unified view']"
      - click: "[aria-label='Fill the window with diff']"
      - click: text=README.md
  - file: sessions-file.png
    alt: A file open in the file view's editor
    route: /file?path=src/settings/useColourScheme.ts
    scene: diff
    waitFor: .monaco-editor .view-lines
    viewport:
      width: 1280
      height: 560
---

The diff shows what a session has changed in its working copy, so you can review it, comment on it and revert parts of it while the agent works. The file view opens any file in the repo in an editor.

## Opening the diff

Click the change counts on a session's card or in its [top bar](../sessions-session-area/#the-top-bar), or press :kbd[Alt+D], to open the diff beside the terminal. Click the counts or press :kbd[Alt+D] again to close it.

::screenshot{file="sessions-diff-panel.png"}

The counts are new (`+`), modified (`~`) and deleted (`-`) files. When the session has committed some of its work, a second, bracketed group follows with just the uncommitted files; click it to open the diff at **Uncommitted**. A session with no changes on a branch other than the default branch shows **vs main** instead, which opens the diff against the default branch.

The toolbar's **Fill the window with diff** button hides the terminal, and **Show terminal beside diff** brings it back.

To open a diff as a page of its own, go to `/diff`:

| Parameter | Value                                                                         |
| --------- | ----------------------------------------------------------------------------- |
| `cwd`     | The working copy to diff. Without it, the repo selected in the repo picker    |
| `scope`   | `all`, `uncommitted`, `branch` or a commit sha. Defaults to `all`             |
| `session` | The session to send [comments](#commenting) to. Without it, you can't comment |
| `node`    | The linked machine the working copy is on                                     |

## Choosing what to compare

The scope picker at the left of the toolbar chooses what the diff covers:

| Scope       | Shows                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| All changes | Everything the session has changed, committed or not                       |
| Uncommitted | Changes since the last commit                                              |
| Branch      | The branch against the default branch, listed when there is one to compare |
| _A commit_  | One commit the session made for its backlog item                           |

New files are included in every scope except a single commit.

By default, **All changes**, the card counts and the commit entries take in the commits recorded against the session's backlog item, so a session's changes stay visible after the agent commits them. To show only uncommitted changes instead:

```bash
assist config set sessions.includeCommittedChanges false -g
```

## Reading the diff

- The file tree on the left lists the changed files with their line counts. Click a file to jump to it. The tree button at the left of the toolbar hides or shows it.
- **Filter files by name** narrows the diff to matching paths; :kbd[Esc] clears it. **Filter by change type** shows only modified, added, removed or renamed files.
- Click a file's header to collapse it, or use **Collapse all files** and **Expand all files**.
- **Unified view** and **Split view** switch the layout. The choice is remembered.
- A markdown file's **Preview** button shows it rendered.

## Commenting

Drag across the text in the diff to select it, then type a note and press :kbd[Enter] (:kbd[Shift+Enter] for a new line) or click **Send to agent**. The comment, quoting the selected lines with their file and line numbers, is typed straight into the session for the agent to act on.

The comment box also offers:

- **Cite a broken rule** lists the repo's rules that apply to the file. Clicking one asks the agent to fix the quoted text so it follows that rule.
- **Add rule** asks the agent to capture your note as a new rule for the repo.
- **Copy quote** copies the selected text.

You can comment only while the session is live. A diff opened as a page needs its `session` parameter.

## Reverting

On the **Uncommitted** scope, hover a row in the file tree to revert it:

- **Revert file** discards the file's uncommitted changes, or deletes it if it is new.
- **Revert folder** does the same for every changed file in the folder.
- **Revert all files**, on the tree's header, does it for every file listed, so a filter limits what it reverts.

Each asks first. Reverting can't be undone.

## The file view

Press :kbd[Mod+P] and pick a file to open it in the file view.

::screenshot{file="sessions-file.png"}

- Edit the file and press :kbd[Mod+S] or click **Save**. If the file changed on disk since you opened it, the save is refused so you don't overwrite those changes.
- Leaving with unsaved changes asks whether to discard them.
- A markdown file has **Raw** and **Rendered** modes. In **Rendered**, select text to [comment](#commenting) on it to the session selected in the sidebar.

To open a file directly, go to `/file?path=<path>&cwd=<working copy>`, adding `&node=<name>` for a linked machine.
