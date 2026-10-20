import type { SessionManager } from "./SessionManager";
import { spawnContextFrom } from "./spawnContextFrom";
import { isPrCheckoutArgs } from "./worktree/isPrCheckoutArgs";
import { prCheckoutHolder } from "./worktree/prCheckoutHolder";

export function spawnAssistCreate(
	m: SessionManager,
	d: Record<string, unknown>,
): string | Promise<string> {
	const assistArgs = (d.assistArgs as string[]) ?? [];
	const cwd = d.cwd as string | undefined;
	const inPlace = d.inPlace === true;
	const spawn = (holder?: string) =>
		m.spawnAssist(
			assistArgs,
			holder ?? cwd,
			{
				title: d.title as string | undefined,
				subtitle: d.subtitle as string | undefined,
				inPlace: inPlace || holder !== undefined,
			},
			spawnContextFrom(d),
		);
	if (inPlace || !isPrCheckoutArgs(assistArgs)) return spawn();
	return prCheckoutHolder(assistArgs, cwd).then(spawn);
}
