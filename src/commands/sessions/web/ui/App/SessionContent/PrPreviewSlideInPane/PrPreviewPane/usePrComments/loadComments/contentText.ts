import { textWalker } from "../../../../../textWalker";

export function contentText(root: Node): string {
	const walker = textWalker(root);
	let text = "";
	for (let node = walker.nextNode(); node; node = walker.nextNode())
		text += node.textContent ?? "";
	return text;
}
