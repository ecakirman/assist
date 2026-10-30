import type { Theme } from "@mui/material/styles";

export function paletteColor(t: Theme, path: string): string {
	const [group, shade] = path.split(".");
	const value = (
		t.palette as unknown as Record<string, Record<string, string>>
	)[group]?.[shade];
	return value ?? path;
}
