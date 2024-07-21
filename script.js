  const weatherApi = {
    key: "0570c62328177d453cf66d0d78883b92", //Replace the key with your own OpenWeather API key
    base: "https://api.openweathermap.org/data/2.5/"
};

const geocodingApi = {
    key: "c49c932a261c427ca35ab72a9f59328a",
    base: "https://api.opencagedata.com/geocode/v1/json" //Replace the key with your own OpencageGeocode API key
};

const searchbox = document.querySelector('.search-box .search');
const loadingIndicator = document.getElementById('loading');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode === 13) {
        getCoordinates(searchbox.value);
    }
}

function showLoading() {
    loadingIndicator.style.display = 'inline-block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function getCoordinates(query) {
    showLoading();
    fetch(`${geocodingApi.base}?q=${query}&key=${geocodingApi.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length === 0) {
                throw new Error('Location not found');
            }
            const { lat, lng } = data.results[0].geometry;
            getWeather(lat, lng, query);
        })
        .catch(error => {
            alert(error.message);
        })
        .finally(() => {
            hideLoading();
        });
}

function getWeather(lat, lon, placeName) {
    showLoading();
    fetch(`${weatherApi.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${weatherApi.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(weather => {
            displayResults(weather, placeName);
        })
        .catch(error => {
            alert(error.message);
        })
        .finally(() => {
            hideLoading();
        });
}

function displayResults(weather, placeName) {
    let city = document.querySelector('.location .city');
    city.innerText = `${placeName}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

  