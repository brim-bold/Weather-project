//global variables for application
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let apiKey = "1d046e6aaa399d63de49ffe2fb5a384e";
let tempCurrent = null;
let min = null;
let max = null;
let windSpeed = null;
let units = "imperial";

//code to display the lasted time the page was updated
function updateTime() {
  let today = new Date();

  let day = days[today.getDay()];

  let hour = today.getHours();

  let minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let time = document.querySelector("#time");
  time.innerHTML = `Last update: ${day} ${hour}:${minutes}`;
}

//code to update weather in application
function updateWeather(response) {
  let city = document.querySelector("#city");
  city.innerHTML = `${response.data.name}`;

  let weather = document.querySelector("#current-weather");
  weather.innerHTML = `${response.data.weather[0].description}`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  //global temperature set
  tempCurrent = response.data.main.temp;
  min = response.data.main.temp_min;
  max = response.data.main.temp_max;
  windSpeed = response.data.wind.speed;

  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = `${Math.round(response.data.main.temp)}`;

  let temperatureMax = document.querySelector("#max-temp");
  temperatureMax.innerHTML = `${Math.round(response.data.main.temp_max)}`;

  let temperatureMin = document.querySelector("#min-temp");
  temperatureMin.innerHTML = `${Math.round(response.data.main.temp_min)}`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}`;

  let wind = document.querySelector("#wind");
  if (units === "imperial") {
    wind.innerHTML = `${Math.round(response.data.wind.speed)} mph`;
  } else {
    wind.innerHTML = `${Math.round(response.data.wind.speed)} kph`;
  }
}

//code for search engine functionality
function citySearch() {
  event.preventDefault();

  let cityInput = document.querySelector("#city-input");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(updateWeather);
}

//event listener for citySearch
let form = document.querySelector("#city-search");
form.addEventListener("submit", citySearch);

//current location weather feature
function getPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(updateWeather);
}

function currentLocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(getPosition);
}

let current = document.querySelector("#current-location");
current.addEventListener("click", currentLocation);

//default action by weather application upon loading
function defaultAction() {
  updateTime();

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=new+york&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

defaultAction();

//conversion functionality
function metricConversion(event) {
  event.preventDefault();

  if (units === "imperial") {
    let currentTempConversion = document.querySelector("#current-temp");
    currentTempConversion.innerHTML = `${Math.round(
      ((tempCurrent - 32) * 5) / 9
    )}`;

    let maxTemp = document.querySelector("#max-temp");
    maxTemp.innerHTML = `${Math.round(((tempCurrent - 32) * 5) / 9)}`;

    let minTemp = document.querySelector("#min-temp");
    minTemp.innerHTML = `${Math.round(((min - 32) * 5) / 9)}`;

    let wind = document.querySelector("#wind");
    wind.innerHTML = `${Math.round(windSpeed * 1.609)} kph`;

    units = "metric";
  }
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", metricConversion);

function imperialConversion(event) {
  event.preventDefault();

  if (units === "metric") {
    let currentTempConversion = document.querySelector("#current-temp");
    currentTempConversion.innerHTML = `${Math.round(
      (tempCurrent * 9) / 5 + 32
    )}`;

    let maxTemp = document.querySelector("#max-temp");
    maxTemp.innerHTML = `${Math.round((tempCurrent * 9) / 5 + 32)}`;

    let minTemp = document.querySelector("#min-temp");
    minTemp.innerHTML = `${Math.round((tempCurrent * 9) / 5 + 32)}`;

    let wind = document.querySelector("#wind");
    wind.innerHTML = `${Math.round(windSpeed / 1.609)} kph`;

    units = "imperial";
  }
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", imperialConversion);
