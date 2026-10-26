export function matchesQueryWord(matched: string, word: string): boolean {
	let shared = 0;
	while (
		shared < matched.length &&
		shared < word.length &&
		matched[shared] === word[shared]
	)
		shared++;
	if (shared === word.length) return true;
	if (shared < 3) return false;
	const inflection =
		/^(?:s|es|ies|ied|ed|d|ing|ings|er|ers|ly|ion|ions|ment|ments)$/;
	const rest = word.slice(shared);
	const restWithoutDoubledConsonant =
		rest[0] === word[shared - 1] ? rest.slice(1) : rest;
	return inflection.test(rest) || inflection.test(restWithoutDoubledConsonant);
}
