# bc-workshop
Community mapping tools and services

## Installation Instructions

Install dependencies
```
bower install
npm install
```

Build using gulp
```
gulp
```

## tiles.js
The bcWorkshop map uses Mapbox tiles. To add your own tiles to the map, create a file called tiles.js with the contents:
```
var tileAddress = 'https://{s}.<tile-server>/{z}/{x}/{y}.png?<parameters>';
```
or just replace the `tileAddress` variable in main.js.
