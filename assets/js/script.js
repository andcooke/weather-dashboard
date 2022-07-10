//$(document).ready(function() {

let searchBtnEl = document.querySelector("#search-city-btn");
let btnContainerEl = document.querySelector("#created-cities-container");
let userSearch = document.getElementById("input-city");
let currentWeatherContainer = document.querySelector(".current-weather-container")
let userSearchValue;
let geoAPIurl;



const apiKey = "8cf3ec2307733a32bbd3e39236609609";
    

//on load check local storage for cities and make buttons


searchBtnEl.addEventListener("click", function () {
    currentWeatherContainer.textContent = "";
    userSearchValue = userSearch.value;
    if (!userSearchValue) {
        window.alert("Please input a city to receive the weather.")
        // console.log("blank");
    } else {
    localStorage.setItem("test", userSearchValue);
    //console.log(userSearchValue);
    geoAPIurl = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearchValue}&limit=5&appid=${apiKey}`;
    getWeather();
    makeButton();
    }
});



// async function getWeatherNow() {
//     currentWeatherContainer.innerHTML = "";
//     var response = await fetch(geoAPIurl);
//     var data = await response.json();
//     lat = data[0].lat;
//     lon = data[0].lon;

function getWeather() {
    fetch(geoAPIurl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        currentWeatherContainer.setAttribute("style", "display: block");
        lat = data[0].lat;
        lon = data[0].lon;
        getCurrentWeather();
        get5Day();
    })
    .catch(err => console.error(err))
};


function getCurrentWeather () {
    let weatherAPIurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(weatherAPIurl)
    .then(function(response) {
            return response.json();
    })
    .then(function(data){
        //console.log(data);
        //city title
        let cityTitleEl = document.createElement("h2");
        cityTitleEl.textContent = userSearchValue;
        currentWeatherContainer.appendChild(cityTitleEl)
        //icon
        let iconEl = document.createElement("img");
        let currentIcon = data.current.weather[0].icon
        iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
        cityTitleEl.appendChild(iconEl);
        //current Weather
        let currentTemp = document.createElement("p");
        //console.log("temp (in K):", Math.floor(data.current.temp*(9/5)-459.67));
        currentTemp.textContent = "Temp: " + Math.floor(data.current.temp*(9/5)-459.67) + " F";
        currentWeatherContainer.appendChild(currentTemp);
        //console.log("humidity %:", data.current.humidity);
        let currentHumidity = document.createElement("p");
        currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
        currentWeatherContainer.appendChild(currentHumidity);
        //console.log("wind in MPH:", data.current.wind_speed);
        let currentWind = document.createElement("p");
        currentWind.textContent = "Wind: " + data.current.wind_speed + " mph";
        currentWeatherContainer.appendChild(currentWind);
        //console.log("UV index:", data.current.uvi);
        let currentUV = document.createElement("p");
        currentUV.textContent = "UV Index: " + data.current.uvi;
        currentWeatherContainer.appendChild(currentUV);
    })
};

function get5Day () {
    let fiveDayAPIurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(fiveDayAPIurl)
    .then(function(response) {
            return response.json();
    })
    .then(function(data){
        for (let i = 2; i < 40; i+=8){
            // console.log("date:", data.list[i].dt_txt)
            // console.log("icon:", data.list[i].weather[0].icon)
            // console.log("temperature:", data.list[i].main.temp)
            // console.log("wind:", data.list[i].wind.speed)
            // console.log("humidity:", data.list[i].main.humidity)

        }
        //console.log(data);
    })
};

function makeButton() {
    let newBtnEl = document.createElement("button");
    console.log(localStorage.getItem("test"));
    btnContainerEl.appendChild(newBtnEl);
}