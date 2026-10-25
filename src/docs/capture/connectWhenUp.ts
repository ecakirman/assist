import { connect } from "node:net";

export function connectWhenUp(path: string, deadline: number) {
	return new Promise<ReturnType<typeof connect>>((resolve, reject) => {
		const socket = connect(path);
		socket.once("connect", () => resolve(socket));
		socket.once("error", (error) => {
			if (Date.now() > deadline) reject(error);
			else
				setTimeout(
					() => connectWhenUp(path, deadline).then(resolve, reject),
					250,
				);
		});
	});
}
