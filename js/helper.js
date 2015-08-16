/* 
    This helper code is reused from the resume project
    The google Maps API will be accessed here.
    Original code uses JQuery and has been updated to KnockoutJS

*/

var googleMap = '<div id="map"></div>';
var mapMarkers = [];  // Track the map markers


/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
// var map;    // declares a global map variable


/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap(viewModel) {

  console.log("Initilizing Map");

  var self = this;
  var locations;

  var mapOptions = {
    disableDefaultUI: false
  };


  map = new google.maps.Map(document.querySelector('#map-div'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder(locationList) {

    // initializes an empty array
    var locations = [];

    // Clear any existing map markers
    for (var i = 0; i < mapMarkers.length; i++) {
      mapMarkers[i].setMap(null);
    }    

    console.log("locationList: ", locationList);

    for (var place in locationList) {
      // console.log("place is: ", place);
      // console.log("place address: " + locationList[place].name() + ", " + locationList[place].address());
      locations.push(locationList[place].name() + " near " + locationList[place].address());
    }

    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.name;   // name of the place from the place service
    var address = placeData.formatted_address;
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    toggleBounce(marker);
    mapMarkers.push(marker);

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      // TAN: Added some VERY basic HTML to format the name
      content: "<h3>" + name + "</h3>" 
            + address + "<br>"
            + (placeData.rating != undefined ? "Rating: " + placeData.rating + "<br>" : "")
            + (placeData.price_level != undefined ? "Price Level: " + placeData.price_level + "<br>" : "")
            + "<img src='" + placeData.icon + "' width='20px' height='auto' <br>"
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
      // TAN: Code added
      infoWindow.open(map, marker);
      toggleBounce(marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
      console.log("Created map marker: ", results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {

      // the search request object
      var request = {
        query: locations[place]
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder(viewModel.placeList() );

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
// window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});