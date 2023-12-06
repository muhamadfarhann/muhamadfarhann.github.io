let count = 0;

function updateCounter() {
	const counterElement = document.getElementById("counter");
	counterElement.textContent = count.toString();
}

window.onload = function () {
	count++; //
	updateCounter();
};