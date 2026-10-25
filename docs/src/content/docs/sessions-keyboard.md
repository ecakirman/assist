---
id: sessions-keyboard
title: Keyboard shortcuts
group: Sessions
order: 5
covers:
  - config:sessions.hotkeys.navTab
  - config:sessions.hotkeys.focusSidebar
  - config:sessions.hotkeys.focusTerminal
  - config:sessions.hotkeys.toggleDiff
  - config:sessions.hotkeys.focusRepoPicker
  - config:sessions.hotkeys.openUpdates
  - config:sessions.hotkeys.openConfig
  - config:sessions.hotkeys.openMenu
  - config:sessions.hotkeys.focusAddAgent
  - config:sessions.hotkeys.focusVsCode
  - config:sessions.hotkeys.focusDone
  - config:sessions.hotkeys.nextWaiting
  - config:sessions.hotkeys.newSession
  - config:sessions.hotkeys.quickOpen
  - config:sessions.hotkeys.save
  - config:sessions.hotkeys.shortcutsSheet
screenshots:
  - file: sessions-shortcuts.png
    alt: The keyboard shortcuts sheet
    route: /sessions
    scene: dashboard
    waitFor: text=Pricing page copy
    actions:
      - press: ControlOrMeta+/
---

## The layout

The dashboard can be driven without the mouse. Most shortcuts are Alt (Option on macOS) plus a left-hand key, one keyboard row per screen region, and they work while the terminal has focus.

| Keys                  | Action                                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| Alt+1 … Alt+5         | Select the Nth top-level tab                                                       |
| Alt+Q                 | Open the Updates page (the version badge)                                          |
| Alt+W                 | Open the config page                                                               |
| Alt+E                 | Open the menu, focused on its first item                                           |
| Alt+R                 | Focus the repo picker; Tab and Shift+Tab then move along the toolbar               |
| Alt+A                 | Focus the active session's card, expanding the sidebar and switching to **Active** |
| Alt+S                 | Focus the active session's terminal                                                |
| Alt+D                 | Open and focus the diff panel, or close it back to the terminal                    |
| Tab / Shift+Tab       | Move to the next or previous sidebar card                                          |
| Alt+Z / Alt+X / Alt+C | Focus the top bar's **Add agent**, **VS Code** and **Done** buttons                |
| Mod+.                 | Jump to the next session waiting on input                                          |
| Mod+N or Alt+N        | Open the new-session dialog                                                        |
| Mod+P                 | Quick-open a file                                                                  |
| Mod+S                 | Save the open file                                                                 |
| Mod+/                 | Show the keyboard shortcuts sheet                                                  |

`Mod` is Cmd on macOS and Ctrl elsewhere. A shortcut whose target is on the Sessions tab switches there first, and a key whose button isn't shown does nothing. While a session's preview pane is open, Alt+D focuses the pane's primary decision button instead of the diff, and pressing it again returns to the terminal.

The tabs, toolbar buttons and top-bar buttons show their shortcut in their tooltip. The menu's **Keyboard shortcuts** item opens the same sheet as Mod+/.

::screenshot{file="sessions-shortcuts.png"}

## Changing a shortcut

Each action's chord is the config key `sessions.hotkeys.<action>`:

```bash
assist config set sessions.hotkeys.focusTerminal Ctrl+Alt+J -g
```

Restart the web server and reload the page to apply it. A chord is modifiers plus one key joined by `+`, such as `Alt+S`, `Ctrl+Shift+K` or `Mod+/`. The modifiers are `Ctrl`, `Alt` (`Option`), `Shift`, `Meta` (`Cmd`) and `Mod`, and at least one must be something other than Shift. The key is a letter, digit, punctuation, `F1`–`F12` or a named key such as `Enter` or `ArrowUp`. Keys match the physical key, so Option chords work on macOS.

An override replaces all of that action's default chords, and `assist config set` rejects an invalid one. `navTab` takes modifiers only (for example `Ctrl+Alt`); the tab digits stay 1–5. Tab card-cycling can't be changed.

The actions are `navTab`, `focusSidebar`, `focusTerminal`, `toggleDiff`, `focusRepoPicker`, `openUpdates`, `openConfig`, `openMenu`, `focusAddAgent`, `focusVsCode`, `focusDone`, `nextWaiting`, `newSession`, `quickOpen`, `save` and `shortcutsSheet`. `assist sessions web --help` lists each with its default.
