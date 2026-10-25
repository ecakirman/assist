import { createTextDirectivePlugin } from "./createTextDirectivePlugin";
import { renderBadge } from "./renderBadge";

export const badgePlugin = createTextDirectivePlugin("badge", renderBadge);
