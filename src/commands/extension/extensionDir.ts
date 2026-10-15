import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));

/**
 * Absolute path to the unpacked browser extension. tsup copies the repo-root
 * `extension` directory next to the bundled entrypoint, so the first
 * candidate resolves for a globally-installed CLI and the second for a source
 * run out of the repo.
 */
export function extensionDir(): string {
	const bundled = join(moduleDir, "commands", "extension", "extension");
	if (existsSync(bundled)) return bundled;
	return join(moduleDir, "..", "..", "..", "extension");
}
