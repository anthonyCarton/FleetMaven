// JavaScript Document

// Start only after DOM is ready, using prefered syntax: $(handler)
$(function () {
	'use strict';



	// WHAT YEAR IS IT?
	let d = new Date();
	let thisYear = d.getFullYear();
	let lastYear = thisYear - 1;



	// START Vehicle Expense Constants 	***	***	***	***	***	***	***	***	//
	// Tires and Maintenance = $.0538 / mile according to AAA
	const tiresMaint = 0.0538;

	// EV Tires and Maintenance = $.0410 / mile according to UC-Davis
	const evTiresMaint = 0.0410;

	// Depreciation Rate 20% the first year, 15% each year after, graduated method
	const depRate = [0.20, 0.15, 0.15, 0.15, 0.15];

	// Insurance, License and Registration estimate from AAA
	const insRegis = 1616;

	// Vehicle Down Payment according to AAA
	const downPayment = 0.10;

	// Interest Rate according to AAA
	const intRate = 0.06;
	// END Vehicle Expense Constants 	***	***	***	***	***	***	***	***	//



	// START Fuel Average Variables 	***	***	***	***	***	***	***	***	//
	// GETs Gas Average from data.colorado.gov/Energy/Gasoline-Prices-in-Colorado/8pk9-mh2i
	let gasAve = {
		"Y0": 1
	};

	// GETs CNG Average from data.colorado.gov/Energy/Natural-Gas-Prices-in-Colorado/e4ky-6g2n
	let cngAve = {
		"Y0": 1
	};

	// GETs Comercial and Residential Electricity Averages from data.colorado.gov/Business/Electricity-Revenue-in-Colorado/q6sk-tjm9
	let eleComAve = {
		"Y0": 1
	};
	let eleResAve = {
		"Y0": 1
	};

	// E85, LPG, Diesel, B20, B100 Averages from afdc.energy.gov/fuels/prices.html (no GET)
	const e85Ave = {
		2017: 2.68
	};
	const lpgAve = {
		2017: 3.86
	};
	const dieAve = {
		2017: 2.37
	};
	const b20Ave = {
		2017: 2.37
	};
	const b10Ave = {
		2017: 2.37
	};
	// END Fuel Average Variables 	***	***	***	***	***	***	***	***	//



	// console.log(mileageAvg.car);


	// DECLARE INTERFACE VARIABLES & EVENT LISTENERS
	// Default Interface Values
	let vehicleType = "car";
	let depType = "depByYear";
	let aveMileage = 11124;
	let depInt = 5;
	let zipCode = "81328";

	// hideYears() outside of the default Depreciation Interval at outset
	// Hides years outside of Depreciation Interval
	function hideYears() {
		// remove all previous .hide-years classes
		$(".hide-years").removeClass("hide-years");
		// Hide-years greater than depInt
		let x = parseInt(depInt);
		x += 1;
		for (let i = x; i <= 7; i++) {
			$(".year-" + i).addClass("hide-years");
		}
	}
	hideYears();

	// Change Depreciation Options based on depType selection
	$("#depType").change(function () {
		depType = $("#depType").val();
		switch (depType) {
			case "depByYear":
				$("#selectDepInt").removeClass("hide-depBy");
				$("#selectDepMileage").addClass("hide-depBy");
				console.log(`selected ${depType}`);
				break;

			case "depByMile":
				$("#selectDepInt").addClass("hide-depBy");
				$("#selectDepMileage").removeClass("hide-depBy");
				console.log(`selected ${depType}`);
				break;

		}
	});

	// >>>> <<<< >>>> <<<< >>>> <<<< >>>>
	// COLLECT USER DATA AND CALCULATE
	$("#mvp-user-entry").submit(function (event) {
		// Button not submitting data to server at this time
		event.preventDefault();
		
		// Vehicle Type
		vehicleType = $("#vehicleType").val();

		// Depreciation Type
		depType = $("#depType").val();

		// Average Yearly Mileage
		aveMileage = $("#aveMileage").val();

		// Depreciation Interval
		depInt = $("#depInt").val();
		hideYears();

		// Zip Code
		zipCode = $("#zipCode").val();
		// TODO: If (zipCode is in CO (80001–81658)) {use local fuelAvg's} else {use natAvg's}


		// Log Variables so I can see if this works
		console.log(
			`fire! 
			vehicleType = ${vehicleType} 
			depType = ${depType}
			aveMileage = ${aveMileage}
			depInt = ${depInt}
			zipCode = ${zipCode}

		`);

		// remove years beyond depInt	
		hideYears();
		
		// WRITE THE FUEL COSTS
		fuelProjector(gasAve);
	});

	// Change Average Yearly Mileage based on Vehicle Type
	$("#vehicleType").change(function () {
		vehicleType = $("#vehicleType").val();

		function mileageSetter(vehicleType) {
			const mileageAvg = {
				"car": 11244,
				"truck": 11712,
				"suv": 11346,
				"stepVan": 13116,
				"cabChassis": 13116
			};

			console.log(`vehicleType is now ${vehicleType}`);

			switch (vehicleType) {
				case "car":
					$("#aveMileage").val(mileageAvg.car);
					break;

				case "truck":
					$("#aveMileage").val(mileageAvg.truck);
					break;

				case "suv":
					$("#aveMileage").val(mileageAvg.suv);
					break;

				case "van":
					$("#aveMileage").val(mileageAvg.van);
					break;

				case "stepVan":
					$("#aveMileage").val(mileageAvg.stepVan);
					break;

				case "cabChassis":
					$("#aveMileage").val(mileageAvg.cabChassis);
					break;
			}
		}
		mileageSetter(vehicleType);
	});



	// START VEHICLE SELECTION BLOCK 	***	***	***	***	***	***	***	***	//
	// Declare Vehicle Variables
	let convVehicleYear;
	let convVehicleMake;
	let convVehicleModel;
	let convVehicleTrim;
	let convVehiclePrice;
	let convVehicleSub;
	let convVehicleOpt;
	let convVehicleID;
	let convVehicleObj;

	let altVehicleYear;
	let altVehicleMake;
	let altVehicleModel;
	let altVehicleTrim;
	let altVehiclePrice;
	let altVehicleSub;
	let altVehicleOpt;
	let altVehicleID;
	let altVehicleObj;


	// POPULATE #convVehicleYear on $( document ).ready with last 3 Model Years
	function popModelYears(year) {
		let thisModelYear = year + 1;
		for (let i = 0; i < 3; i++) {
			$( "#convVehicleYear").append(`<option value="${thisModelYear}">${thisModelYear}</option>`);
			$( "#altVehicleYear").append(`<option value="${thisModelYear}">${thisModelYear}</option>`);
			thisModelYear--;
		}
	}
	popModelYears(thisYear);



	// POPULATE #xxxVehicleMake on $("#xxxVehicleYear").change
	$("#convVehicleYear").change(function () {
		convVehicleYear = $("#convVehicleYear").val();
		// Clean out the "gen"erated makes, models, and options if user reselects
		$(".convMakes").remove();
		$(".convModels").remove();
		$(".convTrims").remove();
		$(".convSubs").remove();
		$(".convOpts").remove();
		getVehicleMakes("conv", convVehicleYear);
	});

	// POPULATE #altVehicleMake on $("#convVehicleYear").change
	$("#altVehicleYear").change(function () {
		altVehicleYear = $("#altVehicleYear").val();
		// Clean out the "gen"erated makes, models, and options if user reselects
		$(".altMakes").remove();
		$(".altModels").remove();
		$(".altTrims").remove();
		$(".altSubs").remove();
		$(".altOpts").remove();
		getVehicleMakes("alt", altVehicleYear);
	});

	// GET Auto Makes from FuelEco.gov
	function getVehicleMakes(vehicleType, vehicleYear) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://fueleconomy.gov/ws/rest/vehicle/menu/make?year=${vehicleYear}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleMakes(vehicleType, response);
		});

		// Add vehicleMakes (response) to the convVehicleMake select box.
		function listVehicleMakes(vehicleType, jsonObject) {
			$(jsonObject).find("menuItem").each(function () {
				let optionLabel = $(this).find("text").text();
				let optionValue = $(this).find("value").text();
				let idConstructor = "#" + vehicleType + "VehicleMake";
				console.log(idConstructor);
				$(idConstructor).append(`<option class="${vehicleType}Makes" value="${optionValue}">${optionLabel}</option>`);
			});
		}
	}



	// POPULATE #convVehicleModel on $("#convVehicleMake").change
	$("#convVehicleMake").change(function () {
		convVehicleMake = $("#convVehicleMake").val();
		// Clean out the "gen"erated models, and options if user reselects
		$(".convModels").remove();
		$(".convTrims").remove();
		$(".convSubs").remove();
		$(".convOpts").remove();
		getVehicleModels("conv", convVehicleYear, convVehicleMake);
		getVehicleSubs("conv", convVehicleYear, convVehicleMake);
	});

	$("#altVehicleMake").change(function () {
		altVehicleMake = $("#altVehicleMake").val();
		// Clean out the "gen"erated models, and options if user reselects
		$(".altModels").remove();
		$(".altTrims").remove();
		$(".altSubs").remove();
		$(".altOpts").remove();
		getVehicleModels("alt", altVehicleYear, altVehicleMake);
		getVehicleSubs("alt", altVehicleYear, altVehicleMake);
	});

	function getVehicleModels(vehicleType, vehicleYear, vehicleMake) {
		let modelsList;
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://marketcheck-prod.apigee.net/v1/search?api_key=bOUACYFEKJl0q7ILy4ptegjyM4a9vDU5&seller_type=dealer&car_type=new&start=0&rows=0&year=${vehicleYear}&make=${vehicleMake}&facets=model`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			modelsList = response.facets.model;
			listVehicleModels(vehicleType);
		});

		// Add models (response) to the convVehicleMake select box.
		function listVehicleModels(vehicleType, jsonObject) {
			modelsList.forEach(function (jsonObject) {
				let {item: optionLabel} = jsonObject;
				let idConstructor = "#" + vehicleType + "VehicleModel";
				console.log(idConstructor);
				$(idConstructor).append(`<option class="${vehicleType}Models" value="${optionLabel}">${optionLabel}</option>`);
			});
		}
	}


	// POPULATE #xxxVehicleOptions on $("#xxxVehicleModel").change
	$("#convVehicleModel").change(function () {
		convVehicleModel = $("#convVehicleModel").val();
		// Clean out the "gen"erated options if user reselects
		$(".convTrims").remove();
		getVehicleTrims("conv", convVehicleYear, convVehicleMake, convVehicleModel);
	});

	$("#altVehicleModel").change(function () {
		altVehicleModel = $("#altVehicleModel").val();
		// Clean out the "gen"erated options if user reselects
		$(".altTrims").remove();
		getVehicleTrims("alt", altVehicleYear, altVehicleMake, altVehicleModel);
	});

	// GET MarketCheck Trims to populate #convVehicleTrim
	function getVehicleTrims(vehicleType, vehicleYear, vehicleMake, vehicleModel) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://marketcheck-prod.apigee.net/v1/search?api_key=bOUACYFEKJl0q7ILy4ptegjyM4a9vDU5&start=0&rows=0&year=${vehicleYear}&make=${vehicleMake}&model=${vehicleModel}&facets=trim`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleTrims(vehicleType, response);
		});

		// Add makes (response) to the convVehicleMake select box.
		function listVehicleTrims(vehicleType, jsonObject) {
			let trimList = jsonObject.facets.trim;
			trimList.forEach(function (element) {
				let {item: optionLabel} = element;
				let idConstructor = "#" + vehicleType + "VehicleTrim";
				console.log(idConstructor);
				$(idConstructor).append(`<option class="${vehicleType}Trims" value="${optionLabel}">${optionLabel}</option>`);
			});
		}
	}


	// GET MarketCheck Price for Purchase Average Price cell.
	$("#convVehicleTrim").change(function () {
		convVehicleTrim = $("#convVehicleTrim").val();
		getVehiclePrice("conv", convVehicleYear, convVehicleMake, convVehicleModel, convVehicleTrim);
	});

	$("#altVehicleTrim").change(function () {
		altVehicleTrim = $("#altVehicleTrim").val();
		getVehiclePrice("alt", altVehicleYear, altVehicleMake, altVehicleModel, altVehicleTrim);
	});

	function getVehiclePrice(vehicleType, vehicleYear, vehicleMake, vehicleModel, vehicleTrim) {
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://marketcheck-prod.apigee.net/v1/search?api_key=bOUACYFEKJl0q7ILy4ptegjyM4a9vDU5%20&car_type=new&start=1&rows=0&year=${vehicleYear}&make=${vehicleMake}&model=${vehicleModel}&trim=${vehicleTrim}&stats=price`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehiclePrice(vehicleType, response);
		});

		function listVehiclePrice(vehicleType, jsonObject) {
			switch (vehicleType) {
				case "conv":
					convVehiclePrice = jsonObject.stats.price.median;
					$("#convVehiclePrice").text(convVehiclePrice);
					console.log(convVehiclePrice);
					break;

				case "alt":
					altVehiclePrice = jsonObject.stats.price.median;
					$("#altVehiclePrice").text(altVehiclePrice);
					break;
			}
			logPrices();
		}
		
		function logPrices(){
			console.log(`convVehiclePrice is ${convVehiclePrice}`);
			console.log(`altVehiclePrice is ${altVehiclePrice}`);
		}

	}



	// GET FuelEconomy.gov SubModels to populate #xxxVehicleSub.

	// Function called when $("#xxxVehicleMake").change
	function getVehicleSubs(vehicleType, vehicleYear, vehicleMake) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${vehicleYear}&make=${vehicleMake}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleSubs(vehicleType, response);
		});

		// Add vehicle sub models (response) to the convVehicleMake select box.
		function listVehicleSubs(vehicleType, jsonObject) {
			//$(".genOpts").remove();
			$(jsonObject).find("menuItem").each(function () {
				let optionLabel = $(this).find("text").text();
				let optionValue = $(this).find("value").text();
				let idConstructor = "#" + vehicleType + "VehicleSub";
				console.log(idConstructor);
				$(idConstructor).append(`<option class="${vehicleType}Subs" value="${optionValue}">${optionLabel}</option>`);
			});
		}
	}


	// GET FuelEconomy.gov vehicleOpts to populate #xxxVehicleOpts.
	$("#convVehicleSub").change(function () {
		convVehicleSub = $("#convVehicleSub").val();
		// Clean out the "gen"erated makes, models, and options if user reselects
		$(".convOpts").remove();
		getVehicleOpts("conv", convVehicleYear, convVehicleMake, convVehicleSub);
	});

	$("#altVehicleSub").change(function () {
		altVehicleSub = $("#altVehicleSub").val();
		// Clean out the "gen"erated makes, models, and options if user reselects
		$(".altOpts").remove();
		getVehicleOpts("alt", altVehicleYear, altVehicleMake, altVehicleSub);
	});

	function getVehicleOpts(vehicleType, vehicleYear, vehicleMake, vehicleSub) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${vehicleYear}&make=${vehicleMake}&model=${vehicleSub}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleOpts(vehicleType, response);
		});

		// Add vehicle sub models (response) to the convVehicleMake select box.
		function listVehicleOpts(vehicleType, jsonObject) {
			$(jsonObject).find("menuItem").each(function () {
				let optionLabel = $(this).find("text").text();
				let optionValue = $(this).find("value").text();
				let idConstructor = "#" + vehicleType + "VehicleOpt";
				console.log(idConstructor);
				$(idConstructor).append(`<option class="${vehicleType}Opts" value="${optionValue}">${optionLabel}</option>`);
			});
		}
	}

	// GET FuelEconomy.gov Fuel Economy Figures to populate xxxVehicleObj.
	$("#convVehicleOpt").change(function () {
		convVehicleID = parseInt($("#convVehicleOpt").val());
		console.log('vehicleOpt has changed');
		getVehicleFigs("conv", convVehicleID);
	});

	$("#altVehicleOpt").change(function () {
		altVehicleID = parseInt($("#altVehicleOpt").val());
		console.log('vehicleOpt has changed');
		getVehicleFigs("alt", altVehicleID);
	});

	function getVehicleFigs(vehicleType, vehicleID) {
		console.log(`getVehicleFigs has been called`);
		console.log(vehicleID);

		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://www.fueleconomy.gov/ws/rest/vehicle/${vehicleID}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			console.log(`ajax has run`);
			listVehicleInfo(vehicleType, response);
		});

		// Add vehicle information (response) to the vehicleInfo object?.
		function listVehicleInfo(vehicleType, jsonObject) {
			switch (vehicleType) {
				case "conv":
				console.log(`case conv entered`);
				$(jsonObject).find("vehicle").each(function () {
					convVehicleObj = {
						cityMPG: $(this).find("city08").text(),
						highMPG: $(this).find("highway08").text(),
						combMPG: $(this).find("comb08").text(),
						// TODO: Add cityPercent: $(this).find("cityPercent").text(),
						// TODO: Add highwayPercent: $(this).find("highwayPercent").text(),
						cityPHEV: $(this).find("phevCity").text(),
						highPHEV: $(this).find("phevHwy").text(),
						combPHEV: $(this).find("phevComb").text()
					};
					console.log(`inside convVehicleObj.combMPG is ${convVehicleObj.combMPG}`);
					displayObj();
				});
				break;
					
				case "alt":
				$(jsonObject).find("vehicle").each(function () {
					altVehicleObj = {
						cityMPG: $(this).find("city08").text(),
						highMPG: $(this).find("highway08").text(),
						combMPG: $(this).find("comb08").text(),
						// TODO: Add cityPercent: $(this).find("cityPercent").text(),
						// TODO: Add highwayPercent: $(this).find("highwayPercent").text(),
						cityPHEV: $(this).find("phevCity").text(),
						highPHEV: $(this).find("phevHwy").text(),
						combPHEV: $(this).find("phevComb").text()
					};
					console.log(`inside altVehicleObj.combMPG is ${altVehicleObj.combMPG}`);
					displayObj();
				});
				break;
			}
			function displayObj() {
				console.log(`outside convVehicleObj.combMPG is ${convVehicleObj.combMPG}`);
				console.log(`outside altVehicleObj.combMPG is ${altVehicleObj.combMPG}`);
			}
		}
	}
	// END VEHICLE SELECTION BLOCK 	***	***	***	***	***	***	***	***	//







	// Fuel Grade						( "#fuelGrade" )
	// Leaving this one out of #mvp-user-entry b/c it's not part of that form.
	let fuelGrade;
	$("#fuelGrade").change(function () {
		fuelGrade = $("#fuelGrade").val();
	});

	// Fuel Basis
	let fuelBasis = "manuEco";
	$("#fuelBasis").change(function () {
		fuelBasis = $("#fuelBasis").val();
		// expects manuEco or rangeEco
		console.log(fuelBasis);
	});

	function fuelProjector(aveFuel) {
		// declare fuel escalation constants
		// escalation rates from: afdc.energy.gov/calc/cost_calculator_methodology.html#sources
		const escGas = 0.018;
		const escE85 = 0.016;
		const escCng = 0.003;
		const escLpg = 0.013;
		const escDie = 0.018;
		const escB20 = 0.018;
		const escB10 = 0.018;
		const escEle = -0.003; // electricty has negative escalation rate

		// FUEL / UNIT COMPOUNDER
		function fuelCompounder(aveFuel, escRate) {
			for (let year = 1; year <= depInt; year++) {
				aveFuel = (aveFuel * escRate) + aveFuel;
				console.log(`Predicted year ${year} ${fuelType}/unit average $${aveFuel.toFixed(2)} with escalation rate of ${escRate}`);
			}

			switch (fuelType) {
				case 'gas': // GET
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(gasAve.Y0, escGas);
					break;

				case 'e85':
					console.log("fuel type changed to " + fuelType);
					// write a function to pull in fuelHist[] data and call it here, passing in fuelType
					fuelCompounder(e85Ave["2017"], escE85);
					break;

				case 'cng': // GET
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(cngAve, escCng);
					break;

				case 'lpg':
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(lpgAve["2017"], escLpg);
					break;

				case 'die':
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(dieAve["2017"], escDie);
					break;

				case 'b20':
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(b20Ave["2017"], escB20);
					break;

				case 'b10':
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(b10Ave["2017"], escB10);
					break;

				case 'eleCom': // GET
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(eleComAve, escEle);
					break;

				case 'eleRes': // GET
					console.log("fuel type changed to " + fuelType);
					fuelCompounder(eleResAve, escEle);
					break;
			}
		}
	}


	// Fuel Type
	let fuelType;
	$("#fuelType").change(function () {
		fuelType = $("#fuelType").val();
		fuelProjector(fuelType);
	});



	// TODO: NOW THAT I KNOW WHAT YEAR IT IS, I WANT TO MAKE THE CALLS SPECIFIC TO THE YEAR.

	// JSON GET REQUESTS
	// Currently called right away when page loads
	// Gasoline Prices in Colorado fetch & parse
	function gasCall() {
		$.ajax({
			"async": true,
			"crossDomain": true,
			"method": "GET",
			"url": `https://data.colorado.gov/resource/xyh2-p9cg.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24select=avg(allgradesgasprice)&%24where=date%20between%20'${lastYear}-01-01T12%3A00%3A00'%20and%20'${lastYear}-12-31T11%3A59%3A59'`
		}).done(function (response) {
			let holdThis;
			[{
				"avg_allgradesgasprice": holdThis
			}] = response;
			gasAve.Y0 = holdThis;
			displayAve();
		});

		function displayAve() {
			console.log(`gasAve is ${gasAve.Y0}`);
		}
	}

	function cngCall() {
		let twoYrsAgo = lastYear - 1;
		$.ajax({
			"async": true,
			"crossDomain": true,
			"method": "GET",
			"url": `https://data.colorado.gov/resource/uxyf-4dfg.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24where=date%20between%20'${twoYrsAgo}-12-31T11%3A59%3A59'%20and%20'${lastYear}-12-31T11%3A59%3A59'&%24select=avg(commercialprice)`
		}).done(function (response) {
			[{
				"avg_commercialprice": cngAve
			}] = response;
			displayAve();
		});

		function displayAve() {
			console.log(`cngAve is ${cngAve}`);
		}
	}

	function eleCall() {
		$.ajax({
			"async": true,
			"crossDomain": true,
			"method": "GET",
			"url": `https://data.colorado.gov/resource/tvek-dibi.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&state=CO&year=${lastYear}&%24select=avg(commercialprice)%2C%20avg(residentialprice)`
		}).done(function (response) {
			[{
				"avg_commercialprice": eleComAve,
				"avg_residentialprice": eleResAve
			}] = response;
			displayAve();
		});

		function displayAve() {
			console.log(`eleComAve is ${eleComAve}, eleResAve is ${eleResAve}`);


		}
	}

	gasCall();
	cngCall();
	eleCall();



	// FUEL / UNIT PROJECTOR
	// simpleFuelCompound() projects fuelPrice / unit (gal, lb, etc) based on last year average and escalation rates
	function simpleFuelCompound(aveFuel, escRate) {
		for (let year = 1; year <= depInt; year++) {

			// take this years average for CO, multiply by escRate, add to ave, return sum.
			aveFuel = (aveFuel * escRate) + aveFuel;
			console.log(`Predicted year ${year} ${fuelType}/unit average $${aveFuel.toFixed(2)} with escalation rate of ${escRate}`);
		}
	}


	// Vehicle Operating Costs Estimate TODos

	// TODO: Fuel Cost 		=	projected fuelAve's * (fuelEco / manufacturer Estimate)
	// TODO: Depreciation 	= 	depRate
	// TODO: Insturance, Maintanance, registration	=	insMaint from AAA
	// TODO: Where does Financing and Interest come from
	// TODO: Let user remove financing and interest


	// Vehicle Purchase Costs TODOs

	// TODO: Where does MSRP come from
	// TODO: Where does Tax and Licensing come from
	// TODO: Where does Dealer Fees come from
	// TODO: Where does Tax Rebates come from
	// TODO: Where does Incentives come from


	// Remove Average Fuel Prices and incorporate into Vehicle Op Costs


	// Estimated Total Vehicle Costs TODOs

	// TODO: Where does Vehicle Purchase Cost come from
	// TODO: Where does Yn Operating Cost come from


	// Customized Range Analysis TODOs

	// TODO: Build Wireframe in HTML
	// TODO: What figures go here?

	// TODO: Where does XXX come from
	// TODO: Where does XXX come from
	// TODO: Where does XXX come from
	// TODO: Where does XXX come from
	// TODO: Where does XXX come from
	// TODO: Where does XXX come from
	// TODO: Where does XXX come from
	// TODO: Where does XXX come from









	// all code before this
});
