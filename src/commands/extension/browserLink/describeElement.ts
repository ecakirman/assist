export function describeElement(element: Element): string {
	const id = element.id ? `#${element.id}` : "";
	const classes = [...element.classList].map((name) => `.${name}`).join("");
	return `${element.tagName.toLowerCase()}${id}${classes}`;
}
