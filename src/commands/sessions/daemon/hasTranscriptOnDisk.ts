import { findTranscriptPathSync } from "../shared/findTranscriptPathSync";

export function hasTranscriptOnDisk(session: {
	cwd?: string;
	claudeSessionId?: string;
}): boolean {
	return (
		!!session.cwd &&
		!!session.claudeSessionId &&
		!!findTranscriptPathSync(session.cwd, session.claudeSessionId)
	);
}
