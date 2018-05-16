// JavaScript Document

// DECLARE GLOBAL CONSTANTS
// escalation rates from: afdc.energy.gov/calc/cost_calculator_methodology.html#sources
const escGas = 0.018; // Should I actually scope escalation rate / year constants locally?
const escE85 = 0.016;
const escCng = 0.003;
const escLpg = 0.013;
const escDie = 0.018;
const escB20 = 0.018;
const escB100 = 0.018;
const escEle = -0.003; // electricty has negative escalation rate


// DECLARE GLOBAL VARIABLES (with let, not var)
// Declare Depreciation Interval globally
let depInt = 5; // will pull from dropdown / user entry
let fuelHist;
let fuelAve;
let reducer;

// FUEL PRICE AVERAGE OVER LAST YEAR IN CO
// Last 52 allGradesGasPrice values in fuelHist[] and return average
  // this example just last 10 values, and the ave should be 2.63600
  fuelHist = [2.83, 2.75, 2.73, 2.72, 2.72, 2.60, 2.55, 2.50, 2.48, 2.48];
  // Ref: MDN Array.prototype.reduce()
  reducer = (accumulator, currentValue) => accumulator + currentValue;
  fuelAve = fuelHist.reduce(reducer)/fuelHist.length;
  console.log("last year's average fuel cost was " + fuelAve.toFixed(3));
// End fuel price average

// SIMPLE FUEL / UNIT PROJECTOR
// simpleFuelCompound() projects fuelPrice / unit (gal, lb, etc) based on last year average and escalation rates
function simpleFuelCompound (depInt, fuelAve){
	for (let year = 1; year <= depInt; year++) {
	// year 1: take this years average for CO, multiply by escRate, add to ave, return sum.
    fuelPrice = (fuelAve * escGas) + fuelAve;
    fuelAve = fuelPrice;
    console.log("Predicted year " + year + " fuel/unit average $" + fuelPrice.toFixed(2));
	}
}

// call simpleFuelCompound()
simpleFuelCompound(depInt, fuelAve);
