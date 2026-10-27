import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { type ReactNode, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import type { BackupRow } from "../../../../shared/db/listBackups";
import { formatRelativeTime } from "./formatRelativeTime";

type LatestBackup = { row: BackupRow | null; staleAfterMs: number };

async function fetchLatestBackup(): Promise<LatestBackup> {
	const [listRes, statusRes] = await Promise.all([
		fetch("/api/backups/list"),
		fetch("/api/backups/status"),
	]);
	const backups: BackupRow[] = await listRes.json();
	const { staleAfterMs }: { staleAfterMs: number } = await statusRes.json();
	return { row: backups[0] ?? null, staleAfterMs };
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
	const [latest, setLatest] = useState<LatestBackup>();

	useEffect(() => {
		fetchLatestBackup().then(setLatest);
	}, []);

	if (latest === undefined) return null;

	const { row, staleAfterMs } = latest;
	if (row === null)
		return (
			<BackupsLink warn tooltip="No backup has been recorded">
				Never backed up
			</BackupsLink>
		);

	const timestamp = new Date(row.createdAt).toLocaleString();
	const stale = Date.now() - new Date(row.createdAt).getTime() > staleAfterMs;

	return (
		<BackupsLink
			warn={stale}
			tooltip={
				stale ? `Backup overdue — last backed up ${timestamp}` : timestamp
			}
		>
			Last backed up {formatRelativeTime(String(row.createdAt))}
		</BackupsLink>
	);
}
