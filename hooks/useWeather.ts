import { useState, useEffect } from "react"
import { getTripWeather } from "@/app/actions/weather"
import { getWeatherIcon } from "@/lib/weather"

export function useWeather(city: string) {
    const [weather, setWeather] = useState<{
        temp: number,
        main: string,
        description: string,
        icon: any, // component
        forecast: any[]
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!city) return

        const fetchWeather = async () => {
            try {
                const data = await getTripWeather(city)
                if (data) {
                    setWeather({
                        ...data,
                        icon: getWeatherIcon(data.iconCode)
                    })
                }
            } catch (error) {
                console.error("Weather hook error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [city])

    return { weather, loading }
}
