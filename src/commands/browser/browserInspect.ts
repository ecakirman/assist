import chalk from "chalk";
import { formatInspectMatches } from "./formatInspectMatches";
import { requestTab } from "./requestTab";

export async function browserInspect(
	selector: string | undefined,
	options: { text?: string; url?: string; server: string },
): Promise<void> {
	if (!selector === !options.text) {
		console.error(
			chalk.red("Error: pass either a <selector> or --text <text>, not both"),
		);
		process.exit(1);
	}
	const query = options.text
		? { text: options.text }
		: { selector: selector as string };
	const result = await requestTab(options.server, {
		op: "inspect",
		url: options.url,
		...query,
	});
	const label = options.text
		? `text ${JSON.stringify(options.text)}`
		: `selector ${selector}`;
	for (const line of formatInspectMatches(result, label)) console.log(line);
}
