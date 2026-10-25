import { createTextDirectivePlugin } from "./createTextDirectivePlugin";
import { renderStatus } from "./renderStatus";

export const statusPlugin = createTextDirectivePlugin("status", renderStatus);
