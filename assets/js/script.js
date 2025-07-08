'use strict';

const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const today = document.getElementById('date');
const todayDate = document.getElementById('day');
const currentLocation = document.getElementById('location');
const todayDegree = document.getElementById('todayDegree');
const todayForcat = document.getElementById('todayForcast')
const tomorrow = document.getElementById('tomorrow');
const nextDay = document.getElementById('nextDay');
const weatherInfo = document.getElementById('weatherInfo');
const weatherInfoAfterTomorrow = document.getElementById('weatherInfoAfterTomorrow')
let forecast = {}
let forecastday = []
let locationData = {}


const FormateDate = (dateTime) => {
    const currentDate = new Date(dateTime);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = currentDate.getDay();
    const weekday = days[day];

    const dayMonth = currentDate.toLocaleDateString('en-us', {
        day: 'numeric',
        month: 'long',
    });

    return { dayMonth, weekday };
}

const getCurrentForecast = (hoursArr) => {
    const now = new Date();

    return hoursArr.find(hourObj => {
        const forecastDate = new Date(hourObj.time.replace(' ', 'T'));

        return (
            forecastDate.getHours() === now.getHours() &&
            forecastDate.getDate() === now.getDate() &&
            forecastDate.getMonth() === now.getMonth() &&
            forecastDate.getFullYear() === now.getFullYear()
        );
    });
};


const getWeather = async () => {
    const location = searchInput.value.trim() || 'egypt';

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e7a3f211406f412da2764621250707&q=${location}&days=3&aqi=no&alerts=no`);
        const data = await response.json();

        const forecast = data.forecast;
        const forecastday = forecast.forecastday;
        const locationData = data.location;
        currentLocation.innerText = locationData.name;

        for (let i = 0; i < forecastday.length; i++) {
            const CurrentForcast = getCurrentForecast(forecastday[i].hour);
            //code for first column
            if (i === 0) {
                today.innerText = FormateDate(forecastday[i].date).dayMonth;
                todayDate.innerText = FormateDate(forecastday[i].date).weekday;
                todayDegree.innerText = CurrentForcast['temp_c'];

                todayForcat.innerHTML = `<div class="my-3" >
                <span class="fs-2">
                  <img src="${CurrentForcast.condition.icon}" alt="${CurrentForcast.condition.icon}">
                </span>
                <p class="text-info">${CurrentForcast.condition.text}</p>
              </div>
              <div class="d-flex align-items-center gap-3 weather-indicators">
                <div>
                  <img src="./assets/images/icon-umberella.png" alt="amberal">
                  <span class="ms-2 d-inline-block">20%</span>
                </div>

                <div>
                  <img src="./assets/images/icon-wind.png" alt="wind">
                  <span class="ms-2 d-inline-block"> ${CurrentForcast['wind_kph']}km/h</span>
                </div>

                <div>
                  <img src="./assets/images/icon-compass.png" alt="compass">
                  <span class="ms-2 d-inline-block text-capitalize"> ${CurrentForcast['wind_dir']}</span>
                </div>

              </div>`
            } else if (i === 1) {
                tomorrow.innerText = FormateDate(forecastday[i].date).weekday;
                weatherInfoAfterTomorrow.innerHTML = `
        <div class="mb-3">
                 <img src="${forecastday[i].day.condition.icon}" alt="${forecastday[i].day.condition.icon}"></div>
              <h3>${forecastday[i].day['maxtemp_c']}°C</h3>
              <p class="text-muted">${forecastday[i].day['mintemp_c']}°C</p> 
              <p class="text-info">${forecastday[i].day.condition.text}</p>
            `
            } else {
                nextDay.innerText = FormateDate(forecastday[i].date).weekday;
                weatherInfo.innerHTML = `
                 <div class="mb-3">
                 <img src="${forecastday[i].day.condition.icon}" alt="${forecastday[i].day.condition.icon}"></div>
              <h3>${forecastday[i].day['maxtemp_c']}°C</h3>
              <p class="text-muted">${forecastday[i].day['mintemp_c']}°C</p> 
              <p class="text-info">${forecastday[i].day.condition.text}</p>
            `
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

searchInput.addEventListener('input', () => { 
  localStorage.setItem('searchLocation', searchInput.value.trim());
  getWeather();
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('searchLocation', searchInput.value.trim());
    getWeather()
})

window.addEventListener('load', () => {
    getWeather()
})