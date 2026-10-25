import { untilFeedbackClosed } from "../../src/docs/starlight/untilFeedbackClosed";

import.meta.hot?.on("vite:beforeFullReload", () =>
	untilFeedbackClosed(document),
);
