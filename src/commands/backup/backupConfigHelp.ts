import type { ConfigHelpEntry } from "../../shared/configHelp";

export const backupConfigHelp: ConfigHelpEntry[] = [
	{
		key: "backup.dir",
		setter: "assist config set backup.dir ~/.assist/backups",
		note: "directory dumps are written to (default: ~/.assist/backups)",
	},
	{
		key: "backup.staleAfter",
		setter: "assist config set backup.staleAfter 32h",
		note: "age (s, m or h) after which the web header warns the last backup is overdue (default: 32h)",
	},
];
