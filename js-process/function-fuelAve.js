// JavaScript Document



// Start only after DOM is ready, using prefered syntax: $(handler)
$(function() {



// DECLARE GLOBAL CONSTANTS
// escalation rates from: afdc.energy.gov/calc/cost_calculator_methodology.html#sources
const escGas = 0.018; // Should I actually scope escalation rate / year constants locally?
const escE85 = 0.016;
const escCng = 0.003;
const escLpg = 0.013;
const escDie = 0.018;
const escB20 = 0.018;
const escB10 = 0.018;
const escEle = -0.003; // electricty has negative escalation rate



// DECLARE GLOBAL VARIABLES (with let, not var)
// Declare Depreciation Interval globally
let depInt; // will pull from dropdown / user entry
let fuelType;
let fuelTotal = 0;



// CREATE EVENT LISTENERS
// Depreciation Interval (#depInt) event listener
$("#depInt").change(function(){
	depInt = $("#depInt").val();
});

// Fuel Type (#fuelType) event listener
$("#fuelType").change(function(){
	fuelType = $("#fuelType").val();
});



// FUEL HISTORY ARRAYS
// LAST 52 weekly values of each
// test variables to be replaced by data call
let gasHist = []; 
let e85Hist = [1,1,1];
let cngHist = [2,2,2];
let lpgHist = [1.5,1.8,2.1];
let dieHist = [4,4,4];
let b20Hist = [5,5,5];
let b10Hist = [6,6,6];
let eleHist = [7,7,7];



// JSON GET REQUESTS
// Currently called right away when page loads
// Gasoline Prices in Colorado fetch & parse
let gasCall = {
  "async": false,
  "crossDomain": true,
  "url": "https://data.colorado.gov/resource/xyh2-p9cg.json?$$app_token=gNqVzSHJ7pWovzVu8pRHdiMHe&%24order=date%20DESC&$limit=52&$select=allgradesgasprice",
  "method": "GET",
  "headers": {
    "content-type": "application/json"
  }
}
// Load gasCall into gasHist[]
$.ajax(gasCall).done(function (response) {
	for (let {"allgradesgasprice":weeklyPrice} of response) {
  	gasHist.push(parseFloat(weeklyPrice));
  } 
});



// FUEL PRICE AVERAGE OVER LAST YEAR IN CO
// Ref: MDN Array.prototype.reduce()
// Udacity course showed a better way to average an array?
function fuelAve(fuelHist){
  let reducer = (accumulator, currentValue) => accumulator + currentValue;
  let aveFuel = fuelHist.reduce(reducer)/fuelHist.length;
  // console.log now uses template literal (${variableName}) with backticks instead of quotes
  console.log(`last year's average fuel cost was ${aveFuel.toFixed(2)}`);
  return aveFuel;
  }
  
  
  
// CALL fuelAve() passing in each fuel history array
let gasAve = fuelAve(gasHist);
let e85Ave = fuelAve(e85Hist);
let cngAve = fuelAve(cngHist);
let lpgAve = fuelAve(lpgHist);
let dieAve = fuelAve(dieHist);
let b20Ave = fuelAve(b20Hist);
let b10Ave = fuelAve(b10Hist);
let eleAve = fuelAve(eleHist);
// End fuel price average



// SIMPLE FUEL / UNIT PROJECTOR
// simpleFuelCompound() projects fuelPrice / unit (gal, lb, etc) based on last year average and escalation rates
function simpleFuelCompound (aveFuel, escRate){
	console.log(`last years fuelAve is ${aveFuel.toFixed(2)} and escRate is ${escRate}`)
	for (let year = 1; year <= depInt; year++) {
		
    // take this years average for CO, multiply by escRate, add to ave, return sum.
		aveFuel = (aveFuel * escRate) + aveFuel    
    console.log(`Predicted year ${year} ${fuelType}/unit average $${aveFuel.toFixed(2)} with escalation rate of ${escRate}`);
	}
}






// Add even listener for fuelGrade


$("select").change(function() {
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





// all code before this
});