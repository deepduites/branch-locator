var objContinents;

const OK = 200;
const OPENED = 1;
const DONE = 4;
const SUCCESS = 'success';
const COMPLETE = 'complete';
const GET = 'GET';
const PUT = 'PUT';
const ZERO = 0;

const REGIONS = 'REGIONS';
const COUNTRIES = 'COUNTRIES';
const STATES = 'STATES';
const CITIES = 'CITIES'
const BRANCHES = 'BRANCHES';
const URL = 'https://api.myjson.com/bins/u88ss';
const URL_MISC = "https://api.myjson.com/bins/uw5ws";

function populateList(typeOfList, listArray) {
  var items = '';
  for (let list of listArray) {
    items += '<li>' + list.content + '</li>';
  }
  document.querySelector('#list-header').innerHTML = typeOfList;
  document.querySelector('#list-location').innerHTML = items;
}

function parseRegions(regions) {
  var arrayOfRegions = new Array(0);
  for (let r of regions) {
    arrayOfRegions.push({
      coords: {
        lat: r.countries[0].states[0].cities[0].branches[0].coords.lat,
        lng: r.countries[0].states[0].cities[0].branches[0].coords.lng
      },
      content: r.region
    });
  }
  return arrayOfRegions;
}

function parseCountries(countries) {
  var arrayOfCountries = new Array(0);
  for (let c of countries) {
    arrayOfCountries.push({
      coords: {
        lat: c.states[0].cities[0].branches[0].coords.lat,
        lng: c.states[0].cities[0].branches[0].coords.lng
      },
      content: c.country
    });
  }
  return arrayOfCountries;
}

function parseStates(states) {
  var arrayOfStates = new Array(0);
  for (let s of states) {
    arrayOfStates.push({
      coords: {
        lat: s.cities[0].branches[0].coords.lat,
        lng: s.cities[0].branches[0].coords.lng
      },
      content: s.state
    });
  }
  return arrayOfStates;
}

function parseCities(cities) {
  var arrayOfCities = new Array(0);
  for (let c of cities) {
    arrayOfCities.push({
      coords: {
        lat: c.branches[0].coords.lat,
        lng: c.branches[0].coords.lng
      },
      content: c.city
    });
  }
  return arrayOfCities;
}

function parseBranches(branches) {
  var arrayOfBranches = new Array(0);
  for (let b of branches) {
    arrayOfBranches.push({
      coords: {
        lat: b.coords.lat,
        lng: b.coords.lng
      },
      content: b.branch.name
    });
  }
  return arrayOfBranches;
}

//add branch or branches
function pushBranchToList(branches) {
  for (let brn of branches) {
    var objBranch = {
      branch: brn.branch,
      coords: brn.coords
    };
    var objCity = {
      city: brn.city,
      branches: [objBranch]
    };
    var objState = {
      state: brn.state,
      cities: [objCity]
    };
    var objCountry = {
      country: brn.country,
      states: [objState]
    };
    var objRegion = {
      region: brn.region,
      states: [objState]
    };

    var countries = new Array();
    var states = new Array();
    var cities = new Array();
    var branches = new Array();
    var brnch = null;

    countries = objContinents.find(obj => obj.region == brn.region).countries;
    if (ZERO === countries.length) { // new region, push 'region' object
      objContinents.push(objRegion);
    } else {
      states = countries.find(obj => obj.country == brn.country).states;
      if (ZERO === states.length) { // new country, push 'country' object
        countries.push(objCountry);
      } else {
        cities = states.find(obj => obj.state == brn.state).cities;
        if (ZERO === cities.length) { // new state, push 'state' object
          states.push(objState);
        } else {
          branches = cities.find(obj => obj.city == brn.city).branches;
          if (ZERO === branches.length) { // new city, push 'city' object
            cities.push(objCity);
          } else {
            brnch = branches.find(obj => obj.branch.name == brn.name);
            if (null === brnch) { // new branch, push 'branch' object, else branch has existed
              branches.push(objBranch);
            }
          }
        }
      }
    }
  }
}

