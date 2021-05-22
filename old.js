"use strict";

let states = [];
let districts = [];
let dates = [];

[0, 1, 2, 3, 4, 5].forEach((incrementer) => {
	const date = new Date();
	date.setDate(new Date().getDate() + incrementer);
	dates.push(
		date.getDate() +
			"-0" +
			(date.getMonth() + 1) +
			"-" +
			new Date().getFullYear()
	);
});
const today = dates.shift();

let stateValue = null;
let districtValue = "571";
let doseValue = "available_capacity_dose1";
let ageValue = 44;

// fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states").then(
// 	async (data) => {
// 		data = await data.json();
// 		states = data.states;
// 		states.forEach((state) => {
// 			const template = optionTemplate.content.cloneNode(true);
//             let option = template.querySelector("#option");
//             option.value = state.state_id;
// 			option.innerHTML = state.state_name;
// 			document.getElementById("stateSelector").appendChild(template);
// 		});
// 	}
// );
// fetchDistricts(31);

// function fetchDistricts(value) {
//     stateValue = value;
// 	fetch(
// 		"https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + stateValue
// 	).then(async (data) => {
// 	    removeAllChildNodes(districtSelector);
// 		data = await data.json();
// 		districts = data.districts;
// 		districts.forEach((state) => {
// 			const template = optionTemplate.content.cloneNode(true);
//             let option = template.querySelector("#option");
//             option.value = state.district_id;
// 			option.innerHTML = state.district_name;
// 			document.getElementById("districtSelector").appendChild(template);
// 		});
// 	});
// }


document.getElementById("fetch-btn").addEventListener("click", () => {
	// if (!stateValue) {
	// 	alert("Please Select State");
	// 	return;
	// }
	// if (!districtValue) {
	// 	alert("Please Select District");
	// 	return;
	// }
	if (!ageValue) {
		alert("Please Select Age");
		return;
	}
	if (!doseValue) {
		alert("Please Select Dose");
		return;
	}
	removeAllChildNodes(list);
	fetch(
		"https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=" +
			districtValue +
			"&date=" +
			today
	).then(async (d) => {
		const data = await d.json();
		const eighteenAbove = data.centers.filter((centre) =>
			centre.sessions.some(
				(s) =>
					s.min_age_limit <= Number(ageValue) &&
					dates.indexOf(s.date) > -1 &&
					s[doseValue] > 0
			)
		);
		if (eighteenAbove.length === 0) {
			const noVaccineMessage = noVaccine.content.cloneNode(true);
			document.getElementById("list").appendChild(noVaccineMessage);
			return;
		}
		eighteenAbove.forEach((centre, index) => {
			const centreTemplate = vaccineCenter.content.cloneNode(true);
			let name = centreTemplate.querySelector("#name");
			name.innerHTML = `${index + 1}. ${centre.name} - ${centre.block_name}`;

			document.getElementById("list").appendChild(centreTemplate);
		});
	});
});

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
