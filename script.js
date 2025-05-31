document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-box");
    const weatherInfo = document.getElementById("weather-info");
    const settingsButton = document.querySelector(".settings-icon");

    // Загрузка предыдущего поискового запроса из localStorage
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
        input.value = savedQuery; // Заполняем поле поиска ранее сохранённым запросом
    }

    // Поиск
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query !== "") {
            localStorage.setItem("searchQuery", query); // Сохраняем запрос в localStorage
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    });

    // Открытие настроек
    settingsButton.addEventListener("click", () => {
        console.log("Открываю настройки...");
        window.location.href = "settings.html";
    });

    // Погода
    async function fetchWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                const apiKey = 'cdde843f642f9019bb5d3fb524a173b2';
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    const city = data.name;
                    const temp = Math.round(data.main.temp);
                    const description = data.weather[0].description;
                    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                    weatherInfo.innerHTML = `
                        <img src="${icon}" alt="Weather Icon" width="50">
                        <p><strong>${city}</strong>: ${temp}°C, ${description}</p>
                    `;

                    // Сохраняем информацию о погоде в localStorage
                    localStorage.setItem("weatherInfo", JSON.stringify({
                        city,
                        temp,
                        description,
                        icon
                    }));
                } catch (error) {
                    weatherInfo.innerHTML = "Error loading weather";
                }
            });
        } else {
            weatherInfo.innerHTML = "Geolocation not supported";
        }
    }

    // Загружаем сохранённую информацию о погоде, если она есть
    const savedWeather = localStorage.getItem("weatherInfo");
    if (savedWeather) {
        const weatherData = JSON.parse(savedWeather);
        weatherInfo.innerHTML = `
            <img src="${weatherData.icon}" alt="Weather Icon" width="50">
            <p><strong>${weatherData.city}</strong>: ${weatherData.temp}°C, ${weatherData.description}</p>
        `;
    } else {
        fetchWeather(); // Если нет сохранённой информации, загружаем текущую погоду
    }
    
    
});
