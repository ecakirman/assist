import { parseMessageId } from "./parseMessageId";

type FirefoxContentGlobal = { content?: { fetch?: typeof fetch } };

const IK_IN_GLOBALS = /GLOBALS=\[(?:[^,]*,){9}"([0-9a-f]+)"/;

const ACCOUNT_PATH = /^\/mail\/u\/\d+[/]/;

function pageFetch(): typeof fetch {
	return (globalThis as FirefoxContentGlobal).content?.fetch ?? fetch;
}

function gmailIk(): string | undefined {
	for (const script of document.querySelectorAll("script")) {
		const ik = IK_IN_GLOBALS.exec(script.textContent ?? "")?.[1];
		if (ik) return ik;
	}
	return undefined;
}

function sourceUrls(message: HTMLElement): string[] {
	const account = ACCOUNT_PATH.exec(location.pathname)?.[0] ?? "/mail/u/0/";
	const base = `${location.origin}${account}`;
	const permmsgid = message.dataset.messageId?.replace(/^#/, "");
	const legacy = message.dataset.legacyMessageId;
	const ik = gmailIk();
	return [
		permmsgid &&
			`${base}?${ik ? `ik=${ik}&` : ""}view=om&permmsgid=${encodeURIComponent(permmsgid)}`,
		legacy && `${base}?view=att&th=${legacy}&attid=0&disp=comp&safe=1&zw`,
	].filter((url): url is string => Boolean(url));
}

export async function resolveGmailMessageId(
	message: HTMLElement,
): Promise<string> {
	for (const url of sourceUrls(message)) {
		const response = await pageFetch()(url, { credentials: "include" }).catch(
			() => undefined,
		);
		if (!response?.ok) continue;
		const messageId = parseMessageId(await response.text());
		if (messageId) return messageId;
	}
	throw new Error("Couldn't resolve this message's Message-ID");
}
