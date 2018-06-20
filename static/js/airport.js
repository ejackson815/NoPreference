// Store our API endpoint for Earthquakes and Tectonic Plates
var airports_link = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/united-states-international-airports.geojson"

//var flight = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// Perform a GET request to the query URL
d3.json(airports_link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(airportsData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the Airport location
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.code +
      "<br> Airport:" + feature.properties.name + "<br> Coordinates" + feature.coordinates);
  }

  // Create a GeoJSON layer containing the features array on the airportData object
  // Run the onEachFeature function once for each piece of data in the array
  var airports = new L.geoJSON(airportsData, {
    onEachFeature: onEachFeature
  });



  // Sending our earthquakes layer to the createMap function
  createMap(airports);
}

function createMap(airports) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWphY2tzb244MTUiLCJhIjoiY2ppaDRqZmg2MTIzbzN3bXl6Y3BzOG00NyJ9.dPuM2HrynC2MEMKV75U6tg");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satelliteMap,
    "Outdoor Map": outdoorMap,
    "Light Map": lightMap
  };

  //Add the new routes layer

  //var air_routes = new L.LayerGroup()

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Airports" : airports,
    //"Flight Routes": routes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satelliteMap, airports]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


