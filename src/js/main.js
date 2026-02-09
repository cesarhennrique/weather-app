async function getTemperatureByCity(city) {
  try {
    // 1️⃣ Buscar latitude e longitude da cidade
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      console.log("Cidade não encontrada.");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Buscar clima usando lat/lon
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const weatherData = await weatherResponse.json();

    const temperature = weatherData.current_weather.temperature;

    console.log(`🌍 Cidade: ${name} (${country})`);
    console.log(`🌡️ Temperatura atual: ${temperature}°C`);
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
  }
}

// Exemplo de uso
getTemperatureByCity("Fortaleza");
