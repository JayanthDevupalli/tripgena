"use client"

import { useState, useEffect } from "react"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from "lucide-react"

// WMO Weather Code Mapping to Icons
const getWeatherIcon = (code: number) => {
    if (code <= 3) return Sun // Clear/Partly Cloudy
    if (code <= 48) return Cloud // Fog
    if (code <= 67) return CloudRain // Rain
    if (code <= 77) return CloudSnow // Snow
    if (code <= 82) return CloudRain // Showers
    if (code <= 86) return CloudSnow // Snow showers
    if (code <= 99) return CloudLightning // Thunderstorm
    return Wind
}

export function useWeather(city: string) {
    const [weather, setWeather] = useState<{ temp: number, code: number, icon: any } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!city) return

        const fetchWeather = async () => {
            try {
                // 1. Geocode
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
                const geoData = await geoRes.json()

                if (!geoData.results || geoData.results.length === 0) {
                    setLoading(false)
                    return
                }

                const { latitude, longitude } = geoData.results[0]

                // 2. Weather
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
                const weatherData = await weatherRes.json()

                setWeather({
                    temp: weatherData.current_weather.temperature,
                    code: weatherData.current_weather.weathercode,
                    icon: getWeatherIcon(weatherData.current_weather.weathercode)
                })
            } catch (error) {
                console.error("Weather error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [city])

    return { weather, loading }
}
