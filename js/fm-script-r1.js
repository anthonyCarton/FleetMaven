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

	// Collect user input
	$("#mvp-user-entry").submit(function (event) {
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

		// Button not submitting data to server at this time
		event.preventDefault();

		// remove years beyond depInt	
		hideYears();

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



	// POPULATE #convVehicleYear on $( document ).ready with last 3 Model Years
	function popModelYears(year) {
		let thisModelYear = year + 1;
		for (let i = 0; i < 3; i++) {
			$("#convVehicleYear").append(`<option value="${thisModelYear}">${thisModelYear}</option>`);
			thisModelYear--;
		}
	}
	popModelYears(thisYear);



	// POPULATE #convVehicleMake on $("#convVehicleYear").change
	$("#convVehicleYear").change(function () {
		convVehicleYear = $("#convVehicleYear").val();
		// Clean out the "gen"erated makes, models, and options if user reselects
		$(".genMakes").remove();
		$(".genModels").remove();
		$(".genTrims").remove();
		$(".genSubs").remove();
		$(".genOpts").remove();
		getVehicleMakes(convVehicleYear);
	});

	// GET Auto Makes from FuelEco.gov
	function getVehicleMakes(vehicleYear) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://fueleconomy.gov/ws/rest/vehicle/menu/make?year=${vehicleYear}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleMakes(response);
		});

		// Add vehicleMakes (response) to the convVehicleMake select box.
		function listVehicleMakes(jsonObject) {
			$(jsonObject).find("menuItem").each(function () {
				let optionLabel = $(this).find("text").text();
				let optionValue = $(this).find("value").text();
				$("#convVehicleMake").append(`<option class="genMakes" value="${optionValue}">${optionLabel}</option>`);
			});
		}
	}



	// POPULATE #convVehicleModel on $("#convVehicleMake").change
	$("#convVehicleMake").change(function () {
		convVehicleMake = $("#convVehicleMake").val();
		// Clean out the "gen"erated models, and options if user reselects
		$(".genModels").remove();
		$(".genTrims").remove();
		$(".genSubs").remove();
		$(".genOpts").remove();
		getVehicleModels(convVehicleYear, convVehicleMake);
		getVehicleSubs(convVehicleYear, convVehicleMake);
	});

	function getVehicleModels(vehicleYear, vehicleMake) {
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
			listVehicleModels();
		});

		// Add models (response) to the convVehicleMake select box.
		function listVehicleModels() {
			modelsList.forEach(function (jsonObject) {
				let {
					item: optionLabel
				} = jsonObject;
				$("#convVehicleModel").append(`<option class="genModels" value="${optionLabel}">${optionLabel}</option>`);
			});
		}
	}


	// POPULATE #convVehicleOptions on $("#convVehicleModel").change
	$("#convVehicleModel").change(function () {
		convVehicleModel = $("#convVehicleModel").val();
		// Clean out the "gen"erated options if user reselects
		$(".genTrims").remove();
		getVehicleTrims(convVehicleYear, convVehicleMake, convVehicleModel);
	});

	// GET MarketCheck Trims to populate #convVehicleTrim
	function getVehicleTrims(vehicleYear, vehicleMake, vehicleModel) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://marketcheck-prod.apigee.net/v1/search?api_key=bOUACYFEKJl0q7ILy4ptegjyM4a9vDU5&start=0&rows=0&year=${vehicleYear}&make=${vehicleMake}&model=${vehicleModel}&facets=trim`,
			"method": "GET",
			"headers": {}
		}

		$.ajax(settings).done(function (response) {
			listVehicleTrims(response);
		});

		// Add makes (response) to the convVehicleMake select box.
		function listVehicleTrims(response) {
			let trimList = response.facets.trim;
			trimList.forEach(function (element) {
				let {
					item: optionLabel
				} = element;
				$("#convVehicleTrim").append(`<option class="genTrims" value="${optionLabel}">${optionLabel}</option>`);
			});
		}
	}


	// GET MarketCheck Price for Purchase Average Price cell.
	$("#convVehicleTrim").change(function () {
		convVehicleTrim = $("#convVehicleTrim").val();
		getVehiclePrice(convVehicleYear, convVehicleMake, convVehicleModel, convVehicleTrim);
	});

	function getVehiclePrice(vehicleYear, vehicleMake, vehicleModel, vehicleTrim) {
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://marketcheck-prod.apigee.net/v1/search?api_key=bOUACYFEKJl0q7ILy4ptegjyM4a9vDU5%20&car_type=new&start=1&rows=0&year=${vehicleYear}&make=${vehicleMake}&model=${vehicleModel}&trim=${vehicleTrim}&stats=price`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehiclePrice(response);
		});

		function listVehiclePrice(jsonObject) {
			convVehiclePrice = jsonObject.stats.price.median;
			$("#convVehiclePrice").text(convVehiclePrice);
		}

	}



	// GET FuelEconomy.gov SubModels to populate #convVehicleSub.

	// Function called when $("#convVehicleMake").change
	function getVehicleSubs(vehicleYear, vehicleMake) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${vehicleYear}&make=${vehicleMake}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleSubs(response);
		});

		// Add vehicle sub models (response) to the convVehicleMake select box.
		function listVehicleSubs(jsonObject) {
			//$(".genOpts").remove();
			$(jsonObject).find("menuItem").each(function () {
				let optionLabel = $(this).find("text").text();
				let optionValue = $(this).find("value").text();
				$("#convVehicleSub").append(`<option class="genSubs" value="${optionValue}">${optionLabel}</option>`);
			});
		}
	}


	// GET FuelEconomy.gov vehicleOpts to populate #convVehicleSub.
	$("#convVehicleSub").change(function () {
		convVehicleSub = $("#convVehicleSub").val();
		// Clean out the "gen"erated makes, models, and options if user reselects
		$(".genOpts").remove();
		getVehicleOpts(convVehicleYear, convVehicleMake, convVehicleSub);
	});

	function getVehicleOpts(vehicleYear, vehicleMake, vehicleSub) {
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${vehicleYear}&make=${vehicleMake}&model=${vehicleSub}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			listVehicleOpts(response);
		});

		// Add vehicle sub models (response) to the convVehicleMake select box.
		function listVehicleOpts(jsonObject) {
			$(jsonObject).find("menuItem").each(function () {
				let optionLabel = $(this).find("text").text();
				let optionValue = $(this).find("value").text();
				$("#convVehicleOpt").append(`<option class="genOpts" value="${optionValue}">${optionLabel}</option>`);
			});
		}
	}

	// GET FuelEconomy.gov Fuel Economy Figures to populate #convVehicleSub.
	$("#convVehicleOpt").change(function () {
		convVehicleOpt = $("#convVehicleOpt").val();
		console.log('vehicleOpt has changed');
		getVehicleInfo(convVehicleOpt);
	});

	function getVehicleInfo(vehicleId) {
		console.log('getVehicleInfo has been called');

		let settings = {
			"async": true,
			"crossDomain": true,
			"url": `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${vehicleId}`,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			console.log(response);
			listVehicleInfo(response);
		});

		// Add vehicle information (response) to the vehicleInfo object?.
		function listVehicleInfo(jsonObject) {
			$(jsonObject).find("yourMpgVehicle").each(function () {
				let vehicleObj = {
					avgMpg: $(this).find("avgMpg").text(),
					cityPercent: $(this).find("cityPercent").text(),
					highwayPercent: $(this).find("highwayPercent").text(),
					maxMpg: $(this).find("maxMpg").text(),
					minMpg: $(this).find("minMpg").text()
				};
				console.log(vehicleObj);
			});
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
