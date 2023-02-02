const HTML_ELEMENTS = {
    CITY_INPUT: document.querySelector('#cityInput'),
    FORECAST_FORM: document.querySelector('.forecast-form'),
    DEGREES_NUM: document.querySelector('.degrees-num'),
    ADD_TO_FAVORITE_BUTTON: document.querySelector('#heartIcon')
}

const ERRORS = {
    CITY_INPUT_ERROR: new Error('Wrong city name given!'),
    RESPONSE_ERROR: new Error('Response error')
}

const fetchData = {
    serverUrl: 'http://api.openweathermap.org/data/2.5/weather',
    cityName: '',
    apiKey: 'd3cdffaa67091758b8f1186dc0cbf511',
}
fetchData.apiUrl = `${fetchData.serverUrl}?q=${fetchData.cityName}&appid=${fetchData.apiKey}`

const cityList = []

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

function changeCityTemp(weatherData){
    refreshApiUrl();
    HTML_ELEMENTS.DEGREES_NUM.textContent = Math.round(weatherData.main.temp - 273)
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
        }
    }
}
HTML_ELEMENTS.FORECAST_FORM.addEventListener('submit', setWeatherInHtml);
HTML_ELEMENTS.ADD_TO_FAVORITE_BUTTON.addEventListener('click', addToList);

// сделать чтобы по клику на город менялась погода