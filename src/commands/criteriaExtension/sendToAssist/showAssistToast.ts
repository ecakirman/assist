const TOAST_STYLE = [
	"position: fixed",
	"right: 16px",
	"bottom: 16px",
	"z-index: 2147483647",
	"max-width: 420px",
	"padding: 8px 12px",
	"border-radius: 6px",
	"font: 14px/20px -apple-system, BlinkMacSystemFont, sans-serif",
	"color: var(--fgColor-onEmphasis, #fff)",
	"box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25)",
].join(";");

const BACKGROUND = {
	ok: "var(--bgColor-success-emphasis, #1f883d)",
	error: "var(--bgColor-danger-emphasis, #cf222e)",
};

export function showAssistToast(message: string, ok: boolean): HTMLElement {
	const toast = document.createElement("div");
	toast.setAttribute("data-assist-toast", "");
	toast.setAttribute("role", "status");
	toast.style.cssText = `${TOAST_STYLE};background: ${ok ? BACKGROUND.ok : BACKGROUND.error}`;
	toast.textContent = message;
	document.body.append(toast);
	setTimeout(() => toast.remove(), ok ? 4000 : 8000);
	return toast;
}
