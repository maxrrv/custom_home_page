'use strict'
const apiCredentials = {
  tankerKoenigURL: 'https://creativecommons.tankerkoenig.de/json/list.php',
  openWeatherURL: 'https://api.openweathermap.org/data/2.5/weather',
  tankerKoenigApiKey: 'secrets',
  openWeatherApiKey: 'secrets'
}

const positionData = {
  city: 'Giessen',
  countryCode: 'DE',
  longitude: 8.676712,
  latitude: 50.585211,
  radiusForSearch: 3,
  type: 'all'
}

const getWeatherForecast = new Promise((resolve, reject) => {
  const { city, countryCode } = positionData
  const { openWeatherURL, openWeatherApiKey } = apiCredentials

  const queryURL = `${openWeatherURL}?q=${city},${countryCode}&appid=${openWeatherApiKey}`

  fetch(queryURL).then((response) => {
    return response.json()
  }).then((responseObject) => {
    resolve(responseObject)
  })
})

const getAllStations = new Promise((resolve, reject) => {
  const { longitude, latitude, radiusForSearch, type } = positionData
  const { tankerKoenigURL, tankerKoenigApiKey } = apiCredentials

  const queryURL = `${tankerKoenigURL}?lat=${latitude}&lng=${longitude}&rad=${radiusForSearch}&type=${type}&apikey=${tankerKoenigApiKey}`

  fetch(queryURL).then((response) => {
    return response.json()
  }).then((myResponse) => {
    resolve(myResponse.stations)
  })
})

const putStationsToTable = (stations) => {
  let table = '<table>'
  table += `<tr><th>Name</th><th>Street</th><th>Price E5</th><th>Status</th></tr>`
  stations.forEach((element, index) => {
    table += `<tr class='${index % 2 == 0 ? 'firstRow' : 'secondRow' }'><td>${element.name}</td><td>${element.street}</td><td>${element.e5}</td><td>${element.isOpen ? "open" : "closed"}</td></tr>`
  })
  table += '</table>'
  return table
}

const putWeatherInformationToTable = weather => {
  let table = '<table>'
  table += `<tr class=firstRow><td>City</td><td>${weather.name}</td></tr>`
  table += `<tr class=secondRow><td>Temperature</td><td>${(weather.main.temp - 273.15).toFixed(2)} C</td></tr>`
  table += `<tr class=firstRow><td>Weather</td><td>${weather.weather[0].main}</td></tr>`
  table += `<tr class=secondRow><td>Description</td><td>${weather.weather[0].description}</td></tr>`
  table += '</table>'
  return table
}

const appendElementToPage = (id, stations) => {
  document.getElementById(id).innerHTML = stations
}

getAllStations.then((stations) => {
  appendElementToPage('gas_stations', putStationsToTable(stations))
})
getWeatherForecast.then((weather) => {
  appendElementToPage('weather', putWeatherInformationToTable(weather))
})
