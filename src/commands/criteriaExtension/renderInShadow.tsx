import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { containKeyEvents } from "./containKeyEvents";
import { CriteriaTheme } from "./CriteriaTheme";

export function renderInShadow(
	host: HTMLElement,
	cacheKey: string,
	children: ReactNode,
): Root {
	const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
	containKeyEvents(host);
	const styles = document.createElement("div");
	const container = document.createElement("div");
	container.style.cssText = "width:100%;font:inherit;color:inherit";
	shadow.append(styles, container);
	const cache = createCache({ key: cacheKey, container: styles });
	const root = createRoot(container);
	root.render(
		<CacheProvider value={cache}>
			<CriteriaTheme>{children}</CriteriaTheme>
		</CacheProvider>,
	);
	return root;
}
