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
let fahrenheit = null;
let celsius = null;
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

updateTime();

//code to update weather in application
function updateWeather(response) {
  console.log(response);

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

  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = `${Math.round(response.data.main.temp)}`;

  let temperatureMax = document.querySelector("#max-temp");
  temperatureMax.innerHTML = `${Math.round(response.data.main.temp_max)}`;

  let temperatureMin = document.querySelector("#min-temp");
  temperatureMin.innerHTML = `${Math.round(response.data.main.temp_min)}`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}`;

  let wind = document.querySelector("#wind");
  let windSpeed = Math.round(response.data.wind.speed);
  if (units === "imperial") {
    wind.innerHTML = `${windSpeed} mph`;
  } else {
    wind.innerHTML = `${windSpeed} kph`;
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
