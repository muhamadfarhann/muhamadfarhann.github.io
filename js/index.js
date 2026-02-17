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
	// counterapi.dev returns { count: number }
	if (data && typeof data.count === "number") return data.count;
	// countapi.xyz returns { value: number }
	if (data && typeof data.value === "number") return data.value;
	throw new Error("Invalid response");
}

async function updateVisitorCounter() {
	const valueEl = document.getElementById("visitorCount");
	if (!valueEl) return;

	const formatter = new Intl.NumberFormat("id-ID");
	// counterapi.dev uses simpler structure, usually just a namespace/key or just key
	// Let's use muhamadfarhann.github.io as the namespace and index as the key
	const namespace = "muhamadfarhann.github.io";
	const key = "index";
	
	const storageKey = `lastHitAt:${namespace}:${key}`;

	// Check if we have hit this counter in the last 24 hours
	const hitWindowMs = 24 * 60 * 60 * 1000;
	const lastHitAt = Number(localStorage.getItem(storageKey) || 0);
	const shouldHit = !lastHitAt || Date.now() - lastHitAt > hitWindowMs;
	
	// counterapi.dev endpoints:
	// GET /v1/{namespace}/{key}/up - Increment and get
	// GET /v1/{namespace}/{key}    - Get only
	const baseUrl = "https://api.counterapi.dev/v1";
	// Note: counterapi.dev treats namespace and key separately in the URL path, not combined
	// Correct format: /v1/{namespace}/{key}/up
	const resource = `${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;

	try {
		// Always fetch current count regardless of hit status to ensure display is correct
		// If we should hit, we use /up endpoint, otherwise just get current count
		const url = shouldHit
			? `${baseUrl}/${resource}/up`
			: `${baseUrl}/${resource}`;
			
		console.log("Fetching counter from:", url);
		const value = await fetchCountApiValue(url);
		console.log("Counter value:", value);

		if (shouldHit) localStorage.setItem(storageKey, String(Date.now()));

		valueEl.textContent = formatter.format(value);
	} catch (e) {
		console.warn("Counter API failed", e);
		valueEl.textContent = "—";
	}
}

export function initCounter() {
	updateLocalCounter();
	updateVisitorCounter();
}
