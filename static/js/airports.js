// Store our API endpoint for Earthquakes and Tectonic Plates
var airports = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/united-states-international-airports.geojson"

var flightroutes = "http://datasets.flowingdata.com/tuts/maparcs/flights.csv"

// storing locations for Hub Airports

var AA_locations = [{
  coordinates:
  [40.7769, -73.8740],
  name: "New York LaGuardia Airport",
  code: "LGA"
  },
  {
  coordinates:
  [40.7128, -74.0059],
  name: "New York John F. Kennedy International Airport",
  code: "JFK"
  },
  {
  coordinates:
  [39.87036, -75.24502],
  name: "Philadelphia International",
  code: "PHL"
  },
  {
  coordinates:
  [38.8512, -77.0402],
  name: "Ronald Reagan Washington National Airport",
  code: "DCA"
  },
  {
  coordinates:
  [35.214075, -80.943091],
  name: "Charlotte Douglas International",
  code: "CLT"
  },
  {
  coordinates:
  [25.7931, -80.29033],
    name: "Miami International Airport",
    code: "MIA"
  },
  {
    coordinates:
    [41.979, -87.9044],
    name: "Chicago O'Hare International Airport",
    code: "ORD"
  },
  {
    coordinates:
    [32.8969, -97.0424],
    name: "Dallas Fort Worth International",
    code: "DFW"
  },
  {
    coordinates:
    [33.4360, -112.0095],
    name: "Pheonix Sky Harbor International",
    code: "PHX"
  },
  {
  coordinates:
    [33.9425, -118.4080],
    name: "Los Angeles International Airport",
    code: "LAX"
  }
];

// Storing United Airline Hub Locations
var UA_locations = [{
  coordinates:
  [37.6190, -122.3748],
  name: "San Francisco International",
  code: "SFO"
},
{
  coordinates:
  [39.858399, -104.66701],
  name: "Denver International",
  code: "DEN"
},
{
  coordinates:
  [29.980476, -95.3397],
  name: "Houston George Bush Intercontinental Airport",
  code: "IAH"
},
{
  coordinates:
  [38.944, -77.4557],
  name: "Washington Dulles International",
  code: "IAD"
},
{
  coordinates:
  [40.6929, -74.1684],
  name: "Newark Liberty International Airport",
  code: "EWR"
},
{
  coordinates:
  [41.979, -87.9044],
  name: "Chicago O'Hare International Airport",
  code: "ORD"
},
{
  coordinates:
  [33.9425, -118.4080],
  name: "Los Angeles International Airport",
  code: "LAX"
}];

//Storing Delta Hub Locations

var DL_locations = [{
  coordinates:
  [42.3643, -71.0051],
  name: "Boston Logan International",
  code: "BOS"
  },
  {
  coordinates:
  [40.7128, -74.0059],
  name: "New York John F. Kennedy International Airport",
  code: "JFK"
  },
  {
  coordinates:
  [40.7769, -73.8740],
  name: "New York LaGuardia Airport",
  code: "LGA"
  },
  {
  coordinates:
  [42.212, -83.348],
  name: "Detroit Metropolitan Airport",
  code: "DTW"
  },
  {
  coordinates:
  [39.0452, -84.6618],
  name: "Cincinnati/Northern Kentucky International Airport",
  code: "CVG"
  },
  {
  coordinates:
  [33.6404, -84.4269],
    name: "Hartsfield-Jackson Atlanta International Airport",
    code: "ATL"
  },
  {
    coordinates:
    [44.884188, -93.215],
    name: "Minneapolis-St. Paul International Airport",
    code: "MSP"
  },
  {
    coordinates:
    [40.7867, -111.9687],
    name: "Salt Lake City International Airport",
    code: "SLC"
  },
  {
    coordinates:
    [47.437, -122.3112],
    name: "Seattle-Tacoma International Airport",
    code: "SEA"
  },
  {
  coordinates:
    [33.9425, -118.4080],
      name: "Los Angeles International Airport",
    code: "LAX"
    }
];

// Define arrays to hold created Hub markers
var AA_hub = [];
var UA_hub = [];
var DL_hub = [];


// Perform a GET request to the query URL
Promise.all([d3.json(airports), $.get('/stats-by-departure-airport')]).then(function(allData) {
  var jsonData = allData[0];
  var flightData = allData[1];
  console.log('arrivals ? -> ', flightData);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(jsonData.features, flightData);
});


function createFeatures(airportData, flightData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var airport = L.geoJson(airportData, {
    onEachFeature: function (feature, layer){
      var airportData = flightData[feature.properties.code];
      layer.bindPopup(`
      <h3> ${feature.properties.code}<br>
      Airport: ${feature.properties.name} </h3><hr>
      <p> ${feature.geoJson.coordinates} <br>
      departures: ${airportData.total_departure} <br>
      cancelled: ${aiportData.total_cancelled} <br>
      arrivals: ${airportData.total_arrival} <br>
      </p>
      `);
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


  var Delta = new L.LayerGroup(DL_hub);
  var American = new L.LayerGroup(AA_hub);
  var United = new L.LayerGroup(UA_hub);

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satelliteMap,
    "Light Map": lightMap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "International Airports": airport,
    "American Airlines Hubs": American,
    "Delta Airlines Hubs" : Delta,
    "United Airlines Hubs" : United,
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, airport, American, Delta, United]
  });

    // Loop through Delta Hub Locations and create makers
  for (var i = 0; i < DL_locations.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
    DL_hub.push(
      L.circle(DL_locations[i].coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "gray",
        fillColor: "gray",
        radius: 20000
      })
      .addTo(Delta)
    );

  }

  // Loop through United Hub Locations and create makers
  for (var i = 0; i < AA_locations.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
    AA_hub.push(
      L.circle(AA_locations[i].coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "red",
        fillColor: "red",
        radius: 20000
      })
      .addTo(American)
    );

  }

  // Loop through American Hub Locations and create makers
  for (var i = 0; i < UA_locations.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
    UA_hub.push(
      L.circle(UA_locations[i].coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "blue",
        fillColor: "blue",
        radius: 20000
      })
      .addTo(United)
    );
  }
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

