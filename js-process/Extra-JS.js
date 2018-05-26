// JavaScript Document
$(function () {

'use strict';



// Removed from function-fuelAve.js b/c colleting averages directly from call.

// FUEL PRICE AVERAGE OVER LAST YEAR IN CO
// Ref: MDN Array.prototype.reduce()
// Udacity course showed a better way to average an array?
function fuelAve(fuelHist) {
	let reducer = (accumulator, currentValue) => accumulator + currentValue;
	let aveFuel = fuelHist.reduce(reducer) / fuelHist.length;
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
	
	
	
	
// all code before this
});
