const HTML_ELEMENTS = {
    CITY_INPUT: document.querySelector('#cityInput'),
    FORECAST_FORM: document.querySelector('.forecast-form'),
    DEGREES_NUM: document.querySelector('.degrees-num'),
}

const ERRORS = {
    CITY_INPUT_ERROR: new Error('Wrong city name given!'),
    RESPONSE_ERROR: new Error('Response error')
}

const fetchData = {
    serverUrl: 'http://api.openweathermap.org/data/2.5/weather',
    cityName: 'Moscow',
    apiKey: 'd3cdffaa67091758b8f1186dc0cbf511',
}
fetchData.apiUrl = `${fetchData.serverUrl}?q=${fetchData.cityName}&appid=${fetchData.apiKey}`

function refreshApiUrl(){
    fetchData.apiUrl = `${fetchData.serverUrl}?q=${fetchData.cityName}&appid=${fetchData.apiKey}`
}

function getCityName(){
    if(!isCityInputCorrect()){throw ERRORS.CITY_INPUT_ERROR}
    else{
        fetchData.cityName = HTML_ELEMENTS.CITY_INPUT.value.trim()
    }
}

function isCityInputCorrect(){
    let inputValue = HTML_ELEMENTS.CITY_INPUT.value 
    inputValue = inputValue.trim()
    return(inputValue != '' && isNaN(Number(inputValue)))
}

async function setWeatherInHtml(){
    getCityName();
    refreshApiUrl();
    changeCityTitles();
    let weatherData = await getWeatherData()
    if(weatherData != null){
        HTML_ELEMENTS.DEGREES_NUM.textContent = Math.round(weatherData.main.temp - 273)
    }else{
        throw ERRORS.CITY_INPUT_ERROR
    }
}

function changeCityTitles(){
    for(item of document.querySelectorAll('.city-name')){
        item.textContent = fetchData.cityName
    }
}

async function getWeatherData(){
    let weatherData = null;
    if(!isCityInputCorrect){
        throw ERRORS.CITY_INPUT_ERROR
    }else{
     await fetch(fetchData.apiUrl)
     .then(async function(response){
        if(response.status == 200){
            weatherData = await response.json()
            console.log(weatherData)
        }
     })
     .catch(() => {throw ERRORS.RESPONSE_ERROR})
    }
    return weatherData;
}

HTML_ELEMENTS.FORECAST_FORM.addEventListener('submit', setWeatherInHtml);
