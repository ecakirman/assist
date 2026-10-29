import type { ActiveTokens } from "../DesignTokens";

const rem = (px: number) => `${px / 16}rem`;

export function typography({ font, type }: ActiveTokens) {
	const { scale } = type;
	return {
		fontFamily: font.ui,
		fontSize: type.fontSize,
		button: { ...type.button, fontSize: rem(scale.button) },
		caption: { fontSize: rem(scale.caption) },
		body2: { fontSize: rem(scale.body2) },
		body1: { fontSize: rem(scale.body1) },
		subtitle2: { fontSize: rem(scale.subtitle2) },
		subtitle1: { fontSize: rem(scale.subtitle1) },
		h6: { fontSize: rem(scale.h6) },
		h5: { fontSize: rem(scale.h5) },
		h4: { fontSize: rem(scale.h4) },
	};
}
