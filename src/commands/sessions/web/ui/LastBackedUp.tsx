import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { type ReactNode, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import type { BackupRow } from "../../../../shared/db/listBackups";
import { formatRelativeTime } from "./formatRelativeTime";

const STALE_AFTER_MS = 32 * 60 * 60 * 1000;

async function fetchLatestBackup(): Promise<BackupRow | null> {
	const res = await fetch("/api/backups/list");
	const backups: BackupRow[] = await res.json();
	return backups[0] ?? null;
}

function BackupsLink({
	warn,
	tooltip,
	children,
}: {
	warn: boolean;
	tooltip: string;
	children: ReactNode;
}) {
	return (
		<Tooltip title={tooltip}>
			<Link
				component={RouterLink}
				to="/backups"
				underline="hover"
				color={warn ? "warning.main" : "text.secondary"}
				variant="body2"
				sx={
					warn
						? { display: "inline-flex", alignItems: "center", gap: 0.5 }
						: undefined
				}
			>
				{warn && <WarningAmberIcon fontSize="inherit" />}
				{children}
			</Link>
		</Tooltip>
	);
}

export function LastBackedUp() {
	const [latest, setLatest] = useState<BackupRow | null>();

	useEffect(() => {
		fetchLatestBackup().then(setLatest);
	}, []);

	if (latest === undefined) return null;

	if (latest === null)
		return (
			<BackupsLink warn tooltip="No backup has been recorded">
				Never backed up
			</BackupsLink>
		);

	const timestamp = new Date(latest.createdAt).toLocaleString();
	const stale =
		Date.now() - new Date(latest.createdAt).getTime() > STALE_AFTER_MS;

	return (
		<BackupsLink
			warn={stale}
			tooltip={
				stale ? `Backup overdue — last backed up ${timestamp}` : timestamp
			}
		>
			Last backed up {formatRelativeTime(String(latest.createdAt))}
		</BackupsLink>
	);
}
