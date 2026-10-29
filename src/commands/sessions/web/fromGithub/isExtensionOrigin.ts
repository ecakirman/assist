const EXTENSION_ORIGIN = /^(moz|chrome)-extension:\/\/[^/]+$/;

export function isExtensionOrigin(origin: string | undefined): boolean {
	return !!origin && EXTENSION_ORIGIN.test(origin);
}
