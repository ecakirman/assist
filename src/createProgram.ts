import { Command } from "commander";
import packageJson from "../package.json";
import { web as sessionsWeb } from "./commands/sessions/web";
import { programRegistrars } from "./programRegistrars";

export function createProgram(): Command {
	const program = new Command();

	program
		.name("assist")
		.description("CLI application")
		.version(packageJson.version)
		.option("--no-open", "Do not open a browser on startup")
		.action((options) => sessionsWeb({ port: "3100", open: options.open }));

	for (const register of programRegistrars) register(program);

	return program;
}
