import { describe, expect, it, vi } from "vitest";
import { azureDevopsRemote } from "./azureDevopsRemote";
import { prCliCommands } from "./prCliCommands";

vi.mock("./azureDevopsRemote", () => ({ azureDevopsRemote: vi.fn() }));

const mockRemote = vi.mocked(azureDevopsRemote);

describe("prCliCommands", () => {
	it("uses gh for a GitHub clone", () => {
		mockRemote.mockReturnValue(null);
		const commands = prCliCommands("12", "/repo");
		expect(commands.checkout).toEqual({
			file: "gh",
			args: ["pr", "checkout", "12"],
		});
		expect(commands.headBranch.parse("feature\n")).toBe("feature");
	});

	it("uses az repos pr for an Azure DevOps clone", () => {
		mockRemote.mockReturnValue({ org: "acme", project: "p", repo: "r" });
		const commands = prCliCommands("42", "/repo");
		expect(commands.checkout).toEqual({
			file: "az",
			args: ["repos", "pr", "checkout", "--id", "42"],
		});
		expect(commands.headBranch.args).toEqual(
			expect.arrayContaining(["show", "--id", "42", "sourceRefName"]),
		);
		expect(commands.headBranch.parse("refs/heads/feature/x\n")).toBe(
			"feature/x",
		);
		expect(commands.headBranch.parse("\n")).toBeNull();
	});
});
