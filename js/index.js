function updateLocalCounter() {
	const counterElement = document.getElementById("counter");
	if (!counterElement) return;
	const current = Number(counterElement.textContent || 0);
	counterElement.textContent = String(current + 1);
}

async function fetchCountApiValue(url) {
	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) throw new Error("Request failed");
	const data = await res.json();
	if (!data || typeof data.value !== "number") throw new Error("Invalid response");
	return data.value;
}

async function updateVisitorCounter() {
	const valueEl = document.getElementById("visitorCount");
	if (!valueEl) return;

	const formatter = new Intl.NumberFormat("id-ID");
	const namespace = "muhamadfarhann-github-io";
	const key = "index";
	const sessionKey = `visited:${namespace}:${key}`;
	const resource = `${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;
	const baseUrl = "https://api.countapi.xyz";

	try {
		const value = sessionStorage.getItem(sessionKey)
			? await fetchCountApiValue(`${baseUrl}/get/${resource}`)
			: await fetchCountApiValue(`${baseUrl}/hit/${resource}`);

		if (!sessionStorage.getItem(sessionKey)) {
			sessionStorage.setItem(sessionKey, "1");
		}

		valueEl.textContent = formatter.format(value);
	} catch {
		valueEl.textContent = "—";
	}
}

document.addEventListener("DOMContentLoaded", () => {
	updateLocalCounter();
	updateVisitorCounter();
});
