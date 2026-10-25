import { createTextDirectivePlugin } from "./createTextDirectivePlugin";
import { renderKbd } from "./renderKbd";

export const kbdPlugin = createTextDirectivePlugin("kbd", (chord) => {
	if (!chord) throw new Error(":kbd[] needs a chord such as :kbd[Mod+N]");
	return renderKbd(chord);
});
