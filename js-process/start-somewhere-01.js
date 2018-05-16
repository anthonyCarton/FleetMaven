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
let depInt = 5; // will pull from dropdown / user entry
let fuelHist;
let fuelAve;
let reducer;
let fuelType;


// FUEL PRICE AVERAGE OVER LAST YEAR IN CO
// Last 52 allGradesGasPrice values in fuelHist[] and return average
  // this example just last 10 values, and the ave should be 2.63600
  fuelHist = [2.83, 2.75, 2.73, 2.72, 2.72, 2.60, 2.55, 2.50, 2.48, 2.48];
  // Ref: MDN Array.prototype.reduce()
  reducer = (accumulator, currentValue) => accumulator + currentValue;
  fuelAve = fuelHist.reduce(reducer)/fuelHist.length;
  console.log("last year's average fuel cost was " + fuelAve.toFixed(2));
// End fuel price average

// SIMPLE FUEL / UNIT PROJECTOR
// simpleFuelCompound() projects fuelPrice / unit (gal, lb, etc) based on last year average and escalation rates
function simpleFuelCompound (depInt, fuelAve, escRate){
	for (let year = 1; year <= depInt; year++) {
	// year 1: take this years average for CO, multiply by escRate, add to ave, return sum.
    fuelPrice = (fuelAve * escRate) + fuelAve;
    fuelAve = fuelPrice;
    console.log("Predicted year " + year + " " + fuelType + "/unit average $" + fuelPrice.toFixed(2) + " with escalation rate of " + escRate);
	}
}

// call simpleFuelCompound()
// simpleFuelCompound(depInt, fuelAve);

// Add event listener for selectbox with options gas, e85, cng
$("select").change(function(){
	fuelType = $("select").val();
});


$("select").change(function() {
	let result;
	switch (fuelType) {
    case 'gas':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escGas);
    console.log(result);
    break;

    case 'e85':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escE85);
    console.log(result);
    break;

    case 'cng':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escCng);
    console.log(result);
    break;

    case 'lpg':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escLpg);
    console.log(result);
    break;

    case 'die':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escDie);
    console.log(result);
    break;

    case 'b20':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escB20);
    console.log(result);
    break;

    case 'b10':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escB10);
    console.log(result);
    break;

    case 'ele':
    // do something
    console.log("fuel type changed to " + fuelType);
    result = simpleFuelCompound(depInt, fuelAve, escEle);
    console.log(result);
    break;

  }
});





// all code before this
});
