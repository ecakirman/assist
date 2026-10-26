import { createTextDirectivePlugin } from "./createTextDirectivePlugin";
import { renderIcon } from "./renderIcon";

export const iconPlugin = createTextDirectivePlugin("icon", renderIcon);
