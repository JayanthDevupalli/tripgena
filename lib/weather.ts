import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from "lucide-react"

// OpenWeatherMap Icon Code Mapping
// https://openweathermap.org/weather-conditions
export const getWeatherIcon = (code: string) => {
    // Codes are like "01d", "02n", etc.
    if (!code) return Sun

    const num = code.substring(0, 2)
    switch (num) {
        case "01": return Sun // clear sky
        case "02": return Cloud // few clouds
        case "03": return Cloud // scattered clouds
        case "04": return Cloud // broken clouds
        case "09": return CloudDrizzle // shower rain
        case "10": return CloudRain // rain
        case "11": return CloudLightning // thunderstorm
        case "13": return CloudSnow // snow
        case "50": return CloudFog // mist
        default: return Cloud
    }
}
