// Get all users
var url  = "http://localhost:8080/api/v1/users";
var xhr  = new XMLHttpRequest()
xhr.open('GET', url, true)
xhr.onload = function () {
	var users = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "200") {
		console.table(users);
	} else {
		console.error(users);
	}
}
xhr.send(null);


// Get a user
var url  = "http://localhost:8080/api/v1/users";
var xhr  = new XMLHttpRequest()
xhr.open('GET', url+'/1', true)
xhr.onload = function () {
	var users = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "200") {
		console.table(users);
	} else {
		console.error(users);
	}
}
xhr.send(null);


// Post a user
var url = "http://localhost:8080/api/v1/users";

var data = {};
data.firstname = "John";
data.lastname  = "Snow";
var json = JSON.stringify(data);

var xhr = new XMLHttpRequest();
xhr.open("POST", url, true);
xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
xhr.onload = function () {
	var users = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "201") {
		console.table(users);
	} else {
		console.error(users);
	}
}
xhr.send(json);


// Update a user
var url = "http://localhost:8080/api/v1/users";

var data = {};
data.firstname = "John2";
data.lastname  = "Snow2";
var json = JSON.stringify(data);

var xhr = new XMLHttpRequest();
xhr.open("PUT", url+'/12', true);
xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
xhr.onload = function () {
	var users = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "200") {
		console.table(users);
	} else {
		console.error(users);
	}
}
xhr.send(json);


// Delete a user
var url = "http://localhost:8080/api/v1/users";
var xhr = new XMLHttpRequest();
xhr.open("DELETE", url+'/12', true);
xhr.onload = function () {
	var users = JSON.parse(xhr.responseText);
	if (xhr.readyState == 4 && xhr.status == "200") {
		console.table(users);
	} else {
		console.error(users);
	}
}
xhr.send(null);


// update a pet
function putJsonResource(pet) {
	var petJson = JSON.stringify(pet);
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", URL, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function () {
		var pets = JSON.parse(xhr.responseText);
		if (xhr.readyState === DONE && xhr.status === OK) {
			console.log(pets);
		} else {
			console.or(pets);
		}
	}
	xhr.onerror = function (err) {
		console.log("HTTP Request Status:" + xhr.status + "---" + err.message);
	};
	xhr.send(pet);
}

// delete a user
function deleteJsonResource ( pet ) {
	var xhr = new XMLHttpRequest();
	xhr.open("DELETE", url + '/12', true);
	xhr.onload = function () {
		var pets = JSON.parse(xhr.responseText);
		if (xhr.readyState === DONE && xhr.status === OK) {
			console.log(pets);
		} else {
			console.error(pets);
		}
	}
	xhr.onerror = function (err) {
		console.log("HTTP Request Status:" + xhr.status + "---" + err.message);
	};
	xhr.send(null);
}
