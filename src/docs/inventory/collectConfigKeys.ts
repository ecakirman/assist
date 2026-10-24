import { configHelpEntries } from "../../commands/configHelpEntries";
import { describeConfigLeaves } from "../../shared/describeConfigLeaves";
import { assistConfigSchema } from "../../shared/types";
import type { InventoryItem } from "./InventoryItem";

export function collectConfigKeys(): InventoryItem[] {
	const notes = new Map(configHelpEntries.map((entry) => [entry.key, entry]));
	return describeConfigLeaves(assistConfigSchema).map((leaf) => {
		const help = notes.get(leaf.key);
		return {
			id: `config:${leaf.key}`,
			description: help ? `${help.note} (${help.setter})` : "",
		};
	});
}
