/** Serialize API calls, space starts, and honor Notion's Retry-After response. */
export function createNotionQueue(
	interval = 400,
	wait: (milliseconds: number) => Promise<void> = (ms) =>
		new Promise((resolve) => setTimeout(resolve, ms)),
	now: () => number = Date.now
) {
	let tail: Promise<unknown> = Promise.resolve();
	let nextStart = 0;
	return function request<T>(operation: () => Promise<T>): Promise<T> {
		const result = tail.then(async () => {
			for (let attempt = 0; ; attempt++) {
				await wait(Math.max(0, nextStart - now()));
				nextStart = now() + interval;
				try {
					return await operation();
				} catch (error) {
					const response = error as {
						status?: number;
						headers?: { get(name: string): string | null };
					};
					if (response.status !== 429 || attempt >= 3) throw error;
					const retryAfter = Number(response.headers?.get('retry-after'));
					const delay =
						Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
					nextStart = Math.max(nextStart, now() + delay);
				}
			}
		});
		// A failed call must not poison subsequent requests or retries of initialization.
		tail = result.catch(() => undefined);
		return result;
	};
}
