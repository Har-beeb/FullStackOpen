import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_API_KEY

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!city) return
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
      .then(response => setWeather(response.data))
  }, [city])

  if (!weather) return <div>Loading weather...</div>

  return (
    <div>
      <h3>Weather in {city}</h3>
      <div>Temperature: {weather.main.temp} °C</div>
      <div>Weather: {weather.weather[0].description}</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather