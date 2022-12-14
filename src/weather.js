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

let apiKey = "288fc2o04bt43eb21ce31fcd35acba08";
let tempCurrent = null;
let min = null;
let max = null;
let windSpeed = null;
let units = "imperial";
let forecastTemp = [1, 2, 3, 4, 5, 6];
let forecastTempMax = [];
let forecastTempMin = [];

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

//code to format timestamp received by api weather forecast call
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let day = days[date.getDay()];

  return day;
}

//code to display 6 day forecast
function displayForecast(response) {
  //set min and max temperature global variables
  min = response.data.daily[0].temperature.minimum;
  max = response.data.daily[0].temperature.maximum;

  let temperatureMax = document.querySelector("#max-temp");
  temperatureMax.innerHTML = `${Math.round(max)}`;

  let temperatureMin = document.querySelector("#min-temp");
  temperatureMin.innerHTML = `${Math.round(min)}`;

  let forecast = response.data.daily;

  let forecastHTML = document.querySelector("#forecast");
  forecastHTML.innerHTML = null;
  forecastTempMax = [null];
  forecastTempMin = [null];

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML.innerHTML =
        forecastHTML.innerHTML +
        `<div class="col-2 index${index} text-center">
              <p class="day-forecast">${formatDay(forecastDay.time)}</p>
              <img
                src="${forecastDay.condition.icon_url}"
                alt="${forecastDay.condition.description}"
                id="icon-forecast"
                class="icon-forecast"
              />
              <p class="temperature-forecast">
                <span id="max-temp-forecast-index${index}" class="max-temp">${Math.round(
          forecastDay.temperature.maximum
        )}</span>??
                <span id="min-temp-forecast-index${index}" class="min-temp">${Math.round(
          forecastDay.temperature.minimum
        )}</span>??
              </p>
            </div>`;
      forecastTempMax.push(forecastDay.temperature.maximum);
      forecastTempMin.push(forecastDay.temperature.minimum);
    }
  });
}

function updateForecast(coords) {
  let latitude = coords.latitude;
  let longitude = coords.longitude;

  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;

  https: axios.get(apiUrl).then(displayForecast);
}

//code to update weather in application
function updateWeather(response) {
  updateTime();

  let city = document.querySelector("#city");
  city.innerHTML = `${response.data.city}`;

  let weather = document.querySelector("#current-weather");
  weather.innerHTML = `${response.data.condition.description}`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  //check for night
  if (response.data.condition.icon.includes("night")) {
    let mode = document.querySelector("body");
    mode.classList.add("dark");
  } else {
    let mode = document.querySelector("body");
    if (mode.classList.contains("dark")) {
      mode.classList.remove("dark");
    }
  }
  //global temperature set
  tempCurrent = response.data.temperature.current;
  windSpeed = response.data.wind.speed;

  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = `${Math.round(response.data.temperature.current)}`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.temperature.humidity}`;

  let wind = document.querySelector("#wind");
  if (units === "imperial") {
    wind.innerHTML = `${Math.round(response.data.wind.speed)} mph`;
  } else {
    wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  }

  updateForecast(response.data.coordinates);
}

//code for search engine functionality
function citySearch() {
  event.preventDefault();

  let cityInput = document.querySelector("#city-input");
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityInput.value}&key=${apiKey}&units=${units}`;

  https: axios.get(apiUrl).then(updateWeather);
}

//event listener for citySearch
let form = document.querySelector("#city-search");
form.addEventListener("submit", citySearch);

//current location weather feature
function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;
  https: axios.get(apiUrl).then(updateWeather);
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

  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=brooklyn&key=${apiKey}&units=${units}`;
  https: axios.get(apiUrl).then(updateWeather);
}

defaultAction();

//conversion functionality
function metricConversion(event) {
  event.preventDefault();

  if (units === "imperial") {
    let currentTempConversion = document.querySelector("#current-temp");
    tempCurrent = ((tempCurrent - 32) * 5) / 9;
    currentTempConversion.innerHTML = `${Math.round(tempCurrent)}`;

    let maxTemp = document.querySelector("#max-temp");
    max = ((max - 32) * 5) / 9;
    maxTemp.innerHTML = `${Math.round(max)}`;

    let minTemp = document.querySelector("#min-temp");
    min = ((min - 32) * 5) / 9;
    minTemp.innerHTML = `${Math.round(min)}`;

    let wind = document.querySelector("#wind");
    windSpeed = windSpeed * 1.609;
    wind.innerHTML = `${Math.round(windSpeed * 1.609)} km/h`;

    forecastTemp.forEach(function (forecastDay) {
      let dayMin = document.querySelector(
        `#min-temp-forecast-index${forecastDay}`
      );
      let newMin = ((forecastTempMin[forecastDay] - 32) * 5) / 9;
      dayMin.innerHTML = `${Math.round(newMin)}`;
      forecastTempMin[forecastDay] = newMin;

      let dayMax = document.querySelector(
        `#max-temp-forecast-index${forecastDay}`
      );
      let newMax = ((forecastTempMax[forecastDay] - 32) * 5) / 9;
      dayMax.innerHTML = `${Math.round(newMax)}`;
      forecastTempMax[forecastDay] = newMax;
    });

    units = "metric";

    fahrenheit.classList.remove("active");
    celsius.classList.add("active");
    fahrenheit.classList.add("inactive");
    celsius.classList.remove("inactive");
  }
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", metricConversion);

function imperialConversion(event) {
  event.preventDefault();

  if (units === "metric") {
    let currentTempConversion = document.querySelector("#current-temp");
    tempCurrent = (tempCurrent * 9) / 5 + 32;
    currentTempConversion.innerHTML = `${Math.round(tempCurrent)}`;

    let maxTemp = document.querySelector("#max-temp");
    max = (max * 9) / 5 + 32;
    maxTemp.innerHTML = `${Math.round(max)}`;

    let minTemp = document.querySelector("#min-temp");
    min = (min * 9) / 5 + 32;
    minTemp.innerHTML = `${Math.round(min)}`;

    let wind = document.querySelector("#wind");
    windSpeed = windSpeed / 1.609;
    wind.innerHTML = `${Math.round(windSpeed)} mph`;

    forecastTemp.forEach(function (forecastDay) {
      let dayMin = document.querySelector(
        `#min-temp-forecast-index${forecastDay}`
      );
      let newMin = (forecastTempMin[forecastDay] * 9) / 5 + 32;
      dayMin.innerHTML = `${Math.round(newMin)}`;
      forecastTempMin[forecastDay] = newMin;

      let dayMax = document.querySelector(
        `#max-temp-forecast-index${forecastDay}`
      );
      let newMax = (forecastTempMax[forecastDay] * 9) / 5 + 32;
      dayMax.innerHTML = `${Math.round(newMax)}`;
      forecastTempMax[forecastDay] = newMax;
    });

    units = "imperial";

    celsius.classList.remove("active");
    fahrenheit.classList.add("active");
    celsius.classList.add("inactive");
    fahrenheit.classList.remove("inactive");
  }
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", imperialConversion);
