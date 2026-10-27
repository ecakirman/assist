---
id: backups
title: Backups
group: Activity
order: 4
covers:
  - route:/backups
screenshots:
  - file: backups-link.png
    alt: The Last backed up link at the top of the backlog
    route: /backlog
    scene: backups
    waitFor: text=Last backed up
    crop: "xpath=//h5[normalize-space()='Backlog']/.."
    cropPadding: 16
    highlight:
      - text=Last backed up
  - file: backups.png
    alt: The Backups page, listing recent database dumps with their time, file, size and duration
    route: /backups
    scene: backups
    waitFor: text=Duration
    viewport:
      width: 1440
      height: 640
---

The **Backups** page lists the backups of the assist database, which holds every repo's backlog, newest first.

To open it, go to the [Backlog](../backlog/) tab (:kbd[Alt+2]) and click **Last backed up** at the top right. The link appears once you've taken a backup.

::screenshot{file="backups-link.png"}

::screenshot{file="backups.png"}

Hover a file name for its full path.

Backups are taken, scheduled and restored from the command line, see [assist backup](../cli-backup/).
