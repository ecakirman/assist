import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { internalCommand } from "../../shared/internalCommand";
import { collectCliCommands } from "./collectCliCommands";

describe("collectCliCommands", () => {
	it("lists leaf commands and parents with their own action by full path", () => {
		const program = new Command();
		program.command("update").description("Update assist");
		const sessions = program.command("sessions").description("Sessions");
		const nodes = sessions
			.command("nodes")
			.description("List nodes")
			.action(() => {});
		nodes.command("doctor").description("Probe links");
		const group = program.command("backup");
		group.command("schedule").command("status").description("Show schedule");

		expect(collectCliCommands(program)).toEqual([
			{ id: "cli:update", description: "Update assist" },
			{ id: "cli:sessions nodes", description: "List nodes" },
			{ id: "cli:sessions nodes doctor", description: "Probe links" },
			{ id: "cli:backup schedule status", description: "Show schedule" },
		]);
	});

	it("records what calls an internal command", () => {
		const program = new Command();
		internalCommand(program.command("signal").description("Signal"), "/next");

		expect(collectCliCommands(program)).toEqual([
			{ id: "cli:signal", description: "Signal", internalCalledBy: "/next" },
		]);
	});
});
