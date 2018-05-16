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
let fuelTotal = 0;
let fuelType;



// FUEL HISTORY VARIABLES
// test variables to be replaced by data call
// Save last 52 allGradesGasPrice values in fuelHist[]
// this example just last 10 values, and the ave should be 2.63600
let gasHist = [2.83, 2.75, 2.73, 2.72, 2.72, 2.60, 2.55, 2.50, 2.48, 2.48];
let e85Hist = [1,1,1];
let cngHist = [2,2,2];
let lpgHist = [3,3,3];
let dieHist = [4,4,4];
let b20Hist = [5,5,5];
let b10Hist = [6,6,6];
let eleHist = [7,7,7];



// FUEL PRICE AVERAGE OVER LAST YEAR IN CO
// Ref: MDN Array.prototype.reduce()
function fuelAve(fuelHist){
  reducer = (accumulator, currentValue) => accumulator + currentValue;
  aveFuel = fuelHist.reduce(reducer)/fuelHist.length;
  console.log("last year's average fuel cost was " + aveFuel);
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

  console.log(gasAve.toFixed(2));
  console.log(e85Ave.toFixed(2));



// SIMPLE FUEL / UNIT PROJECTOR
// simpleFuelCompound() projects fuelPrice / unit (gal, lb, etc) based on last year average and escalation rates
function simpleFuelCompound (aveFuel, escRate){
	console.log("last years fuelAve is " + aveFuel + " and escRate is " + escRate);
	for (let year = 1; year <= depInt; year++) {
		// take this years average for CO, multiply by escRate, add to ave, return sum.
		aveFuel = (aveFuel * escRate) + aveFuel
    console.log("Predicted year " + year + " " + fuelType + "/unit average $" + aveFuel.toFixed(2) + " with escalation rate of " + escRate);
	}
}




// Add event listener for selectbox with options gas, e85, cng
$("select").change(function(){
	fuelType = $("select").val();
});


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
