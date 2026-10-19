// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import type { HighLevelTestFile } from "../../../../../../review/highLevel/types";
import { describeHeaderClicks } from "./describeHeaderClicks";
import { HighLevelTestsView } from "./HighLevelTestsView";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function testFile(path: string): HighLevelTestFile {
	return {
		path,
		status: "modified",
		additions: 1,
		deletions: 1,
		diffUrl: `https://github.com/o/r/pull/1/files#${path}`,
		tests: [{ kind: "it", id: `${path}:1`, name: "works", line: 1 }],
	};
}

describeHeaderClicks("HighLevelTestsView", () => {
	render(
		<HighLevelTestsView
			files={[testFile("a.graphql"), testFile("b.graphql")]}
			testPaths={["**/*.graphql"]}
			subject="tests-header-clicks"
		/>,
	);
});
