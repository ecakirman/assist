const ENTITIES: Record<string, string> = {
	"&lt;": "<",
	"&gt;": ">",
	"&amp;": "&",
	"&quot;": '"',
	"&#39;": "'",
};

const RAW_OR_ESCAPED_MESSAGE_ID_HEADER =
	/(?:^|>)Message-ID:[ \t]*(?:\r?\n[ \t]+)?(?:<|&lt;)([^\s<>]+?)(?:>|&gt;)/im;

export function parseMessageId(source: string): string | undefined {
	const match = RAW_OR_ESCAPED_MESSAGE_ID_HEADER.exec(source);
	if (!match) return undefined;
	const id = match[1].replace(/&(?:lt|gt|amp|quot|#39);/g, (e) => ENTITIES[e]);
	return `<${id}>`;
}
