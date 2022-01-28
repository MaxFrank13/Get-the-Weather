// **** Selectors ****

const formEl = document.querySelector("form");
const searchBtn = document.querySelector(".search");
const clearBtn = document.querySelector(".clear");
const forecastContainer = document.querySelector(".forecast-container")
const locationsContainer = document.querySelector(".locations");
const searchInput = document.querySelector("#search-input");
const daysInput = document.querySelectorAll(".day-input");


window.addEventListener("DOMContentLoaded", function () {
  const objectKeys = Object.keys(localStorage);
  
  if (objectKeys) {
    let currentStorage = [];
    objectKeys.forEach((key) => {
      currentStorage.push(JSON.stringify(getLocalStorage(key)));
      clearLocalStorage();
    })
    objectKeys.forEach((key) => {
      getCoordinates(key);
      createForecastHeader(key);
    })
  } 

  
});

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (searchInput.value) {
    getCoordinates(searchInput.value);
    createForecastHeader(searchInput.value);
  } else {
    alert("please enter a city");
  }
});

locationsContainer.addEventListener('click', function (e) {
  const input = e.target.textContent;
  const output = getLocalStorage(input);
  createForecast(input, output);
});

clearBtn.addEventListener('click', function() {
  if (confirm("This will clear your entire local storage. Continue?")) clearLocalStorage();
});

// **** API Calls ****

function getCoordinates(input) {
  const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=9e3d200f90a14971a704be16f41dc73c`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach((city) => {
  
        const coords = `lat=${city.lat}&lon=${city.lon}`
        
        getForecast(input, coords);
      })
    })
}

function getForecast(input, coordinates) {
  const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?${coordinates}&units=imperial&appid=9e3d200f90a14971a704be16f41dc73c`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      readResponse(input, data);
    })
}

// **** Read data from response ****

function readResponse(input, data) {
  const output = [];
  const currentDay = data.current;
  output.push(
    {
      date: dayjs(currentDay.dt * 1000).format('dddd MMM D, YYYY'),
      conditions: {
        description: currentDay.weather[0].description,
        icon: currentDay.weather[0].icon
      },
      temp: currentDay.temp,
      wind_speed: currentDay.wind_speed,
      humidity: currentDay.humidity,
      uvIndex: currentDay.uvi
    });
  data.daily.forEach((item, index) => {

    if (index > 0) output.push(
      {
        date: dayjs(item.dt * 1000).format('dddd MMM D, YYYY'),
        conditions: {
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        temp: item.temp.day,
        wind_speed: item.wind_speed,
        humidity: item.humidity,
      });

  })

  createForecast(input, output);
  setLocalStorage(input, output);
}

// create elements using that data

function createForecastHeader(location) {
  const newHeader = document.createElement("h2");
  newHeader.classList.add('forecast-location');
  newHeader.classList.add('btn');
  newHeader.innerHTML = location;
  locationsContainer.append(newHeader);
}

function createForecast(input, output) {
  forecastContainer.innerHTML = "";
  // const newHeader = document.createElement("h2");
  // newHeader.textContent = input;
  // forecastContainer.append(newHeader);

  output.forEach((obj) => {
    const newSection = document.createElement("section");
    newSection.classList.add('forecast-card');
    newSection.classList.add('clay');

    newSection.innerHTML = `<h3>${obj.date}</h3>
    <img src="http://openweathermap.org/img/w/${obj.conditions.icon}.png" alt="${obj.conditions.description}">
    <p class="temp">Temp: <span>${obj.temp} &#8457</span></p>
    <p class="wind">Wind: <span>${obj.wind_speed} mph</span></p>
    <p class="humidity">Humidity: <span>${obj.humidity}%</span></p>`;

    if (obj.uvIndex >= 0) {
      const newUv = document.createElement("p");
      const newSpan = document.createElement("span");
      const uviVal = obj.uvIndex;
      newSpan.textContent = uviVal;
      newSpan.classList.add("uv-index");
      newUv.textContent = "UV-index: ";
      newUv.append(newSpan);
      newSection.append(newUv);

      if (uviVal < 4.5) newSpan.style.background = "green";
      else if (uviVal < 5.5) newSpan.style.background = "yellowgreen";
      else if (uviVal < 7.9) newSpan.style.background = "yellow";
      else if (uviVal < 10.0) newSpan.style.background = "orangered";
      else if (uviVal >= 10.0) newSpan.style.background = "red";
    }

    if (obj.temp > 90) newSection.classList.add("hottest");
    else if (obj.temp > 75) newSection.classList.add("hotter");
    else if (obj.temp > 60) newSection.classList.add("hot");
    else if (obj.temp > 45) newSection.classList.add("warm");
    else if (obj.temp > 38) newSection.classList.add("cool");
    else if (obj.temp > 30) newSection.classList.add("cooler");
    else if (obj.temp > 20) newSection.classList.add("cold");
    else if (obj.temp > 10) newSection.classList.add("colder");
    else newSection.classList.add("coldest");

    forecastContainer.append(newSection);
  })
}

// **** Local Storage ****

function setLocalStorage(city, output) {
  localStorage.setItem(city, JSON.stringify(output));
}

function getLocalStorage(city) {
  return JSON.parse(localStorage.getItem(city));
}

function clearLocalStorage() {
  localStorage.clear();
}