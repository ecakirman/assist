import type { PreviewMetadata } from "../shared/SessionInfoBase";

export function parsePreviewMetadata(
	value: unknown,
): PreviewMetadata[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const items = value.flatMap((entry): PreviewMetadata[] => {
		const {
			label,
			value: text,
			url,
		} = (entry ?? {}) as Record<string, unknown>;
		if (typeof label !== "string" || typeof text !== "string") return [];
		return [
			typeof url === "string"
				? { label, value: text, url }
				: { label, value: text },
		];
	});
	return items.length > 0 ? items : undefined;
}
