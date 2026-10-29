import type { HighLevelTestExcerpt } from "../../../../../../../../../../review/highLevel/types";

export function testSourcePatch(excerpts: HighLevelTestExcerpt[]): string {
	return excerpts
		.flatMap(({ source, line }) => {
			const lines = source.split("\n");
			const range = `${line},${lines.length}`;
			return [`@@ -${range} +${range} @@`, ...lines.map((text) => ` ${text}`)];
		})
		.join("\n");
}
