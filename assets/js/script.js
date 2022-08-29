//$(document).ready(function() {

let searchBtnEl = document.querySelector("#search-city-btn");
let btnContainerEl = document.querySelector("#created-cities-container");
let userSearch = document.getElementById("input-city");
let currentWeatherContainer = document.querySelector(".current-weather-container");
let futureForecastContainer = document.querySelector("#future-forecast-container");

// let userSearchValue;
// let geoAPIurl;
let savedBtns;
let cityButtons = [];

const apiKey = "8cf3ec2307733a32bbd3e39236609609";
    
//on load check local storage for cities and make buttons

searchBtnEl.addEventListener("click", function () {
    currentWeatherContainer.textContent = "";
    let userSearchValue = userSearch.value;
    if (!userSearchValue) {
        window.alert("Please input a city to receive the weather.")
        // console.log("blank");
    } else if (cityButtons.includes(userSearchValue)) {
        geoAPIurl = `https://api.openweathermap.org/geo/1.0/direct?q=${userSearchValue}&limit=5&appid=${apiKey}`;
        getCoordinates();
    } else {
        //console.log(userSearchValue);
        geoAPIurl = `https://api.openweathermap.org/geo/1.0/direct?q=${userSearchValue}&limit=5&appid=${apiKey}`;
        getCoordinates(userSearchValue);
        saveSearch(userSearchValue);
        
    }
});

// async function getCoordinatesNow() {
//     currentWeatherContainer.innerHTML = "";
//     var response = await fetch(geoAPIurl);
//     var data = await response.json();
//     lat = data[0].lat;
//     lon = data[0].lon;

function getCoordinates(city) {
    let geoAPIurl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    fetch(geoAPIurl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        currentWeatherContainer.setAttribute("style", "display: block");
        lat = data[0].lat;
        lon = data[0].lon;
        getCurrentWeather(lat, lon, city);
    })
    .catch(err => console.error(err))
};


