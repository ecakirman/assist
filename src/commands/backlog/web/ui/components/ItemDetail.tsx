import { useNavigate } from "react-router";
import { countRender } from "../../../../sessions/web/ui/renderCounters";
import { updateItemStatus } from "../api";
import type { BacklogItem } from "../types";
import { useApiNode } from "../../../../sessions/web/ui/useApiNode";
import { useRepoCwd } from "../useRepoCwd";
import { ItemBody } from "./ItemBody";
import { ItemDetailColumns } from "./ItemDetailColumns";
import { ItemNavigator } from "./ItemNavigator";
import { PinnedHeader } from "./PinnedHeader";
import { usePinnedHeaderHeight } from "./usePinnedHeaderHeight";

type ItemDetailProps = {
	item: BacklogItem;
	onReload: () => Promise<void>;
};

export function ItemDetail({ item, onReload }: ItemDetailProps) {
	const navigate = useNavigate();
	const cwd = useRepoCwd();
	const node = useApiNode();
	const { headerRef, headerHeight, style } = usePinnedHeaderHeight();
	countRender("ItemDetail");
	const handleDeleted = async () => {
		await onReload();
		navigate("/backlog");
	};
	const handleStatusChange = async (status: BacklogItem["status"]) => {
		await updateItemStatus(item.id, status, cwd, node);
		await onReload();
	};
	return (
		<ItemDetailColumns
			style={style}
			header={
				<PinnedHeader
					ref={headerRef}
					item={item}
					onDeleted={handleDeleted}
					onStatusChange={handleStatusChange}
				/>
			}
			body={
				<ItemBody item={item} onRewind={onReload} onCommentDeleted={onReload} />
			}
			navigator={<ItemNavigator item={item} headerHeight={headerHeight} />}
		/>
	);
}
