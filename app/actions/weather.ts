"use server"

export async function getTripWeather(city: string) {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
        throw new Error("Missing API Key")
    }

    try {
        // 1. Get Coordinates (GeoCoding) if needed, OR just use Direct Name API
        // OpenWeatherMap has a direct by name API:
        // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        )

        if (!currentRes.ok) {
            console.warn("Weather API Error (Current):", await currentRes.text())
            return null
        }

        const currentData = await currentRes.json()

        // 2. Get Forecast
        // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&cnt=24&appid=${apiKey}`,
            { next: { revalidate: 3600 } }
        )
        const forecastData = await forecastRes.json()

        // Process forecast to get daily summary (simple approach: take noon reading or average)
        // The API returns 3-hour steps. We want next 3 days.
        const dailyForecast = []
        const seenDates = new Set()

        // Skip today
        const today = new Date().getDate()

        if (forecastData.list) {
            for (const item of forecastData.list) {
                const d = new Date(item.dt * 1000)
                const dateNum = d.getDate()

                if (dateNum !== today && !seenDates.has(dateNum)) {
                    seenDates.add(dateNum)
                    dailyForecast.push({
                        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        temp: Math.round(item.main.temp),
                        icon: item.weather[0].icon // string like "10d"
                    })
                }
                if (dailyForecast.length >= 3) break
            }
        }

        return {
            temp: Math.round(currentData.main.temp),
            main: currentData.weather[0].main,
            description: currentData.weather[0].description,
            iconCode: currentData.weather[0].icon,
            forecast: dailyForecast
        }

    } catch (error) {
        console.error("Server Action Weather Error:", error)
        return null
    }
}
