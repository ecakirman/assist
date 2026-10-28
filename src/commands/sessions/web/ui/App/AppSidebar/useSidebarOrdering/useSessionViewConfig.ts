import { useEffect, useState } from "react";
import { sessionViewDefaults } from "../../../../../shared/sessionViewDefaults";

type SessionViewConfig = typeof sessionViewDefaults;

function numberOr(value: unknown, fallback: number): number {
	return typeof value === "number" ? value : fallback;
}

export function useSessionViewConfig(): SessionViewConfig {
	const [config, setConfig] = useState<SessionViewConfig>(sessionViewDefaults);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			try {
				const res = await fetch("/api/session-view");
				const body = await res.json();
				if (cancelled) return;
				setConfig({
					floatWaiting: Boolean(body?.floatWaiting),
					floatWaitingAfterMs: numberOr(
						body?.floatWaitingAfterMs,
						sessionViewDefaults.floatWaitingAfterMs,
					),
					parkWaitingAfterMs: numberOr(
						body?.parkWaitingAfterMs,
						sessionViewDefaults.parkWaitingAfterMs,
					),
				});
			} catch {
				setConfig(sessionViewDefaults);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	return config;
}
