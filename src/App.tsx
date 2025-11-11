import { useState, useEffect } from 'react'
import './App.css'

// Type definitions for weather data structures
interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
}

function App() {
  // State management
  const [city, setCity] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Mock weather data generator - simulates API call
  // In production, replace with actual API calls to OpenWeatherMap, WeatherAPI, etc.
  const fetchWeatherData = async (cityName: string): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock current weather data
      const mockWeather: WeatherData = {
        city: cityName,
        country: 'US',
        temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
        feelsLike: Math.floor(Math.random() * 20) + 13,
        condition: getRandomCondition(),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        icon: getRandomCondition()
      };

      // Mock 5-day forecast
      const mockForecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        tempMax: Math.floor(Math.random() * 15) + 20,
        tempMin: Math.floor(Math.random() * 10) + 10,
        condition: getRandomCondition(),
        icon: getRandomCondition()
      }));

      setCurrentWeather(mockWeather);
      setForecast(mockForecast);
      setCity(cityName);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get random weather conditions
  const getRandomCondition = (): string => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm', 'Snowy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Get weather icon emoji based on condition
  const getWeatherIcon = (condition: string): string => {
    const iconMap: { [key: string]: string } = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Partly Cloudy': '⛅',
      'Thunderstorm': '⛈️',
      'Snowy': '❄️'
    };
    return iconMap[condition] || '🌤️';
  };

  // Temperature conversion functions
  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  };

  const displayTemp = (celsius: number): number => {
    return isCelsius ? Math.round(celsius) : celsiusToFahrenheit(celsius);
  };

  const getTempUnit = (): string => {
    return isCelsius ? '°C' : '°F';
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeatherData(searchInput.trim());
      setSearchInput('');
    }
  };

  // Toggle temperature unit
  const toggleUnit = (): void => {
    setIsCelsius(!isCelsius);
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeatherData('New York');
  }, []);

  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="weather-icon-title">🌤️</span>
            Weather Dashboard
          </h1>
          <p className="app-subtitle">Real-time weather updates and forecasts</p>
        </div>
      </header>

      {/* Search Section */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a city..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !searchInput.trim()}
          >
            {loading ? '🔄' : '🔍'} Search
          </button>
        </form>

        {/* Temperature Unit Toggle */}
        <button 
          onClick={toggleUnit} 
          className="unit-toggle"
          title="Toggle temperature unit"
        >
          {isCelsius ? '°C' : '°F'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {/* Current Weather Section */}
      {!loading && currentWeather && (
        <div className="current-weather">
          <div className="weather-header">
            <h2 className="city-name">
              {currentWeather.city}, {currentWeather.country}
            </h2>
            <p className="current-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="weather-main">
            <div className="weather-icon-large">
              {getWeatherIcon(currentWeather.condition)}
            </div>
            <div className="temperature-display">
              <span className="temp-value">
                {displayTemp(currentWeather.temperature)}
              </span>
              <span className="temp-unit">{getTempUnit()}</span>
            </div>
            <p className="weather-condition">{currentWeather.condition}</p>
            <p className="feels-like">
              Feels like {displayTemp(currentWeather.feelsLike)}{getTempUnit()}
            </p>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <div className="detail-info">
                <p className="detail-label">Humidity</p>
                <p className="detail-value">{currentWeather.humidity}%</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💨</span>
              <div className="detail-info">
                <p className="detail-label">Wind Speed</p>
                <p className="detail-value">{currentWeather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast Section */}
      {!loading && forecast.length > 0 && (
        <div className="forecast-section">
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p className="forecast-date">{day.date}</p>
                <div className="forecast-icon">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className="forecast-condition">{day.condition}</p>
                <div className="forecast-temps">
                  <span className="temp-max">
                    {displayTemp(day.tempMax)}{getTempUnit()}
                  </span>
                  <span className="temp-separator">/</span>
                  <span className="temp-min">
                    {displayTemp(day.tempMin)}{getTempUnit()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Built with React 18 + TypeScript + Vite 6</p>
        <p className="footer-note">
          Note: Using mock data for demonstration. Integrate with a real weather API for production.
        </p>
      </footer>
    </div>
  )
}

export default App