import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const fixtures: Record<string, string> = {
	"hexColour.ts": 'export const hexColour = { color: "#1e1e1e" };\n',
	"rgbaColour.ts":
		'export const rgbaColour = { bgcolor: "rgba(255, 167, 38, 0.09)" };\n',
	"outline.ts": `export const outline = (w: number) => \`\${w}px solid #7cfc9a\`;\n`,
	"bareMono.ts": 'export const bareMono = { fontFamily: "monospace" };\n',
	"fontStack.ts":
		'export const fontStack = "11px/1.4 ui-monospace, Menlo, monospace";\n',
	"themeMono.ts":
		'export const themeMono = { fontFamily: "fontFamilyMono" };\n',
	"paletteColour.ts":
		'export const paletteColour = { color: "text.secondary", label: "acme/widgets#123" };\n',
};

let codesByFile: Map<string, number>;

const hits = (file: string): number => codesByFile.get(file) ?? 0;

beforeAll(() => {
	const dir = mkdtempSync(join(tmpdir(), "no-raw-style-values-"));
	try {
		for (const [name, content] of Object.entries(fixtures)) {
			writeFileSync(join(dir, name), content);
		}
		const config = join(dir, ".oxlintrc.json");
		writeFileSync(
			config,
			JSON.stringify({
				jsPlugins: [resolve("oxlint-rules/noRawStyleValues.ts")],
				categories: { correctness: "off" },
				rules: { "design/no-raw-style-values": "error" },
			}),
		);
		let stdout: string;
		try {
			stdout = execFileSync(
				resolve("node_modules/.bin/oxlint"),
				["--config", config, "--format", "json", dir],
				{ encoding: "utf8" },
			);
		} catch (error) {
			stdout = (error as { stdout: string }).stdout;
		}
		const parsed = JSON.parse(stdout) as {
			diagnostics: { code: string; filename: string }[];
		};
		codesByFile = new Map();
		for (const diagnostic of parsed.diagnostics) {
			if (diagnostic.code !== "design(no-raw-style-values)") continue;
			const file = basename(diagnostic.filename);
			codesByFile.set(file, hits(file) + 1);
		}
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}, 30_000);

afterAll(() => {
	codesByFile = new Map();
});

describe("design/no-raw-style-values", () => {
	it.each(["hexColour.ts", "rgbaColour.ts", "outline.ts"])(
		"fires on the raw colour in %s",
		(file) => {
			expect(hits(file)).toBe(1);
		},
	);

	it.each(["bareMono.ts", "fontStack.ts"])(
		"fires once on the raw font family in %s",
		(file) => {
			expect(hits(file)).toBe(1);
		},
	);

	it.each(["themeMono.ts", "paletteColour.ts"])(
		"allows theme references and issue refs in %s",
		(file) => {
			expect(hits(file)).toBe(0);
		},
	);
});
