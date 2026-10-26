import { describe, expect, it } from "vitest";
import { wrapPagefindSearch } from "./wrapPagefindSearch";

describe("wrapPagefindSearch", () => {
	it("re-exports search and debouncedSearch through the result filter", () => {
		const wrapped = wrapPagefindSearch(
			"var search;var debouncedSearch;export{debouncedSearch,init,search}",
		);

		expect(wrapped).toContain(
			"export{init,assistSearch as search,assistDebouncedSearch as debouncedSearch};",
		);
		expect(wrapped).not.toContain("export{debouncedSearch,init,search}");
		expect(wrapped).toContain("const assistFilterResults = async function");
	});

	it("fails when pagefind.js no longer exports search", () => {
		expect(() => wrapPagefindSearch("export{init}")).toThrow(
			"pagefind.js does not export search",
		);
	});
});
