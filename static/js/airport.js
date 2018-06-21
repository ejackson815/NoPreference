// Store our API endpoint for Earthquakes and Tectonic Plates
var airports = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/united-states-international-airports.geojson"

var flightroutes = "http://datasets.flowingdata.com/tuts/maparcs/flights.csv"

// Perform a GET request to the query URL
d3.json(airports, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(airportData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var airport = L.geoJson(airportData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.code + "<br> Airport: " + feature.properties.name +
      "</h3><hr><p>" + feature.geometry.coordinates + "</p>");
    }
    });


  // Sending our earthquakes layer to the createMap function
  createMap(airport);
}

function createMap(airport) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satelliteMap,
    "Light Map": lightMap
  };

  var allCarriers = new L.LayerGroup()
  var Delta = new L.LayerGroup()
  var American = new L.LayerGroup()
  var United = new L.LayerGroup()
  var Southwest = new L.LayerGroup()
  var JFK = new L.LayerGroup()
  var ORD = new L.LayerGroup()
  var LAX = new L.LayerGroup()
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "International Airports": airport,
    "All Routes": allCarriers,
    "American Airlines Routes": American,
    "Delta Airlines Routes" : Delta,
    "Southwest Airlines Routes" : Southwest,
    "United Airlines Routes" : United,
    "JFK": JFK,
    "LAX" : LAX,
    "ORD" : ORD
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, airport]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



