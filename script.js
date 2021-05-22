"use strict";

let dates = [];
function formatDate(date) {
	var d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [day, month, year].join("-");
}

[0, 1, 2, 3, 4, 5].forEach((incrementer) => {
	const date = new Date();
	date.setDate(new Date().getDate() + incrementer);
	dates.push(formatDate(date));
});
const today = dates.shift();

let doseValue = "available_capacity_dose1";
let ageValue = 44;

document.getElementById(
	"header"
).innerText = `Chennai Vaccines Availability from ${today} to ${
	dates[dates.length - 1]
}`;

document.getElementById("fetch-btn").addEventListener("click", () => {
	if (!ageValue) {
		alert("Please Select Age");
		return;
	}
	if (!doseValue) {
		alert("Please Select Dose");
		return;
	}
	document.getElementsByClassName("list")[0].remove();
	fetch(
		"https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=" +
			571 + // district id
			"&date=" +
			today
	).then(async (d) => {
		const data = await d.json();
		const availableCentres = data.centers.filter((centre) =>
			centre.sessions.some(
				(s) =>
					s.min_age_limit <= Number(ageValue) &&
					dates.indexOf(s.date) > -1 &&
					s[doseValue] > 0
			)
		);
		const list = document.createElement("div");
		list.classList.add("list");
        let centreTemplate;
		if (availableCentres.length === 0) {
            centreTemplate = vaccineCenter.content.cloneNode(true);
			let name = centreTemplate.querySelector("#name");
			name.innerHTML = `No Vaccine Centres Available.`;
            list.appendChild(centreTemplate);
		}
		availableCentres.forEach((centre, index) => {
            centreTemplate = vaccineCenter.content.cloneNode(true);
			let name = centreTemplate.querySelector("#name");
			name.innerHTML = `${index + 1}. ${centre.name} - ${centre.block_name}`;

			const sessionsData = centre.sessions.filter(
				(session) => dates.indexOf(session.date) > -1 && session[doseValue] > 0
			);
			let sessionsEl = centreTemplate.querySelector("#sessions");
			sessionsData.forEach((s) => {
				sessionsEl.innerHTML += `${s.date} - ${s.vaccine} - ${s[doseValue]} <br>`;
			});
            list.appendChild(centreTemplate);
		});
		main.appendChild(list);
	});
});

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
