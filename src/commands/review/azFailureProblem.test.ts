import { describe, expect, it } from "vitest";
import { azFailureProblem, azProblems } from "./azFailureProblem";

function failed(stderr: string) {
	return Object.assign(new Error("Command failed"), { stderr });
}

describe("azFailureProblem", () => {
	it("names a missing az from ENOENT", () => {
		const error = Object.assign(new Error("spawn az ENOENT"), {
			code: "ENOENT",
		});
		expect(azFailureProblem(error)).toBe(azProblems.missing);
	});

	it.each([
		"ERROR: The command requires the extension azure-devops. Unable to prompt for extension install confirmation as no tty available.",
		"ERROR: 'repos' is misspelled or not recognized by the system.",
		"az: 'devops' is not in the 'az' command group. See 'az --help'.",
	])("names the missing azure-devops extension: %s", (stderr) => {
		expect(azFailureProblem(failed(stderr))).toBe(azProblems.extension);
	});

	it.each([
		"ERROR: Please run 'az login' to setup account.",
		"ERROR: Before you can run Azure DevOps commands, you need to run the login command (az login if using AAD/MSA identity else az devops login if using PAT token) to setup credentials.",
	])("names a missing login: %s", (stderr) => {
		expect(azFailureProblem(failed(stderr))).toBe(azProblems.login);
	});

	it("reads stderr from a Buffer", () => {
		const error = { stderr: Buffer.from("Please run 'az login'") };
		expect(azFailureProblem(error)).toBe(azProblems.login);
	});

	it("leaves other failures unclassified", () => {
		expect(azFailureProblem(failed("ERROR: TF401019: repo not found"))).toBe(
			null,
		);
	});
});
