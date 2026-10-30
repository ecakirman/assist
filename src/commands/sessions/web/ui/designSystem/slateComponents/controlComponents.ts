import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";
import { buttonComponents } from "./buttonComponents";
import { chipComponents } from "./chipComponents";

export function controlComponents(tokens: ActiveTokens): Components<Theme> {
	return {
		...buttonComponents(tokens),
		MuiButtonGroup: {
			defaultProps: { disableElevation: true },
			variants: [
				{
					props: { variant: "tonal" },
					style: {
						"& .MuiButtonGroup-middleButton, & .MuiButtonGroup-lastButton": {
							marginLeft: -1,
						},
					},
				},
			],
		},
		...chipComponents(tokens),
	};
}
