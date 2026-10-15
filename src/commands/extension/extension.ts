import { cp } from "node:fs/promises";
import chalk from "chalk";
import { detectPlatform } from "../../lib/detectPlatform";
import { extensionDir } from "./extensionDir";

const WSL_WINDOWS_DIR = "/mnt/c/tools/extension";
const WSL_WINDOWS_PATH = String.raw`C:\tools\extension`;

/**
 * Under WSL the browser runs on the Windows host, which cannot load an unpacked
 * extension from a `\\wsl$` path reliably, so copy it somewhere Windows owns.
 */
async function loadPath(source: string): Promise<string> {
	if (detectPlatform() !== "wsl") return source;
	try {
		await cp(source, WSL_WINDOWS_DIR, { recursive: true });
		return WSL_WINDOWS_PATH;
	} catch {
		console.log(
			chalk.yellow(`could not copy extension to ${WSL_WINDOWS_PATH}`),
		);
		return source;
	}
}

export async function extension(): Promise<void> {
	const path = await loadPath(extensionDir());
	console.log(chalk.bold("assist — GitHub browser extension"));
	console.log(chalk.dim(`load the unpacked extension from ${path}`));
}
