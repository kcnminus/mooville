/*
	Strongly Typed by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
import { time } from 'console';
import { start } from 'repl';
import './style.css'
(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			hoverDelay: 150,
			hideDelay: 350
		});

	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);
const eventContainer = document.querySelector('#events-container')

const getMonth = (month) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
const getDayOfWeek = (weekday) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday];
const isAM = (hour) => hour <12;
const getHour = (hour) => (hour <= 12 ? hour : hour - 12);
const getMinute = (minute) => (minute === 0 ? '00' : minute);

function processDate(date){
	const hour = getHour(date.getHours()) === 0 ? false : getHour(date.getHours());
	const minute = getMinute(date.getMinutes());
	const timeSuffix = `<small>${isAM(date.getHours()) ? `AM` : `PM`}</small>`
	const time = hour && `${hour}:${minute}${timeSuffix}`
	return {
		month: getMonth(date.getMonth()),
		weekday: getDayOfWeek(date.getDay()),
		time,
		date: date.getDate()
	}
	console.log(date)
}

function mapEventObject(event){
	const startDate = event.start.dateTime ? processDate(new Date(item.start.dateTime)) : processDate(new Date(`${event.start.date}T00:00:00`))
	const endDate = event.end.dateTime ? processDate(new Date(item.end.dateTime)) : processDate(new Date(`${event.end.date}T00:00:00`))
	let dateRange;
	if (startDate.date !== endDate.date){
		dateRange = `${startDate.month} ${startDate.date}-${endDate.month} ${endDate.date}`
	} else if (!startDate.time) {
		dateRange = `${startDate.month} ${startDate.date}`;
	} else {
		dateRange = `${startDate.weekday}, ${startDate.time} - ${endDate.time }`
	}

	return {
		name: event.summary,
		description: event.description,
		location: event.location,
		start: startDate,
		end: endDate,
		dateRange,
	}
}

function createEvent(e,i) {
	return `<div class="col-4 col-6-medium col-12-small">
				<section>
					<header>
						<h3 class="text-sm">${e.start.month} ${e.start.date}</h3>
					</header>
					<p>${e.name}<br>
						${e.dateRange}
					</p>
			
				</section>
			</div>`
}

async function loadEvents(max=9){
	try {
		const endpoint = await fetch(`./.netlify/functions/calFetch?maxResults=${max}`)
		const data = await endpoint.json();
		const processedEvents = data.map(e => mapEventObject(e));
		eventContainer.innerHTML = processedEvents.map((event, i) => createEvent(event, i)).join('')
	} catch (e) {
		eventContainer.innerHTML = `<p class="text-center text-3xl"> :screaming-cat: Something went wrong!</p>`
		console.log(e);
	}
}
loadEvents();