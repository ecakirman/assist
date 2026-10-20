import { createContext } from "react";

export type HighLevelHeadSource = {
	load: (path: string) => Promise<string[]>;
};

export const highLevelHeadSourceContext = createContext<
	HighLevelHeadSource | undefined
>(undefined);
