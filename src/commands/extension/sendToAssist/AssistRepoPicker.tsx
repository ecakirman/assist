import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { requestAssistClones } from "./requestAssistClones";

export function AssistRepoPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (repo: string) => void;
}) {
	const [clones, setClones] = useState<string[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let active = true;
		void requestAssistClones().then((result) => {
			if (!active) return;
			if (result.ok) setClones(result.clones);
			else setError(result.message);
		});
		return () => {
			active = false;
		};
	}, []);

	return (
		<TextField
			select
			fullWidth
			size="small"
			sx={{ mt: 1 }}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			error={Boolean(error)}
			helperText={error}
			slotProps={{
				select: { native: true },
				htmlInput: { "aria-label": "Repo for assist" },
			}}
		>
			<option value="">{clones ? "Pick a repo" : "Loading repos…"}</option>
			{clones?.map((clone) => (
				<option key={clone} value={clone}>
					{clone}
				</option>
			))}
		</TextField>
	);
}
