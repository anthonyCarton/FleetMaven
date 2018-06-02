## FleetMaven.com
FleetMaven is a company that drives Colorado fleet managers toward improved air quality through better business decisions. Businesses can spend upwards of 200 hours analyzing information for fleet vehicle purchases, Fleet Maven saves them time and money by helping them generate cost-benefit analysis that include alternative fuel vehicles. This cost/benefit analysis includes information like fuel projections based on average fuel prices in Colorado, average prices of recently sold vehicles (rather than MSRPs), and localized range analysis based on the terrain of the area (rather than a national average).

### Getting Started
#### Frameworks and libraries:
##### Unsemantic CSS Framework
The site is structured, responsively at the tablet and desktop levels, using Unsemantic's CSS Framework. The mobile version is not complete, as information is created on desktops and consumed on mobile. 
[Unsemantic CSS Framwork](https://unsemantic.com/demo-responsive)

##### TypeKit
Adobe's TypeKit is used for Typography on the site.
[Adobe Typekit](https://typekit.com/)

##### jQuery
FleetMaven uses jQuery's CDN for DOM manipulation and .ajax()
[jQuery](http://jquery.com/)

##### Carousel
The carousel on the index.shtml page was built based on a tutorial at w3schools
[w3schools](https://www.w3schools.com/)


#### Databases:
FleetMaven uses a variety of databases that return both XML and JSON objects (which is a real pain BTW).
In addition, the use of the Insomnia REST Client was a gamechanger.
[Insomnia](https://insomnia.rest/)


##### FuelEconomy.gov (non-CO)
FleetMaven uses FuelEconomy.gov databases to populate automotive Makes, Models, and Options, as well as getting fuel economy information.

##### MarketCheck.com (non-CO)
FleetMaven.com is currently using MarketCheck.com's vehicle database to reference prices. We are doing this because the database that includes both pricing and eco information (Edmunds) shut down their API this spring.

##### Data.Colorado.Gov (CO)
FleetMaven.com uses databases from data.colorado.gov to reference fuelprices (Gasoline Averages, Compressed Natural Gas Averages, and Electricity Prices) to project fuel prices over the next up to 7 years for cost of ownership information.

[Colorado Gas Prices](https://data.colorado.gov/Energy/Gasoline-Prices-in-Colorado/8pk9-mh2i)
[Electricity Revenue in CO](https://data.colorado.gov/Business/Electricity-Revenue-in-Colorado/q6sk-tjm9)
[Natural Gas Prices in CO](https://data.colorado.gov/Energy/Natural-Gas-Prices-in-Colorado/e4ky-6g2n)
[Alternative Fuels and Electric Vehicle Charging Station Locations in Colorado](https://data.colorado.gov/Energy/Alternative-Fuels-and-Electric-Vehicle-Charging-St/team-3ugz)
[Truck Station Electrification in Colorado 2014](https://data.colorado.gov/Energy/Truck-Station-Electrification-in-Colorado-2014/c8jj-hcxj)

In addition to these, we also used the database Professional and Occupational Licenses in Colorado to estimate our potential market in the state.
[Professional and Occupational Licenses in Colorado](https://data.colorado.gov/Business/Professional-and-Occupational-Licenses-in-Colorado/7s5z-vewr)

We are also referencing Fuel Averages and Mileage Averages from the US Dept. of Energy's Alternative Fuels Data Center. The charging station map is currently a plugin from the AFDC
[Alternative Fuels Data Center](https://www.afdc.energy.gov/)


### Usage:


### Known Bugs


### TODOs

#### Release 2


#### Release 3


#### Future


### License