function getGeoLocation(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results.length) {
        var latitude = result.geometry.location.lat(); //callback
        var longitude = result.geometry.location.lng(); //callback
      }
    }
  });
}

//can't return a value from a callback
function getReverseGeoLocation(lat, lng) {
  var geocoder = new google.maps.Geocoder();
  var latLng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    'latLng': latLng
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results.length) {
        var list = document.querySelector('#brn_addr');
        if (null !== list) {
          list.innerHTML = `<p class='list-caption'> Address: </p> ${results[0].formatted_address}`;
        }
      }
    }
  });
}

//initialize and display markers on the map
function createMap(markers) {
  var map = new google.maps.Map(document.querySelector('#map-canvas'));
  var bounds = new google.maps.LatLngBounds();
  for (let mrkr of markers) {
    var marker = new google.maps.Marker({
      position: mrkr.coords,
      map: map
    });
    bounds.extend({
      lat: mrkr.coords.lat,
      lng: mrkr.coords.lng
    });
    if (mrkr.content) {
      var infoWindow = new google.maps.InfoWindow({
        content: mrkr.content
      });
      marker.addListener('click', () => infoWindow.open(map, marker));
    }
  }
  map.fitBounds(bounds); // auto-zoom
  map.panToBounds(bounds); //auto-center
  if (1 === markers.length) {
    var header = document.querySelector('#list-header').innerHTML;
    var zoom = 16;
    if (COUNTRIES === header) {
      zoom = 8;
    } else if (STATES === header) {
      zoom = 12;
    } else if (CITIES === header) {
      zoom = 16;
    } else {
      zoom = 18;
    }
    map.setZoom(zoom);
  }
}

function initMap() {
  if (COMPLETE === document.readyState) {
    populateList(REGIONS, parseRegions(objContinents));
    createMap(parseRegions(objContinents));
  }
}

function getRequestFromJSON() {
  $.ajax({
    url: URL,
    type: GET,
    async: true,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (responseText, statusText, xmlHttpRequest) {
      if (SUCCESS === statusText && OK === xmlHttpRequest.status) {
        objContinents = new Array();
        if (responseText.regions.length) {
          for (let region of responseText.regions) {
            objContinents.push(region);
          }
          initMap();
        }
      } else {
        console.log(`Error: ${statusText}`);
        console.log(xmlHttpRequest);
      }
    }
  });
}

function getRequestFromJsonUsingFetch() {
  fetch(URL, {
      method: GET,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      mode: 'cors',
      cache: 'default'
    })
    .then(response => response.json())
    .then(data => {
      if(data !== undefined) {
        objContinents = new Array();
        if (data.regions.length) {
          for (let region of data.regions) {
            objContinents.push(region);
          }
          initMap;
        }
      } else throw new TypeError();
    })
    .catch(error => console.log(error));
}

function putRequestToJSON(branches) {
  pushBranchToList(branches);
  var rawData = {
    regions: objContinents
  };
  var stringifiedRegions = JSON.stringify(rawData);
  $.ajax({
    url: URL,
    type: PUT,
    data: stringifiedRegions,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (responseText, statusText, xmlHttpRequest) {
      if (SUCCESS === statusText && OK === xmlHttpRequest.status) {
        objContinents = new Array();
        if (responseText.regions.length) {
          for (let region of responseText.regions) {
            objContinents.push(region);
          }
          initMap();
        }
      } else {
        console.log(`Error: ${statusText}`);
        console.log(xmlHttpRequest);
      }
    }
  });
}

