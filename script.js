function updateClock(){
	const now = new Date();
	const hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2,"0");
	document.querySelector('.hours').textContent = hours;
	document.querySelector('.minutes').textContent = minutes;

	const options = {weekday: "long", year: "numeric", month: "long", day:"numeric"};
	const dateStr = now.toLocaleDateString("en-US", options);
	document.querySelector(".date").textContent = dateStr;
}
setInterval(updateClock, 1000);
updateClock();

const test_events = [
  { time: '9:00', title: 'Standup' },
{ time: '10:15', title: 'Email review' },
{ time: '11:55', title: 'Lunch break' },
{ time: '13:00', title: 'Project planning' },
{ time: '14:00', title: 'Dentist' },
{ time: '15:30', title: 'Client call' },
{ time: '16:15', title: 'Code review' },
{ time: '17:00', title: 'Workout' },
{ time: '18:30', title: 'Dinner Sam' },
{ time: '19:30', title: 'Study session' },
{ time: '20:15', title: 'Walk' },
{ time: '21:00', title: 'Reading' },
{ time: '22:00', title: 'Plan next day' },
{ time: '23:00', title: 'Wind down' },
{ time: '23:30', title: 'Sleep' },
];
// Step 1: convert into usable state
//takes in an array with objects inside, {time:"number" title:"event"} and converts time from hours to minutes
function ConvertEvents(input_events_list) {
  let input_events = [];
  let len = input_events_list.length;
  for (let index = 0; index < len; index++) {
    let hour_old = input_events_list[index].time;
    let hour_array = hour_old.split(':');
    let time_index = (Number(hour_array[0]) * 60 )+ Number(hour_array[1]);
    input_events.push({time:time_index, title: input_events_list[index].title})
  }
  return input_events;
}
//step 2: get time rn in minutes
function getTimeRnInMins() {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const time_mins = (hours * 60 )+ mins;
  //console.log(time_mins)
  return time_mins;
}
//step 3: filter for anything now rn
function filter_till_now(events_new, timern){
  let result = []
  for (let event of events_new) {
    if (event.time > timern) {
      result.push(event)
    }
  }
  return result
}


//console.log(filtered_sorted_events)
//step 5: split into next and later 
function now_and_next_up(sorted_events){
  const [upnext, ...later] = sorted_events;
  return {upnext, later};
}
function minutestoCLockString(totalMinutes){
	const hours = Math.floor(totalMinutes/60);
	const mins = String(totalMinutes%60).padStart(2,"0");
	return `${hours}:${mins}`
}
function timeTillEvent(event_time) {
	const timern_time = getTimeRnInMins();
	const timeTillEventTime = event_time - timern_time;
	if (timeTillEventTime < 60) {
		return `${timeTillEventTime}mins`;
	} else {
		const timeTillEventHours = Math.floor(timeTillEventTime/60);
		const remainder_of_time_till_event_hours = timeTillEventTime%60
		return `${timeTillEventHours}h ${remainder_of_time_till_event_hours}mins`
	}
}
//step 4: sort it in ascending

function getCurrentEventState () {
	const filtered_sorted_events = filter_till_now(
 	ConvertEvents(test_events), 
  	//600
  	getTimeRnInMins()).sort(function (a,b) {return a.time - b.time})
	const final_events_list = now_and_next_up(filtered_sorted_events);
	return final_events_list;
}
//step 6: 
function renderCalendar(events){
	//hero
	if (!events.upnext) {
		document.querySelector(".calendar-upnext-time").textContent = "00:00"
		document.querySelector(".upnext-event-name").textContent = "All Done!"
		document.querySelector(".upnext-event-intime").textContent = "";
		document.querySelector(".events-upnext").innerHTML = "";
		const li = document.createElement("li");
		li.textContent = "No events left today";
		document.querySelector(".events-upnext").appendChild(li);
		return;
	}
	const bigNumTime = events.upnext.time;
	const bigWordEvent = events.upnext.title;
	const maxListSize = 9;
	document.querySelector('.calendar-upnext-time').textContent = minutestoCLockString(bigNumTime);
	document.querySelector('.upnext-event-name').textContent = bigWordEvent;
	document.querySelector('.upnext-event-intime').textContent = timeTillEvent(bigNumTime);
	//all the rest
	document.querySelector(".events-upnext").innerHTML = '';

	const other_events = events.later.slice(0,maxListSize);

	for (const event of other_events) {
		let newLi = document.createElement('li');
		newLi.innerHTML = `<span class = "item-time">${minutestoCLockString(event.time)}</span><span class = "item-title">${event.title}</span>`;
		document.querySelector(".events-upnext").appendChild(newLi);
	}
	if (events.later.length > maxListSize){
		const hiddenCount = events.later.length - maxListSize
		let finalli = document.createElement('li');
		finalli.textContent = `+${hiddenCount} more...`
		document.querySelector(".events-upnext").appendChild(finalli);
	}
}
setInterval(function() {
  renderCalendar(getCurrentEventState());
}, 30000);

