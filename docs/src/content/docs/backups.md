---
id: backups
title: Backups
group: Activity
order: 4
covers:
  - route:/backups
screenshots:
  - file: backups.png
    alt: The Backups page, listing recent database dumps with their time, file, size and duration
    route: /backups
    scene: backups
    waitFor: text=Duration
    viewport:
      width: 1440
      height: 640
---

The **Backups** page lists the backups of the assist database, which holds every repo's backlog, newest first. Open it from **Last backed up** at the top of the [backlog](../backlog/), which appears once there's a backup. Hover a file name for its full path.

::screenshot{file="backups.png"}

Backups are taken, scheduled and restored from the command line, see [assist backup](../cli-backup/).
