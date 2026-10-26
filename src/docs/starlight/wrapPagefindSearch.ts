import { filterPagefindResults } from "./filterPagefindResults";
import { matchesQueryWord } from "./matchesQueryWord";

const searchExport = /export\s*\{([^}]*)\}\s*;?\s*$/;

export function wrapPagefindSearch(source: string): string {
	const match = source.match(searchExport);
	if (!match)
		throw new Error("pagefind.js has no trailing export statement to wrap");
	const names = match[1].split(",").map((name) => name.trim());
	for (const required of ["search", "debouncedSearch"])
		if (!names.includes(required))
			throw new Error(`pagefind.js does not export ${required}`);
	const exports = names
		.filter((name) => name !== "search" && name !== "debouncedSearch")
		.concat(
			"assistSearch as search",
			"assistDebouncedSearch as debouncedSearch",
		);
	return `${source.slice(0, match.index)}
const assistMatchesWord = ${matchesQueryWord.toString()};
const assistFilterResults = ${filterPagefindResults.toString()};
const assistSearch = async (term, options) => assistFilterResults(await search(term, options), term, assistMatchesWord);
const assistDebouncedSearch = async (term, options, timeout) => assistFilterResults(await debouncedSearch(term, options, timeout), term, assistMatchesWord);
export{${exports.join(",")}};
`;
}
