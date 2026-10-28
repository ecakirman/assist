export function decodeUrlPart(part: string): string {
	try {
		return decodeURIComponent(part);
	} catch {
		return part;
	}
}
