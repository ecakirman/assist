const STYLE_ATTRIBUTE = "data-assist-send-style";

const CSS = `
.assist-send {
	font: inherit;
	font-size: 12px;
	font-weight: 600;
	line-height: 20px;
	display: inline-flex;
	align-items: center;
	align-self: center;
	vertical-align: middle;
	gap: 6px;
	padding: 1px 8px 1px 5px;
	margin-left: 6px;
	border-radius: 6px;
	border: 1px solid var(--button-default-borderColor-rest, var(--borderColor-default, #d1d9e0));
	background: var(--button-default-bgColor-rest, #f6f8fa);
	color: var(--button-default-fgColor-rest, var(--fgColor-default, #1f2328));
	cursor: pointer;
	transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.assist-send img {
	width: 16px;
	height: 16px;
	display: block;
	transition: transform 0.2s ease;
}
.assist-send--header {
	padding: 3px 12px 3px 8px;
	margin-left: 0;
}
.assist-send--before-date {
	margin-right: 8px;
}
.assist-send:hover:not(:disabled) {
	background: var(--button-default-bgColor-hover, #eff2f5);
	border-color: var(--fgColor-muted, #59636e);
	box-shadow: var(--shadow-resting-small, 0 1px 3px rgba(31, 35, 40, 0.12));
}
.assist-send:hover:not(:disabled) img {
	transform: scale(1.12);
}
.assist-send:active:not(:disabled) {
	background: var(--button-default-bgColor-active, #e6eaef);
	box-shadow: none;
}
.assist-send:focus-visible {
	outline: 2px solid var(--focus-outlineColor, #0969da);
	outline-offset: -2px;
}
.assist-send:disabled {
	cursor: progress;
	opacity: 0.6;
}
@media (prefers-reduced-motion: reduce) {
	.assist-send,
	.assist-send img {
		transition: none;
	}
}
`;

export function ensureAssistButtonStyles(): void {
	if (document.head.querySelector(`[${STYLE_ATTRIBUTE}]`)) return;
	const style = document.createElement("style");
	style.setAttribute(STYLE_ATTRIBUTE, "");
	style.textContent = CSS;
	document.head.append(style);
}