function getCurrentWeather (lat, lon, city) {
    currentWeatherContainer.innerHTML = "";
    let weatherAPIurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(weatherAPIurl)
    .then(function(response) {
            return response.json();
    })
    .then(function(data){
        console.log(data);
        //city title
        let cityTitleEl = document.createElement("h1");
        cityTitleEl.textContent = city;
        currentWeatherContainer.appendChild(cityTitleEl)
        //icon
        let iconEl = document.createElement("img");
        let currentIcon = data.current.weather[0].icon
        let iconUrl = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`
        iconEl.setAttribute("src", iconUrl);
        cityTitleEl.appendChild(iconEl);

        //need date
        let currentDate = document.createElement("h3");
        var dayname = new Date(data.current.dt * 1000).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric"});
        currentDate.textContent = dayname;
        currentWeatherContainer.appendChild(currentDate);

        //current Weather
        let currentTemp = document.createElement("p");
        //console.log("temp (in K):", Math.floor(data.current.temp*(9/5)-459.67));
        currentTemp.textContent = `Temp: ${Math.floor(data.current.temp)}°F`;
        currentWeatherContainer.appendChild(currentTemp);
        //console.log("humidity %:", data.current.humidity);
        let currentHumidity = document.createElement("p");
        currentHumidity.textContent = `Humidity: ${data.current.humidity}%`;
        currentWeatherContainer.appendChild(currentHumidity);
        //console.log("wind in MPH:", data.current.wind_speed);
        let currentWind = document.createElement("p");
        currentWind.textContent = "Wind: " + data.current.wind_speed + " mph";
        currentWeatherContainer.appendChild(currentWind);
        //console.log("UV index:", data.current.uvi);

        //need color background for uv index

        let currentUV = document.createElement("p");
        currentUV.textContent = "UV Index: ";
        let currentIndex = document.createElement("span");
        let uvIndex = data.current.uvi
        currentIndex.textContent = uvIndex;
        if (uvIndex <= 2) {
            currentIndex.setAttribute("id", "low")
        }
        if (uvIndex > 2 && uvIndex <= 7) {
            currentIndex.setAttribute("id", "moderate")
        }
        if (uvIndex > 7 && uvIndex <= 10) {
            currentIndex.setAttribute("id", "high")
        }
        if (uvIndex > 10) {
            currentIndex.setAttribute("id", "extreme")
        }
        currentUV.appendChild(currentIndex);
        currentWeatherContainer.appendChild(currentUV);
        get5Day(data.daily);
    })
};



function get5Day(data) {
    futureForecastContainer.textContent = " "
        // console.log(data)
        for (let i = 1; i < 6; i++){
            let futureCard = document.createElement("div")
            futureCard.setAttribute("class", "future-card")
            // console.log("date:", dayname);
            let futureDate = document.createElement("h4");
            var dayname = new Date(data[i].dt * 1000).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
            futureDate.textContent = dayname;
            futureCard.appendChild(futureDate) ;
        //     // console.log("icon:", data.list[i].weather[0].icon)
            let futureIconEl = document.createElement("img")
            let futureIcon = data[i].weather[0].icon
            let futureIconUrl = `https://openweathermap.org/img/wn/${futureIcon}@2x.png`
            futureIconEl.setAttribute("src", futureIconUrl);
            futureCard.appendChild(futureIconEl);
        //     // console.log("temperature:", data.list[i].main.temp)
            let futureTemp = document.createElement("p");
            futureTemp.textContent = `Temp: ${Math.floor(data[i].temp.day)}°F`;
            futureCard.appendChild(futureTemp);
        //     // console.log("wind:", data.list[i].wind.speed)
            let futureWind= document.createElement("p");
            futureWind.textContent = `Wind: ${Math.floor(data[i].wind_speed)} MPH`;
            futureCard.appendChild(futureWind);
        //     // console.log("humidity:", data[i].humidity)
            let futureHumidity = document.createElement("p");
            futureHumidity.textContent = `Humidity: ${data[i].humidity}%`;
            futureCard.appendChild(futureHumidity);
            futureForecastContainer.appendChild(futureCard)
        }
        //console.log(data);
    // })
};

function makeButton() {
    btnContainerEl.innerHTML = '';
    // get local storage
    //loop through the array
    for (let i = 0; i < cityButtons.length; i++){
        let newBtnEl = document.createElement("button");
        newBtnEl.textContent = cityButtons[i];
        newBtnEl.setAttribute("class", "btn")
        newBtnEl.setAttribute("class", "full-size")
        newBtnEl.setAttribute("id", "saved-button")
        newBtnEl.setAttribute("class", "btn-history")
        newBtnEl.setAttribute("data-search", cityButtons[i])
        //console.log(localStorage.getItem("test"));
        btnContainerEl.appendChild(newBtnEl);
    }
}

btnContainerEl.onclick = handleHistoryClick;

function handleHistoryClick (event) {
    if (!event.target.matches(".btn-history")) {
        return;
    } 
    let btn = event.target;
    let city = btn.getAttribute("data-search")
    getCoordinates(city);
};

function saveSearch(city) {
    cityButtons.push(city);
    localStorage.setItem("cities", JSON.stringify(cityButtons));
    makeButton();
}


function init () {
    let storedHistory = localStorage.getItem("cities");
    if (storedHistory) {
        cityButtons = JSON.parse(storedHistory);
    }
    // console.log(cityButtons)
    makeButton();
}

// function getButtons() {
//     savedBtns = localStorage.getItem("savedButtons");
    // console.log(savedBtns);
    // if (savedBtns.length > 0) {
    //     cityButtons = savedBtns;
    //     for (let k=0; k < savedBtns.length; k++) {
    //         let savedBtnEl = document.createElement("button");
    //         savedBtnEl.setAttribute("class", "btn")
    //         savedBtnEl.setAttribute("class", "full-size")
    //         savedBtnEl.setAttribute("id", "saved-button")
    //         savedBtnEl.textContent = savedBtns[k];
    //         btnContainerEl.appendChild(savedBtnEl)
    //     }
    // }
// }

init();
