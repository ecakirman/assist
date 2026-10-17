import { screen } from "@testing-library/react";

function chevron(path: string) {
	return screen.getByRole("button", { name: new RegExp(` ${path}$`) });
}

function expanded(path: string) {
	return chevron(path).getAttribute("aria-expanded") === "true";
}

function row(path: string) {
	const el = chevron(path).parentElement;
	if (!el) throw new Error(`no header row for ${path}`);
	return el;
}

export const headerQueries = { chevron, expanded, row };
