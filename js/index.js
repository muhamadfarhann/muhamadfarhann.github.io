function updateLocalCounter() {
	const counterElement = document.getElementById("counter");
	if (!counterElement) return;
	const current = Number(counterElement.textContent || 0);
	counterElement.textContent = String(current + 1);
}

export function initCounter() {
	updateLocalCounter();
}
