import { usePreviewWidthContext } from "../../../../usePreviewWidthContext";
import { slideInSx } from "../slideInSx";

export function useSlideInSx(open: boolean) {
	return slideInSx(open, usePreviewWidthContext().full);
}