$(document).ready(() => {
  var breadcrumbs = document.querySelector('#crumbs');
  var trailRegions = document.querySelector('#trail-regions');
  var trailCountries = document.querySelector('#trail-countries');
  var trailStates = document.querySelector('#trail-states');
  var trailCities = document.querySelector('#trail-cities');
  var trailBranches = document.querySelector('#trail-branches');
  var countries = new Array();
  var states = new Array();
  var cities = new Array();
  var branches = new Array();
  var nonGeoLocation = null;

  getRequestFromJsonUsingFetch();

  const selector = document.querySelector('#list-location');
  selector.addEventListener('click', (e) => {
    var currentHeader = document.querySelector('#list-header').innerHTML;
    var selected = e.target.innerHTML;
    if (ZERO !== objContinents.length) {
      if (REGIONS === currentHeader) {
        countries = objContinents.find(obj => obj.region == selected).countries;
        populateList(COUNTRIES, parseCountries(countries));
        createMap(parseCountries(countries));
        nonGeoLocation = selected;
        breadcrumbs.style.visibility = 'visible';
        trailRegions.style.visibility = 'visible';
      } else if (COUNTRIES === currentHeader) {
        states = countries.find(obj => obj.country == selected).states;
        nonGeoLocation = selected + ", " + nonGeoLocation;
        populateList(STATES, parseStates(states));
        createMap(parseStates(states));
        trailCountries.style.visibility = 'visible';
      } else if (STATES === currentHeader) {
        cities = states.find(obj => obj.state == selected).cities;
        nonGeoLocation = selected + ", " + nonGeoLocation;
        populateList(CITIES, parseCities(cities));
        createMap(parseCities(cities));
        trailStates.style.visibility = 'visible';
      } else if (CITIES === currentHeader) {
        branches = cities.find(obj => obj.city == selected).branches;
        nonGeoLocation = selected + ", " + nonGeoLocation;
        populateList(BRANCHES, parseBranches(branches));
        createMap(parseBranches(branches));
        trailCities.style.visibility = 'visible';
      } else if (BRANCHES === currentHeader) {
        trailBranches.style.visibility = 'visible';
        var brn = branches.find(obj => obj.branch.name == selected);
        var branch = brn.branch;
        document.querySelector('#list-header').innerHTML = 'BRANCH DETAILS';
        document.querySelector('#list-location').innerHTML = `
            <li class='list-branch-items'><p class='list-caption'> Name: </p> ${branch.name}</li>
            <li id='brn_addr' class='list-branch-items'><p class='list-caption'> Address: </p> ${nonGeoLocation}</li>
            <li class='list-branch-items'><p class='list-caption'> Contact: </p> ${branch.contact}</li>
            <li class='list-branch-items'><p class='list-caption'> Business Hours: </p> ${branch.offchrs}</li>
        `;
        getReverseGeoLocation(brn.coords.lat, brn.coords.lng);
      } else {
        return; //BRANCH_DETAILS === currHeader, nothing to do here
      }
    }
  });

  const trail = document.querySelector('#crumbs-container');
  trail.addEventListener('click', (e) => {
    var selected = e.target.innerHTML.toUpperCase();
    if ('A' === e.target.tagName) {
      if (REGIONS === selected) {
        populateList(REGIONS, parseRegions(objContinents));
        createMap(parseRegions(objContinents));
        trailBranches.style.visibility = 'collapse';
        trailCities.style.visibility = 'collapse';
        trailStates.style.visibility = 'collapse';
        trailCountries.style.visibility = 'collapse';
        trailRegions.style.visibility = 'collapse';
        breadcrumbs.style.visibility = 'collapse';
      } else if (COUNTRIES === selected) {
        populateList(COUNTRIES, parseCountries(countries));
        createMap(parseCountries(countries));
        trailBranches.style.visibility = 'collapse';
        trailCities.style.visibility = 'collapse';
        trailStates.style.visibility = 'collapse';
        trailCountries.style.visibility = 'collapse';
      } else if (STATES === selected) {
        populateList(STATES, parseStates(states));
        createMap(parseStates(states));
        trailBranches.style.visibility = 'collapse';
        trailCities.style.visibility = 'collapse';
        trailStates.style.visibility = 'collapse';
      } else if (CITIES === selected) {
        populateList(CITIES, parseCities(cities));
        createMap(parseCities(cities));
        trailBranches.style.visibility = 'collapse';
        trailCities.style.visibility = 'collapse';
      } else if (BRANCHES === selected) {
        populateList(BRANCHES, parseBranches(branches));
        createMap(parseBranches(branches));
        trailBranches.style.visibility = 'collapse';
      } else {
        return; //nothing to do here, BRANCH_DETAILS is displayed
      }
    }
  });

});