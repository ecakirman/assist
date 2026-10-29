import type { Command } from "commander";
import { browserStatus } from "./browser/browserStatus";

function withTargetOptions(command: Command): Command {
	return command
		.option(
			"--url <substring>",
			"Target the most recently active tab whose URL contains this, instead of the focused window's active tab",
		)
		.option(
			"--server <url>",
			"assist web server the extension connects to",
			"http://localhost:3100",
		);
}

export function registerBrowser(program: Command): void {
	const browser = program
		.command("browser")
		.description(
			"Probe the live browser tab through the assist extension, relayed by the assist web server",
		);

	withTargetOptions(
		browser
			.command("status")
			.description(
				"Print the connected extension's version, the target tab's URL and whether the assist content script runs there",
			),
	).action(browserStatus);
}
