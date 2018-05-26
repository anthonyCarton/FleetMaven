// JavaScript Document



// Start only after DOM is ready, using prefered syntax: $(handler)
$(function () {
	'use strict';



	// DECLARE GLOBAL CONSTANTS
	// escalation rates from: afdc.energy.gov/calc/cost_calculator_methodology.html#sources
	const escGas = 0.018;
	const escE85 = 0.016;
	const escCng = 0.003;
	const escLpg = 0.013;
	const escDie = 0.018;
	const escB20 = 0.018;
	const escB10 = 0.018;
	const escEle = -0.003; // electricty has negative escalation rate



	// DECLARE AVERAGE VARIABLES
	// Let = Data Response & Const = Array
	let gasAve; // Gas Average from data.colorado.gov/Energy/Gasoline-Prices-in-Colorado/8pk9-mh2i
	let cngAve; // CNG Average from data.colorado.gov/Energy/Natural-Gas-Prices-in-Colorado/e4ky-6g2n
	let eleAve; // Electric Average from data.colorado.gov/Business/Electricity-Revenue-in-Colorado/q6sk-tjm9

	// E85, LPG, Diesel, B20, B100 Averages from afdc.energy.gov/fuels/prices.html (no GET)
	const e85Ave = {"2017":2.68, "2018":2.72, "2019":2.76, "2020":2.81, "2021":2.85, "2022":2.90, "2023":2.94, "2024":2.99};
	const lpgAve = {"2017":3.86, "2018":3.81, "2019":3.96, "2020":4.01, "2021":4.06, "2022":4.12, "2023":4.17, "2024":4.23}
	const dieAve = {"2017":2.37, "2018":2.41, "2019":2.46, "2020":2.50, "2021":2.55, "2022":2.59, "2023":2.64, "2024":2.69};
	const b20Ave = {"2017":2.37, "2018":2.41, "2019":2.46, "2020":2.50, "2021":2.55, "2022":2.59, "2023":2.64, "2024":2.69};
	const b10Ave = {"2017":2.37, "2018":2.41, "2019":2.46, "2020":2.50, "2021":2.55, "2022":2.59, "2023":2.64, "2024":2.69};



	// DECLARE INTERFACE VARIABLES
	let depInt;
	let fuelType;



	// CREATE EVENT LISTENERS
	// depInt  EVENT LISTENER
	$("#depInt").change(function () {
		depInt = $("#depInt").val();
	});

	// fuelType EVENT LISTENER
	$("#fuelType").change(function () {
		fuelType = $("#fuelType").val();
	});

	// fuelGrade EVENT LISTENER
	$("select").change(function () {
		switch (fuelType) {
			case 'gas':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(gasAve, escGas);
				break;

			case 'e85':
				// do something
				console.log("fuel type changed to " + fuelType);
				// it would probably make more sense to call for fuelHist[] data here
				// write a function to pull in fuelHist[] data and call it here, passing in fuelType
				simpleFuelCompound(e85Ave, escE85);
				break;

			case 'cng':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(cngAve, escCng);
				break;

			case 'lpg':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(lpgAve, escLpg);
				break;

			case 'die':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(dieAve, escDie);
				break;

			case 'b20':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(b20Ave, escB20);
				break;

			case 'b10':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(b10Ave, escB10);
				break;

			case 'ele':
				// do something
				console.log("fuel type changed to " + fuelType);
				simpleFuelCompound(eleAve, escEle);
				break;

		}
	});


	// FUEL HISTORY ARRAYS
	// LAST 52 weekly values of each
	// test variables to be replaced by data call
	let gasHist = [];
	let e85Hist = [1, 1, 1];
	let cngHist = [2, 2, 2];
	let lpgHist = [1.5, 1.8, 2.1];
	let dieHist = [4, 4, 4];
	let b20Hist = [5, 5, 5];
	let b10Hist = [6, 6, 6];
	let eleHist = [7, 7, 7];



	// JSON GET REQUESTS
	// Currently called right away when page loads
	// Gasoline Prices in Colorado fetch & parse
	function gasCall() {
	  $.ajax({
	      "async": true,
	      "crossDomain": true,
	      "method": "GET",
	      "url": "https://data.colorado.gov/resource/xyh2-p9cg.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24select=avg(allgradesgasprice)&%24where=date%20between%20'2017-01-01T12%3A00%3A00'%20and%20'2017-12-31T11%3A59%3A59'"
	  }).done(function (response) {
	          [{"avg_allgradesgasprice":gasAve}] = response;
	          displayAve();
	      });
	  function displayAve() {
	  	console.log(gasAve)
		}
	}

	function cngCall() {
	  $.ajax({
	      "async": true,
	      "crossDomain": true,
	      "method": "GET",
	      "url":  "https://data.colorado.gov/resource/uxyf-4dfg.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24where=date%20between%20'2016-12-31T11%3A59%3A59'%20and%20'2017-12-31T11%3A59%3A59'&%24select=avg(commercialprice)"
	  }).done(function (response) {
	          [{"avg_commercialprice":cngAve}] = response;
	          displayAve();
	      });
	  function displayAve() {
	  	console.log(cngAve)
		}
	}








	gasCall();
	cngCall();



	// SIMPLE FUEL / UNIT PROJECTOR
	// simpleFuelCompound() projects fuelPrice / unit (gal, lb, etc) based on last year average and escalation rates
	function simpleFuelCompound(aveFuel, escRate) {
		console.log(`last years fuelAve is ${aveFuel.toFixed(2)} and escRate is ${escRate}`);
		for (let year = 1; year <= depInt; year++) {

			// take this years average for CO, multiply by escRate, add to ave, return sum.
			aveFuel = (aveFuel * escRate) + aveFuel;
			console.log(`Predicted year ${year} ${fuelType}/unit average $${aveFuel.toFixed(2)} with escalation rate of ${escRate}`);
		}
	}












	// all code before this
});
