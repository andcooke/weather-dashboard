//$(document).ready(function() {

let searchBtnEl = document.querySelector("#search-city-btn");
let btnContainerEl = document.querySelector("created-cities-container")
// let userSearch = document.getElementById("input-city").value;
let userSearch = "Austin" 
let lat;
let lon;

const apiKey = "8cf3ec2307733a32bbd3e39236609609";
    
let geoAPIurl = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`;

//on load check local storage for cities and make buttons


// searchBtnEl.addEventListener("click", function () {
//     if (!userSearch.length) {
//         console.log("blank");
//     } else {
//     localStorage.setItem("test", userSearch);
//     console.log(userSearch);
//     }
// });


function getWeatherNow() {
    fetch(geoAPIurl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            lat = data[0].lat;
            lon = data[0].lon;
        })
        .then(function() {
            let weatherAPIurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
            fetch(weatherAPIurl)
                .then(function(response) {
                        return response.json();
                })
                .then(function(data){
                    //console.log(data);
                    console.log("temp (in K):", data.current.temp);
                    console.log("humidity %:", data.current.humidity);
                    console.log("wind in MPH:", data.current.wind_speed);
                    console.log("UV index:", data.current.uvi);
                    console.log("icon:", data.current.weather[0].icon);
                })
        })
        .then(function () {
            let fiveDayAPIurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            fetch(fiveDayAPIurl)
            .then(function(response) {
                    return response.json();
            })
            .then(function(data){
                for (let i = 2; i < 40; i+=8){
                    console.log("date:", data.list[i].dt_txt)
                    console.log("icon:", data.list[i].weather[0].icon)
                    console.log("temperature:", data.list[i].main.temp)
                    console.log("wind:", data.list[i].wind.speed)
                    console.log("humidity:", data.list[i].main.humidity)

                }
                //console.log(data);
            })
        })
    .catch(err => console.error(err))
};


getWeatherNow();
