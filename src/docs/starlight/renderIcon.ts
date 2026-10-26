import CloseFullscreen from "@mui/icons-material/CloseFullscreen";
import OpenInFull from "@mui/icons-material/OpenInFull";
import { createElement, type ElementType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const icons: Record<string, ElementType> = { CloseFullscreen, OpenInFull };

export function renderIcon(name: string): string {
	const icon = Object.hasOwn(icons, name) ? icons[name] : undefined;
	if (!icon)
		throw new Error(
			`Unknown :icon[${name}], expected one of ${Object.keys(icons).join(", ")}`,
		);
	const markup = renderToStaticMarkup(createElement(icon));
	const paths = /<svg[^>]*>(.*)<\/svg>/s.exec(markup)?.[1] ?? "";
	return `<span class="assist-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">${paths}</svg></span>`;
}
