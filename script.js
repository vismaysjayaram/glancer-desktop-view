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
