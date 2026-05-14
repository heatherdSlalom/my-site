const sections = document.querySelectorAll('.fade-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
sections.forEach(section => observer.observe(section));

const emojiMap = {
  0: '☀️',
  1: '⛅',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌨️',
  67: '🌨️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '❄️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
};

const labelMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail'
};

const weatherEmoji = document.getElementById('weather-emoji');
const weatherTemp = document.getElementById('weather-temp');
const weatherDescription = document.getElementById('weather-description');
const weatherLocation = document.getElementById('weather-location');

function setWeatherMessage(temp, code, coords) {
  weatherEmoji.textContent = emojiMap[code] || '🌤️';
  weatherTemp.textContent = `${Math.round(temp)}°F`;
  weatherDescription.textContent = labelMap[code] || 'Clear conditions';
  weatherLocation.textContent = `Lat ${coords.lat.toFixed(2)}, Lon ${coords.lon.toFixed(2)}`;
}

function setWeatherError(message) {
  weatherEmoji.textContent = '⚠️';
  weatherTemp.textContent = '--°F';
  weatherDescription.textContent = message;
  weatherLocation.textContent = '';
}

function fetchWeather(lat, lon) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data && data.current_weather) {
        setWeatherMessage(data.current_weather.temperature, data.current_weather.weathercode, { lat, lon });
      } else {
        setWeatherError('Weather data unavailable.');
      }
    })
    .catch(() => setWeatherError('Unable to fetch weather right now.'));
}

function initWeather() {
  const fallback = { lat: 47.2701, lon: -122.5360, label: 'University Place, WA' };

  if (!navigator.geolocation) {
    weatherDescription.textContent = 'Geolocation unavailable; showing University Place, WA fallback.';
    weatherLocation.textContent = fallback.label;
    fetchWeather(fallback.lat, fallback.lon);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      weatherLocation.textContent = `Loading weather for ${latitude.toFixed(2)}, ${longitude.toFixed(2)}...`;
      fetchWeather(latitude, longitude);
    },
    error => {
      if (error.code === error.PERMISSION_DENIED) {
        weatherDescription.textContent = 'Enable location to see your weather. Showing University Place, WA fallback.';
        weatherLocation.textContent = fallback.label;
        fetchWeather(fallback.lat, fallback.lon);
      } else {
        weatherDescription.textContent = 'Unable to determine location; showing University Place, WA fallback.';
        weatherLocation.textContent = fallback.label;
        fetchWeather(fallback.lat, fallback.lon);
      }
    },
    { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 }
  );
}

initWeather();
