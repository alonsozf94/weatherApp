// Variables
let cityInput = document.querySelector("#city-input");
let cityButton = document.querySelector("button");
let content = document.querySelector(".content");

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=bdd4add47bc04e8383233155242605&q=${city}&days=3&aqi=no&alerts=no`,
      {
        mode: "cors",
      }
    );
    const weatherData = await response.json();
    let forecastDaysArray = [];
    weatherData.forecast.forecastday.forEach((dayElement) => {
      let dayObject = {
        date: dateConverter(dayElement.date),
        avgtemp_c: dayElement.day.avgtemp_c,
        avgtemp_f: dayElement.day.avgtemp_f,
        condition: dayElement.day.condition.text,
        condition_icon: dayElement.day.condition.icon,
      };
      forecastDaysArray.push(dayObject);
    });
    const weatherObject = {
      name: weatherData.location.name,
      region: weatherData.location.region,
      country: weatherData.location.country,
      currentDate: dateConverter(weatherData.location.localtime.split(" ")[0]),
      currentTime: weatherData.location.localtime.split(" ")[1],
      current: weatherData.current,
      last_updated:
        dateConverter(weatherData.current.last_updated.split(" ")[0]) +
        " " +
        weatherData.current.last_updated.split(" ")[1],
      forecastDays: forecastDaysArray,
    };
    console.log(weatherObject);
    return weatherObject;
  } catch (error) {
    console.log("Catch!");
    console.error("Error fetching detailed weather data:", error);
  }
}
function displayWeatherInfo(container, weatherData) {
  container.innerHTML = "";
  let weatherContainer = document.createElement("div");
  let forecastContainer = document.createElement("div");
  weatherContainer.classList.add("weather-container");
  forecastContainer.classList.add("forecast-container");
  weatherContainer.innerHTML = `
    <div class="location-container column">
      <h1 class="location-name">${weatherData.name}</h1>
      <span class="region-name">${weatherData.region}, ${weatherData.country} | ${weatherData.currentDate}, ${weatherData.currentTime}</span>

    </div>
    <div class="current-container">
      <div class="forecast-box">
        <div class="forecast-title column">
          <h3>Current Weather</h3>
          <span>Last Updated: ${weatherData.last_updated}</span>
        </div>
        <div class="condition-icon">
          <img src="https:${weatherData.current.condition.icon}" alt="SYMBOL">
        </div>
        <div class="forecast-temp row">
          <span>${weatherData.current.temp_c}°C | ${weatherData.current.temp_f}°F</span>
        </div>
        <div class="condition-text">
          <span>${weatherData.current.condition.text}</span>
        </div>
      </div>
    </div>
  `;
  weatherData.forecastDays.forEach((day) => {
    let dayForecastBox = document.createElement("div");
    dayForecastBox.classList.add("forecast-box");
    dayForecastBox.innerHTML = `
      <h3 class="forecast-title">${day.date}</h3>
      <div class="condition-icon">
        <img src="https:${day.condition_icon}" alt="SYMBOL">
      </div>
      <div class="forecast-temp column">
        <span>${day.avgtemp_c}°C</span>
        <span>${day.avgtemp_f}°F</span>
      </div>
      <div class="condition-text">
        <span>${day.condition}</span>
      </div>
    `;
    forecastContainer.appendChild(dayForecastBox);
  });

  weatherContainer.appendChild(forecastContainer);
  container.appendChild(weatherContainer);
}
function dateConverter(date) {
  let locationDate = new Date(date);
  let locationMonth = locationDate.toLocaleString("default", { month: "long" });
  let locationDay = locationDate.getDate();
  return locationMonth + " " + locationDay;
}
async function main() {
  cityButton.addEventListener("click", async () => {
    if (cityInput.value === "") {
      alert("Insert city");
    } else {
      let weatherInfo = await fetchWeatherData(cityInput.value);
      displayWeatherInfo(content, weatherInfo);
    }
  });

  let startWeather = await fetchWeatherData("Hobart");
  displayWeatherInfo(content, startWeather);
}

main();