renderCalendar(getCurrentEventState());
const weather_codes = {
	0: "Sunny",
	1: "Mainly Clear",
	2: "Partly Cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Fog",
	51: "Light Rain",
	53: "Light Rain",
	55: "Light Rain",
	56: "Freezing Drizzle",
	57: "Freezing Drizzle",
	61: "Rain",
	63: "Rain",
	65: "Rain",
	66: "Freezing Rain",
	67: "Freezing Rain",
	71: "Snow",
	73: "Snow",
	75: "Snow",
	77: "Snow Grains",
	80: "Rain Showers",
	81: "Rain Showers",
	82: "Violent Rain Showers",
	85: "Snow Showers",
	86: "Snow Showers",
	95: "Thunderstorm",
	96: "Thunderstorm with Hail",
	99: "Thunderstorm with Hail",
}
const weather_icons = {
	0:`<svg class = "weather-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g><circle cx="64" cy="64" r="19.5" fill="#FFFFFF" stroke="#FFFFFF"/><path fill="#FFFFFF" d="M61 19a3 3 0 1 1 6 0v14a3 3 0 0 1-6 0zM93.699 30.059A3 3 0 1 1 97.94 34.3l-9.9 9.9a3 3 0 1 1-4.242-4.243zM109 61a3 3 0 1 1 0 6H95a3 3 0 1 1 0-6zM97.941 93.699a3 3 0 1 1-4.243 4.242l-9.899-9.9a3 3 0 1 1 4.243-4.242zM61 95a3 3 0 1 1 6 0v14a3 3 0 1 1-6 0zM39.958 83.799a3 3 0 1 1 4.243 4.243l-9.9 9.9a3 3 0 1 1-4.242-4.243zM33 61a3 3 0 1 1 0 6H19a3 3 0 0 1 0-6zM44.201 39.958a3 3 0 1 1-4.243 4.243l-9.9-9.9a3 3 0 1 1 4.243-4.242z"/></g></svg>`,
	2:`<svg class = "weather-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">
  <g clip-path="url(#clip)">
    <g>
      <g>
        <mask id="mask" width="128" height="128" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
          <path fill="#000" fill-rule="evenodd" d="M128 0H0v128h128zM37.952 93h53.023c9.252 0 17.023-7.647 17.023-16.972 0-8.006-5.693-14.678-13.073-16.477.437-9.65-5.25-18.942-14.374-22.759-9.444-3.95-20.485-1.18-27.02 6.446-4.96-1.642-10.55-.942-14.957 2.053-4.428 3.009-7.143 7.99-7.39 13.247-7.12 2.925-11.856 10.313-11.106 18.246.864 9.145 8.75 16.218 17.874 16.216" clip-rule="evenodd"/>
        </mask>

        <g mask="url(#mask)">
          <circle cx="39" cy="51" r="9" fill="#fff"/>

          <g fill="#fff" transform="rotate(30 39 51)">
            <path d="M37.688 31.313a1.312 1.312 0 1 1 2.624 0v6.125a1.312 1.312 0 1 1-2.624 0z"/>
            <path d="M51.993 36.15a1.312 1.312 0 1 1 1.856 1.857l-4.33 4.33a1.312 1.312 0 1 1-1.857-1.855z"/>
            <path d="M58.688 49.688a1.312 1.312 0 1 1 0 2.624h-6.126a1.312 1.312 0 1 1 0-2.624z"/>
            <path d="M53.85 63.993a1.312 1.312 0 1 1-1.857 1.856l-4.33-4.33a1.312 1.312 0 1 1 1.855-1.857z"/>
            <path d="M37.688 64.563a1.312 1.312 0 1 1 2.624 0v6.124a1.312 1.312 0 1 1-2.624 0z"/>
            <path d="M28.482 59.662a1.312 1.312 0 1 1 1.856 1.856l-4.331 4.331a1.312 1.312 0 1 1-1.856-1.856z"/>
            <path d="M25.438 49.688a1.312 1.312 0 1 1 0 2.624h-6.125a1.312 1.312 0 1 1 0-2.624z"/>
            <path d="M30.338 40.482a1.312 1.312 0 1 1-1.856 1.856l-4.331-4.331a1.312 1.312 0 1 1 1.856-1.856z"/>
          </g>
        </g>
      </g>

      <path fill="#fff" d="M90.389 63.086c2.295-9.204-2.648-18.95-11.38-22.604-8.744-3.658-19.181-.344-24.172 7.73-4.3-2.587-9.862-2.434-14.013.387-4.14 2.814-6.324 7.915-5.474 12.855-6.957 1.315-11.957 7.885-11.289 14.954S30.871 89.002 37.953 89h53.024C98.045 89 104 83.119 104 76.028c0-7.327-6.323-13.26-13.611-12.942"/>
    </g>
  </g>

  <defs>
    <clipPath id="clip">
      <rect width="128" height="128" fill="#fff"/>
    </clipPath>
  </defs>
</svg>`,
	3:`<svg class = "weather-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">
  <g clip-path="url(#clip0)">
    <g>
      <g clip-path="url(#clip1)">
        <g>
          <mask id="mask0" width="128" height="128" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
            <path fill="#000" fill-rule="evenodd" d="M128 0H0v128h128zM37.952 93h53.023c9.252 0 17.023-7.647 17.023-16.972 0-8.006-5.693-14.678-13.073-16.477.437-9.65-5.25-18.942-14.374-22.759-9.444-3.95-20.485-1.18-27.02 6.446-4.96-1.642-10.55-.942-14.957 2.053-4.428 3.009-7.143 7.99-7.39 13.247-7.12 2.925-11.856 10.313-11.106 18.246.864 9.145 8.75 16.218 17.874 16.216" clip-rule="evenodd"/>
          </mask>

          <g mask="url(#mask0)">
            <path fill="#fff" d="M101.194 55.562c1.173-4.512-1.434-9.14-5.69-10.849-4.312-1.732-9.543-.239-12.085 3.71-2.154-1.243-4.923-1.173-7.007.186-2.031 1.325-3.169 3.763-2.737 6.17-3.375.612-5.988 3.69-5.644 7.177.344 3.495 3.508 6.045 6.946 6.044 8.836 0 17.674-.007 26.511 0 3.423 0 6.512-2.715 6.512-6.226 0-3.631-3.279-6.36-6.806-6.212"/>
          </g>
        </g>

        <path fill="#fff" d="M90.389 63.086c2.295-9.204-2.648-18.95-11.38-22.604-8.744-3.658-19.181-.344-24.172 7.73-4.3-2.587-9.862-2.434-14.013.387-4.14 2.814-6.324 7.915-5.474 12.855-6.957 1.315-11.957 7.885-11.289 14.954S30.871 89.002 37.953 89h53.024C98.045 89 104 83.119 104 76.028c0-7.327-6.323-13.26-13.611-12.942"/>
      </g>
    </g>
  </g>

  <defs>
    <clipPath id="clip0">
      <rect width="128" height="128" fill="#fff"/>
    </clipPath>
    <clipPath id="clip1">
      <rect width="128" height="128" fill="#fff"/>
    </clipPath>
  </defs>
</svg>`,
	45:`<svg class = "weather-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">
  <g clip-path="url(#clip)">
    <g>
      <g>
        <path fill="#fff" d="M90.389 63.086c2.295-9.204-2.648-18.95-11.38-22.604-8.744-3.658-19.181-.344-24.172 7.73-4.3-2.587-9.862-2.434-14.013.387-4.14 2.814-6.324 7.915-5.474 12.855-6.957 1.315-11.957 7.885-11.289 14.954S30.871 89.002 37.953 89h53.024C98.045 89 104 83.119 104 76.028c0-7.327-6.323-13.26-13.611-12.942"/>
      </g>

      <g>
        <path stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M40 95h48"/>
        <path stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M40 103h48"/>
      </g>
    </g>
  </g>

  <defs>
    <clipPath id="clip">
      <rect width="128" height="128" fill="#fff"/>
    </clipPath>
  </defs>
</svg>`,
	61:`<svg class="weather-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">
  <g clip-path="url(#clip)">
    <path fill="#fff" d="M90.389 63.086c2.295-9.204-2.648-18.95-11.38-22.604-8.744-3.658-19.181-.344-24.172 7.73-4.3-2.587-9.862-2.434-14.013.387-4.14 2.814-6.324 7.915-5.474 12.855-6.957 1.315-11.957 7.885-11.289 14.954S30.871 89.002 37.953 89h53.024C98.045 89 104 83.119 104 76.028c0-7.327-6.323-13.26-13.611-12.942"/>
    <g stroke="#fff" stroke-linecap="round" stroke-width="4">
      <path d="M52 91v12" transform="translate(0 8)"/>
      <path d="M64 91v12"/>
      <path d="M76 91v12" transform="translate(0 8)"/>
    </g>
  </g>
  <defs>
    <clipPath id="clip">
      <rect width="128" height="128" fill="#fff"/>
    </clipPath>
  </defs>
</svg>`
}
async function updateWeather(){
	const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=25.013&longitude=55.288&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code&timezone=auto&forecast_days=3")
	const data = await response.json();
	const todayhigh = data.daily.temperature_2m_max[0];
	const todaylow = data.daily.temperature_2m_min[0];
	const temp_rn = data.current.temperature_2m;
	const condition_rn = data.current.weather_code;
	const condition_text = weather_codes[condition_rn] || "Look Outside";
	const icon_svg = weather_icons[condition_rn] || weather_icons[0];
	document.querySelector(".temperature").textContent = `${temp_rn}°`;
	document.querySelector(".high-low-temp .high").textContent = todayhigh;
	document.querySelector(".high-low-temp .low").textContent = todaylow;
	document.querySelector(".weather-condition").textContent = condition_text;
	document.querySelector(".weather-icon").innerHTML = icon_svg;
}
updateWeather();