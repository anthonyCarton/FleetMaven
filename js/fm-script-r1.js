// JavaScript Document

// Start only after DOM is ready, using prefered syntax: $(handler)
$(function() {
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
	let gasAve = {"Y0":1}; 		// GETs Gas Average from data.colorado.gov/Energy/Gasoline-Prices-in-Colorado/8pk9-mh2i
  let cngAve = {"Y0":1}; 		// GETs CNG Average from data.colorado.gov/Energy/Natural-Gas-Prices-in-Colorado/e4ky-6g2n
  let eleComAve = {"Y0":1};
  let eleResAve = {"Y0":1}; 	// GETs Comercial and Residential Electricity Averages from data.colorado.gov/Business/Electricity-Revenue-in-Colorado/q6sk-tjm9

  // E85, LPG, Diesel, B20, B100 Averages from afdc.energy.gov/fuels/prices.html (no GET)
  let e85Ave = {"Y0": 2.68};
  let lpgAve = {"Y0": 3.86};
  let dieAve = {"Y0": 2.37};
  let b20Ave = {"Y0": 2.37};
  let b10Ave = {"Y0": 2.37};

	
	
	// DECLARE INTERFACE VARIABLES & EVENT LISTENERS
	
	// Vehicle Type				 		( "#vehicleType" )
	let vehicleType;
	$( "#vehicleType" ).change(function () {
		vehicleType = $( "#vehicleType" ).val();
	});
	
	// Depreciation Type				( "#depType" )
	let depType;
	$( "#depType" ).change(function (){
		depType = $( "#depType" ).val();
	});
	
	// Average Yearly Mileage			( "#aveMileage" )	
	let aveMileage;
	$( "#aveMileage" ).change(function (){
		aveMileage = $( "#aveMileage" ).val();
	});
	
	// Depreciation Interval			( "#depInt" )
	let depInt;
	$("#depInt").change(function() {
		depInt = $("#depInt").val();
		// remove all previous .hide-years classes
		$( ".hide-years" ).removeClass( "hide-years" );
		// Hide-years greater than depInt
		let x = parseInt(depInt); 
		x += 1;
		for (let i = x; i <= 7; i++) {
			$( ".year-" + i ).addClass( "hide-years" );
		}
	});
	
	// Zip Code							( "#zipCode" )
	let zipCode;
	$( "#zipCode" ).change(function() {
    	zipCode = $( "#zipCode" ).val();
	});

	// Fuel Grade						( "#fuelGrade" )
	let fuelGrade;
	$("#fuelGrade").change(function() {
		fuelGrade = $("#fuelGrade").val();
	});

	// Fuel Type						( "#fuelType" )
	let fuelType;
	$( "#fuelType" ).change(function() {
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
  });

	
	// WHAT YEAR IS IT?
	let d = new Date();
	let thisYear = d.getFullYear();
	let lastYear = thisYear-1;
	console.log(thisYear);
	console.log(lastYear);

  // NOW THAT I KNOW WHAT YEAR IT IS, I WANT TO MAKE THE CALLS SPECIFIC TO THE YEAR.
	


  // FUEL / UNIT COMPOUNDER
  function fuelCompounder(aveFuel, escRate) {
    for (let year = 1; year <= depInt; year++) {
      aveFuel = (aveFuel * escRate) + aveFuel;
      console.log(`Predicted year ${year} ${fuelType}/unit average $${aveFuel.toFixed(2)} with escalation rate of ${escRate}`);
    }
  }


  // JSON GET REQUESTS
  // Currently called right away when page loads
  // Gasoline Prices in Colorado fetch & parse
  function gasCall() {
    $.ajax({
      "async": true,
      "crossDomain": true,
      "method": "GET",
      "url": "https://data.colorado.gov/resource/xyh2-p9cg.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24select=avg(allgradesgasprice)&%24where=date%20between%20'2017-01-01T12%3A00%3A00'%20and%20'2017-12-31T11%3A59%3A59'"
    }).done(function(response) {
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
    $.ajax({
      "async": true,
      "crossDomain": true,
      "method": "GET",
      "url": "https://data.colorado.gov/resource/uxyf-4dfg.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24where=date%20between%20'2016-12-31T11%3A59%3A59'%20and%20'2017-12-31T11%3A59%3A59'&%24select=avg(commercialprice)"
    }).done(function(response) {
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
      "url": "https://data.colorado.gov/resource/tvek-dibi.json?%24%24app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&state=CO&year=2017&%24select=avg(commercialprice)%2C%20avg(residentialprice)"
    }).done(function(response) {
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

	// TODO: Where does Fuel Cost come from 
	// TODO: Where does Depreciation come from
	// TODO: Where does Maintenance Costs come from
	// TODO: Where does Insurance Estimate come from
	// TODO: Where does Tax and Registration come from
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
