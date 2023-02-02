const HTML_ELEMENTS = {
    CITY_INPUT: document.querySelector('#cityInput'),
    FORECAST_FORM: document.querySelector('.forecast-form'),
    DEGREES_NUM: document.querySelector('.degrees-num'),
    ADD_TO_FAVORITE_BUTTON: document.querySelector('#heartIcon')
}
const HTML_DETAILS_ELEMENTS = {
    TEMPETURE: document.querySelector("#details-tempeture"),
    FEELS_LIKE: document.querySelector("#details-feels-like"),
    WEATHER: document.querySelector("#details-weather"),
    SUNRISE: document.querySelector("#details-sunrise"),
    SUNSET: document.querySelector("#details-sunset"),
    
}

const ERRORS = {
    CITY_INPUT_ERROR: new Error('Wrong city name given!'),
    RESPONSE_ERROR: new Error('Response error')
}

const fetchData = {
    serverUrl: 'http://api.openweathermap.org/data/2.5/weather',
    cityName: "",
    apiKey: 'd3cdffaa67091758b8f1186dc0cbf511',
}
fetchData.apiUrl = `${fetchData.serverUrl}?q=${fetchData.cityName}&appid=${fetchData.apiKey}`

const cityList = []

function localStorageSetting(){for(let item in localStorage){
    if(!localStorage.hasOwnProperty(item) || item === 'data' || item === 'number'){
        continue
    }else{
        cityList.push(item)
    }
}
for (let item of cityList) {
    addCityToHTML(item)
}}
localStorageSetting()

async function showFirstListItemWeather(){
    fetchData.cityName = cityList[0]
    refreshApiUrl();
    let weatherData = await getWeatherData()
    if (weatherData != null) {
        changeCityTemp(weatherData);
        changeCityTitles();
    }
}
if(cityList.length > 0){
showFirstListItemWeather()
}


function refreshApiUrl() {
    fetchData.apiUrl = `${fetchData.serverUrl}?q=${fetchData.cityName}&appid=${fetchData.apiKey}`
}

function getCityName() {
    if (!isCityInputCorrect()) {
        throw ERRORS.CITY_INPUT_ERROR
    } else {
        fetchData.cityName = HTML_ELEMENTS.CITY_INPUT.value.trim()
    }
}

function isCityInputCorrect() {
    let inputValue = HTML_ELEMENTS.CITY_INPUT.value
    inputValue = inputValue.trim()
    return (inputValue != '' && isNaN(Number(inputValue)))
}

function setWeatherValues(weatherData){
    let tempeture = Math.round(weatherData.main.temp - 273)
    HTML_ELEMENTS.DEGREES_NUM.textContent = tempeture
    HTML_DETAILS_ELEMENTS.TEMPETURE.textContent = "Temperature: " + tempeture + "°"
    HTML_DETAILS_ELEMENTS.FEELS_LIKE.textContent = "Feels like: " + (Math.round(weatherData.main.feels_like) - 273) + "°"
    HTML_DETAILS_ELEMENTS.WEATHER.textContent = "Weather: " + weatherData.weather[0].main
    let SUNRISE = new Date(weatherData.sys.sunrise * 1000);
    let SUNSET = new Date(weatherData.sys.sunset * 1000);
    HTML_DETAILS_ELEMENTS.SUNRISE.textContent = `Sunrise: ${SUNRISE.toLocaleTimeString()}`
    HTML_DETAILS_ELEMENTS.SUNSET.textContent = `Sunset: ${SUNSET.toLocaleTimeString()}`
}

function changeCityTemp(weatherData){
    refreshApiUrl();
    setWeatherValues(weatherData);


}

async function setWeatherInHtml() {
    getCityName();
    refreshApiUrl();
    let weatherData = await getWeatherData()
    if (weatherData != null) {
        changeCityTemp(weatherData);
        changeCityTitles();
    } else {
        throw ERRORS.CITY_INPUT_ERROR
    }
}

function changeCityTitles() {
    for (item of document.querySelectorAll('.city-name')) {
        item.textContent = fetchData.cityName
    }
}

async function getWeatherData() {
    let weatherData = null;
    if (!isCityInputCorrect) {
        throw ERRORS.CITY_INPUT_ERROR
    } else {
        await fetch(fetchData.apiUrl)
            .then(async function (response) {
                if (response.status == 200) {
                    weatherData = await response.json()
                    console.log(weatherData)
                }
            })
            .catch(() => {
                throw ERRORS.RESPONSE_ERROR
            })
    }
    return weatherData;
}

function renderCityList(name) {
    localStorage.removeItem(name)
    while (document.querySelector(".locations-items").childNodes.length != 0) {
        for (let item of document.querySelector(".locations-items").childNodes) {
            item.remove()
        }
    }
    while (cityList.includes(name)) {

        for (let index = 0; index < cityList.length; index++) {
            if (cityList[index] === name) {
                cityList.splice(index, 1)
            }
        }
        for (let item of cityList) {
            addCityToHTML(item)
        }
    }
};

function renderLocalStorage(){
    for(let item in localStorage){
        if(localStorage.hasOwnProperty(item)){
            continue
        }else{
            localStorage.removeItem(item)
        }
    }
    for(let item of cityList){
        localStorage.setItem(item, item)
    }
    console.log(localStorage)
}

function checkAddedCitiesCount(){
    if(cityList.length >= 8){
        alert("Добавлено слишком много городов. Уберите лишние.")
        return false;
    }
    return true
}

async function switchToFavoriteCity(item){
    fetchData.cityName = item.textContent.slice(0, -1)
    refreshApiUrl();
    changeCityTitles()
    let weatherData = await getWeatherData()
    changeCityTemp(weatherData)
}

function addCityToHTML(name) {
    if(checkAddedCitiesCount()){
    let city = document.createElement("li")
    city.textContent = name
    let closer = document.createElement("div")
    closer.textContent = '✕'
    closer.className = 'deleteLocation'
    closer.addEventListener('click', function () {
        renderCityList(name)
    })
    city.append(closer)
    city.addEventListener('click', function () {
        switchToFavoriteCity(city)
    })
    document.querySelector('.locations-items').append(city)
    }
}

async function addToList() {
    let weatherData = await getWeatherData()
    if(weatherData != null){
    if (fetchData.cityName != '' && !cityList.includes(fetchData.cityName)) {
        cityList.push(fetchData.cityName)
        addCityToHTML(fetchData.cityName)
        renderLocalStorage()
        }
    }
}
HTML_ELEMENTS.FORECAST_FORM.addEventListener('submit', setWeatherInHtml);
HTML_ELEMENTS.ADD_TO_FAVORITE_BUTTON.addEventListener('click', addToList);

// сделать чтобы по клику на город менялась погода