"use strict";
const getDropDown = document.getElementById("usCities");
const cities = [
    {
        name: "Chicago, IL",
        latitude: 41.783229,
        longitude: -87.696268
    },
    {
        name: "Honolulu, HI",
        latitude: 21.359780,
        longitude: -157.880260
    }, 
    {
        name: "San Diego, CA",
        latitude: 32.954965,
        longitude: -117.165820
    },
    {
        name: "Nashville, TN",
        latitude: 36.208422,
        longitude: -86.746901
    },
    {
        name: "New York City, NY",
        latitude: 40.633632,
        longitude: -73.971566
    },
    {
        name: "Boston, MA",
        latitude: 42.308391,
        longitude: -71.098984
    },
    {
        name: "San Francisco, CA",
        latitude: 37.757617,
        longitude: -122.436922
    },
    {
        name: "New Orleans, LA",
        latitude: 30.026219,
        longitude: -90.059736
    },
    {
        name: "Washington D.C, D.C.",
        latitude: 38.938297,
        longitude: -77.040701
    },
    {
        name: "Seattle, WA",
        latitude: 47.699639,
        longitude: -122.373678
    },
];
window.onload = function() {
    loadDropdown();
    getDropDown.onchange = returnForecastData; 
}
function loadDropdown(){
    for(let x of cities){
        //the second argument of creating the option is just the city excluding the state and comma
        let option = new Option(x.name, x.name.substring(0, x.name.indexOf(",")));
        getDropDown.appendChild(option);
    }
}
function returnForecastData(){
    const tableBody = document.getElementById("displayWeatherData");
    const tableRows = document.querySelectorAll("tbody tr");
    Array.from(tableRows).forEach(row => tableBody.removeChild(row));
    const stateSelected = getDropDown.value;
    //find the object in the cities array that matches the dropdown selected value by the name property
    const stateObject = cities.find(x => x.name.substring(0, x.name.indexOf(",")) === stateSelected);
    const coordinatesLookUpURL = `https://api.weather.gov/points/${stateObject.latitude},${stateObject.longitude}`;     //build the station lookup URL
    // console.log("Build block: " + coordinatesLookUpURL);
    fetch(coordinatesLookUpURL)                 //send the request
    .then(responsive => responsive.json())      //resolve the promise to a response(hence the argument name), convert the JSON in the response to another promise that resolves to a JS object(hence a second then())
    .then(data => {
        const forecastURL = data.properties.forecast; 
        getWeather(forecastURL);  
    });
  

}
//use a second fetch within the first(?) to get back weather data from the forecast url  found in the first fetch()
function getWeather(forecast){
   fetch(forecast).then(response => response.json()).then(data => {
    const forecastPeriodsArray = data.properties.periods;
    displayWeather(forecastPeriodsArray);
   });
}
//using the second fetch() helped us find the array that contains the weather data and now we can display each element(representing a part of the day(ex noon) of multiple days)
function displayWeather(array){
    const tableBody = document.getElementById("displayWeatherData");
    //looping through each element which all are objects
    for(let x of array){
        let row = tableBody.insertRow(-1); 
        //loop through each of the properties of the object
        for(let y in x){
            //only if the ACTUAL property(not its value) is one of the specified ones, include its value, otherwise leave it
            switch(y){
                case "name":
                    let cell1 = row.insertCell(0);
                    cell1.innerHTML = x.name;
                    break; 
                case "temperature":
                    let cell2 = row.insertCell(1);
                    cell2.innerHTML = x.temperature;
                    break;
                case "windSpeed": 
                    let cell3 = row.insertCell(2);
                    cell3.innerHTML = `${x.windDirection} ${x.windSpeed}`;
                    break;
                case "shortForecast":
                    let cell4 = row.insertCell(-1);
                    cell4.innerHTML = x.shortForecast;
                    break;
            }
        }
    }
}