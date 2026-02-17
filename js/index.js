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
	const hitWindowMs = 24 * 60 * 60 * 1000;
	const storageKey = `lastHitAt:${namespace}:${key}`;
	const lastHitAt = Number(localStorage.getItem(storageKey) || 0);
	const shouldHit = !lastHitAt || Date.now() - lastHitAt > hitWindowMs;
	const resource = `${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;
	const baseUrl = "https://api.countapi.xyz";

	try {
		const value = shouldHit
			? await fetchCountApiValue(`${baseUrl}/hit/${resource}`)
			: await fetchCountApiValue(`${baseUrl}/get/${resource}`);

		if (shouldHit) localStorage.setItem(storageKey, String(Date.now()));

		valueEl.textContent = formatter.format(value);
	} catch {
		valueEl.textContent = "—";
	}
}

document.addEventListener("DOMContentLoaded", () => {
	updateLocalCounter();
	updateVisitorCounter();
});
