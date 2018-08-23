$(document).ready(function () {
    const BASE_URL = 'https://api.myjson.com/bins';
    const PUT_URL = BASE_URL + '/xw264';
    const GET_URL = BASE_URL + '/xw264';
    const URL = 'https://api.myjson.com/bins/u88ss';
    // const URL_MISC = 'https://api.myjson.com/bins/uw5ws';
    const URL_MISC = 'https://api.myjson.com/bins/1av17c';
    const SUCCESS = 'success'; //statusText
    const OK = 200;
    const DONE = 4;
    const UNSENT = 0;
    const GET = 'GET';
    const POST = 'POST';
    const PUT = 'PUT';
    const ZERO = 0;
    const COMPLETE = 'complete';
    const EMPTY_STR = '';

    // var worldRegions = {};
    // var brns = [
    //     {
    //         region: 'Oceania',
    //         country: 'Australia',
    //         state: 'New South Wales',
    //         city: 'Sydney',
    //         branch: {
    //             name: 'The NSW Branch In Sydney',
    //             contact: '+61 44 433 5643',
    //             offchrs: '8:00AM - 5:00PM'
    //         },
    //         coords: {
    //             lat: -33.866754,
    //             lng: 151.21278400000006
    //         }
    //     },
    //     {
    //         region: 'Europe',
    //         country: 'Scotland',
    //         state: 'Glasgow',
    //         city: 'Glasgow City',
    //         branch: {
    //             name: 'The Hamilton Branch',
    //             contact: '+44 1041 400 0433',
    //             offchrs: '8:00AM - 5:00PM'
    //         },
    //         coords: {
    //             lat: 55.8405235,
    //             lng: -4.222571099999982
    //         }
    //     }
    // ];

    function simpleGetRequestFromMyJson() {
        $.ajax({
            url: GET_URL,
            type: GET,
            async: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseText, statusText, xmlHttpRequest) {
                var get_response_text = JSON.stringify(responseText);
                console.log(get_response_text);
            }
        });
    }

    function simplePostRequestToMyJson(pets) {
        var data = JSON.stringify(pets);
        $.ajax({
            url: BASE_URL,
            type: POST,
            data: data,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseText, statusText, xmlHttpRequest) {
                var uri_post_response = JSON.stringify(responseText);
                console.log(uri_post_response);
            }
        });
    }

    function simplePutRequestToMyJson(pets) {
        var update_pets = JSON.stringify(pets);
        $.ajax({
            url: PUT_URL,
            type: PUT,
            data: update_pets,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseText, statusText, xmlHttpRequest) {
                var put_response_text = JSON.stringify(responseText);
                console.log(put_response_text);
            }
        });
    }

    //query all branches
    function getRequestFromJSON() {
        $.ajax({
            url: URL,
            type: GET,
            async: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseText, statusText, xmlHttpRequest) {
                if(SUCCESS === statusText && OK === xmlHttpRequest.status) {
                    worldRegions = responseText;
                    console.log(worldRegions);
                    console.log(xmlHttpRequest);
                    // putRequestToJSON(brns);
                } else {
                    console.log(`Error: ${statusText}`);
                    console.log(xmlHttpRequest);
                }
            }
        });
    }

    function putRequestToJSON(branches) {
        pushBranchToList(branches);
        var stringifiedRegions = JSON.stringify(worldRegions);
        $.ajax({
            url: URL,
            type: PUT,
            data: stringifiedRegions,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseText, statusText, xmlHttpRequest) {
                if (SUCCESS === statusText && OK === xmlHttpRequest.status) {
                    worldRegions = responseText;
                    console.log(responseText);
                    console.log(xmlHttpRequest);
                } else {
                    console.log(`Error: ${statusText}`);
                    console.log(xmlHttpRequest);
                }
            }
        });
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

    // var list_of_pets = {
    //     'pets': [
    //         {
    //             'type': 'dog', 'name': 'Queen', 'age': 9,
    //             'desc': [{'color': 'brown'}, {'gender': 'female'}, {'build': 'medium'}]
    //         },
    //         {
    //             'type': 'dog', 'name': 'Prince', 'age': 6,
    //             'desc': [{'color': 'black'}, {'gender': 'male'}, {'build': 'large'}]
    //         },
    //         {
    //             'type': 'cat', 'name': 'George', 'age': 4,
    //             'desc': [{'color': 'orange'}, {'gender': 'male'}, {'build': 'medium'}]
    //         } ]};

    // var rabbit = {
    //     'type': 'rabbit', 'name': 'Holly', 'age': 2,
    //     'desc': [{'color': 'white'}, {'gender': 'female'}, {'build': 'small'}]
    // };

    // var my_pets_list = list_of_pets.pets.push(rabbit);
    // console.log(my_pets_list);
    // console.log(list_of_pets);

    // getRequestFromJSON();
    // putRequestToJSON(brns);

    // list_of_pets.pets.push(rabbit);
    // console.log(list_of_pets);
    // simplePutRequestToMyJson(list_of_pets);
    // simplePostRequestToMyJson(list_of_pets);
    // simpleGetRequestFromMyJson();

    const NEU_URL = 'https://api.myjson.com/bins/19m65o';
    const NEU_POST_URL = 'https://api.myjson.com/bins';

    function getRequestUsingFetchAndPromise() {
        fetch(NEU_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                mode: 'cors',
                cache: 'default'
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

    function postRequestUsingFetchAndPromise(pet) {
        fetch(NEU_POST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(pet),
                mode: 'cors',
                cache: 'default'
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

    function putRequestUsingFetchAndPromise(pets) {
        fetch(NEU_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Access-Control-Request-Headers': '*',
                    // 'Access-Control-Allow-Methods': '*',
                    // 'Access-Control-Allow-Headers': '*',
                    // 'Access-Control-Allow-Origin': '*'
                },
                // mode: 'cors',
                body: JSON.stringify(pets),
                // cache: 'default'
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }


    const regionSelector = document.querySelector('#select-region');
    const countrySelector = document.querySelector('#select-country');

    var objContinents = new Array();
    var selectContinents = new Array();
    var countriesInAsia = new Array();

    function getRequestRegionsUsingFetchAndPromises() {
        fetch(URL_MISC, {
                method: GET,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                mode: 'cors',
                cache: 'default'
            })
            .then(response => response.json())
            .then(data => {
                if (data !== undefined) {
                    if (data.regions.length) {
                        for (let rgn of data.regions) {
                            selectContinents.push(rgn.region);
                            objContinents.push(rgn);
                        }
                        console.log(objContinents);
                        console.log(selectContinents);
                        countriesInAsia = objContinents.find(obj => obj.region === 'Asia').countries;
                        console.log(countriesInAsia);
                    }
                } else throw new TypeError();
            })
            .catch(error => console.log(error));
    }

    getRequestRegionsUsingFetchAndPromises();

    var myContinents = ['Africa', 'Asia', 'Caribbean', 'Europe', 'North America', 'Oceania', 'South America'];
    for (let continent of myContinents) {
        var option = document.createElement('OPTION');
        var txt = document.createTextNode(continent);
        option.appendChild(txt);
        option.setAttribute('value', continent);
        console.log(option);
        regionSelector.insertBefore(option, regionSelector.lastChild);
    }

    regionSelector.addEventListener('change', () => {
        var selected = regionSelector.options[regionSelector.selectedIndex].text,
        cntrs = objContinents.find(obj => obj.region === selected).countries;
        regionSelector.options[0].setAttribute('disabled', 'disabled');
        if (countrySelector.hasAttribute('disabled')) {
            countrySelector.removeAttribute('disabled');
        }
        if (ZERO !== countrySelector.options.length) {
            countrySelector.innerHTML = EMPTY_STR;
        }
        for (let cntry of cntrs) {
             var option = document.createElement('OPTION'),
             txt = document.createTextNode(cntry.country);
             option.appendChild(txt);
             option.setAttribute('value', cntry.country);
             countrySelector.insertBefore(option, countrySelector.lastChild);
        }
    });

});
