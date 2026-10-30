export function gmailPermalink(messageId: string): string {
	return `https://mail.google.com/mail/u/0/#search/rfc822msgid%3A${encodeURIComponent(messageId)}`;
}
