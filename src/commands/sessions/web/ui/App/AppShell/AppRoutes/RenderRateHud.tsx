import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { copyRenderRates } from "./RenderRateHud/copyRenderRates";
import { renderCounters } from "../../../renderCounters";
import {
	formatRenderRates,
	sampleRenderRates,
} from "./RenderRateHud/sampleRenderRates";
import { useRenderHudEnabled } from "../useRenderHudEnabled";
import { hudStyle } from "./RenderRateHud/hudStyle";

const SAMPLE_MS = 500;

export function RenderRateHud() {
	const { font } = useTheme().tokens;
	const ref = useRef<HTMLDivElement | null>(null);
	const text = useRef("");
	const enabled = useRenderHudEnabled();

	useEffect(() => {
		if (!enabled) return;
		let previous = new Map(renderCounters);
		let sampledAt = performance.now();
		let frame = requestAnimationFrame(function tick() {
			frame = requestAnimationFrame(tick);
			const now = performance.now();
			if (now - sampledAt < SAMPLE_MS) return;
			const rates = sampleRenderRates(
				renderCounters,
				previous,
				now - sampledAt,
			);
			previous = new Map(renderCounters);
			sampledAt = now;
			text.current = formatRenderRates(rates);
			if (ref.current) ref.current.textContent = text.current;
		});
		return () => cancelAnimationFrame(frame);
	}, [enabled]);

	if (!enabled) return null;

	return (
		<div
			ref={ref}
			style={hudStyle(font.mono)}
			title="Click to copy"
			onClick={() => copyRenderRates(ref.current, text.current)}
			onKeyDown={() => copyRenderRates(ref.current, text.current)}
		/>
	);
}
