// JavaScript Document

// Declare Depreciation Interval globally
let depInt = 5; // will pull from dropdown / user entry

// FUEL PRICE AVERAGE OVER LAST YEAR IN CO
// Last 52 allGradesGasPrice values in fuelHist[] and return average

  // this example just last 10 values, and the ave should be 2.63600
  let fuelHist = [2.83, 2.75, 2.73, 2.72, 2.72, 2.60, 2.55, 2.50, 2.48, 2.48];
  // Ref: MDN Array.prototype.reduce()
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let fuelAve = fuelHist.reduce(reducer)/fuelHist.length;
  console.log("last year's average fuel cost was " + fuelAve.toFixed(3));


// fuelCost() algorithm
// fuelCost() estimates the cost of fuel per unit
// should be able to calc gas, electricity, E85, CNG, LPG, and diesel/B20/B100
function fuelCost(depInt, fuelAve) {
	// scope escalation rate / year constants locally
	// escalation rates from: afdc.energy.gov/calc/cost_calculator_methodology.html#sources
	const escGas = 0.018;
	const escE85 = 0.016;
	const escCng = 0.003;
	const escLpg = 0.013;
	const escDie = 0.018;
	const escB20 = 0.018;
	const escB100 = 0.018;

	// electricty has negative escalation rate
	const escEle = -0.003;


	// function to compound fuel constants
	function fuelCompound (depInt){
		for (year = 0; year < depInt; year++;) {
			// year 1: take this years average for CO, multiply by escRate, add to ave, return sum.
			// year 2: take y1, multiple by escRate, add to y1, return sum.
			// repeat until depInt

		}
	}

}
