import { createBundleHandler } from "../../../shared/createBundleHandler";
import type { Handler } from "../../../shared/web";
import { createCssHandler } from "./createCssHandler";

const faviconHandler = (size: number) =>
	createBundleHandler(
		import.meta.url,
		`commands/extension/extension/icons/assist-${size}.png`,
		"image/png",
	);

export const staticRoutes: Record<string, Handler> = {
	"GET /bundle.js": createBundleHandler(
		import.meta.url,
		"commands/sessions/web/bundle.js",
	),
	"GET /xterm.css": createCssHandler("@xterm/xterm/css/xterm.css"),
	"GET /bundle.css": createBundleHandler(
		import.meta.url,
		"commands/sessions/web/bundle.css",
		"text/css",
	),
	"GET /monaco.js": createBundleHandler(
		import.meta.url,
		"commands/sessions/web/monaco.js",
	),
	"GET /monaco.worker.js": createBundleHandler(
		import.meta.url,
		"commands/sessions/web/monaco.worker.js",
	),
	"GET /monaco.css": createBundleHandler(
		import.meta.url,
		"commands/sessions/web/monaco.css",
		"text/css",
	),
	"GET /favicon-16.png": faviconHandler(16),
	"GET /favicon-32.png": faviconHandler(32),
	"GET /favicon-128.png": faviconHandler(128),
};
