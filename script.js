function updateClock(){
	const now = new Date();
	const hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2,"0");
	document.querySelector('.time-card .clock-digits').textContent = `${hours}:${minutes}`

	const options = {weekday: "long", year: "numeric", month: "long", day:"numeric"};
	const dateStr = now.toLocaleDateString("en-US", options);
	document.querySelector(".date").textContent = dateStr;
}
setInterval(updateClock, 1000);
updateClock();