export type VerifyMode = "check" | "fix";

export function resolveVerifyMode(): VerifyMode {
	const explicit = process.env.VERIFY_MODE;
	if (explicit === "check" || explicit === "fix") return explicit;
	if (process.env.CI) return "check";
	return "fix";
}
