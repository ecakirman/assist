export function testSourcePatch(source: string, line: number): string {
	const lines = source.split("\n");
	const range = `${line},${lines.length}`;
	return [`@@ -${range} +${range} @@`, ...lines.map((text) => ` ${text}`)].join(
		"\n",
	);
}
