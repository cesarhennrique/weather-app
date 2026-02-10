/**
 * App simples de clima (Open-Meteo)
 * - Recebe nome da cidade
 * - Busca latitude/longitude (Geocoding)
 * - Busca clima atual (current_weather)
 * - Retorna um objeto JSON com cidade, temperatura (°C) e descrição
 * - Trata erros: cidade inválida, cidade não encontrada, falhas da API e rede
 */

function getWeatherDescription(code) {
  const descriptions = {
    0: "Céu limpo",
    1: "Predominantemente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com gelo",
    51: "Garoa fraca",
    53: "Garoa moderada",
    55: "Garoa intensa",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Pancadas de chuva fracas",
    81: "Pancadas de chuva moderadas",
    82: "Pancadas de chuva fortes"
  };

  return descriptions[code] || "Condição climática desconhecida";
}

async function getWeatherByCity(cityName) {
  try {
    // 0) Validar entrada
    if (!cityName || cityName.trim() === "") {
      throw new Error("Nome da cidade inválido. Digite um nome válido.");
    }

    // 1) Geocoding: obter latitude/longitude
    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}` +
      `&count=1&language=pt&format=json`;

    let geoResponse;
    try {
      geoResponse = await fetch(geoUrl);
    } catch {
      throw new Error("Problema de rede ao acessar o serviço de geocodificação.");
    }

    if (!geoResponse.ok) {
      throw new Error(`Falha na API de geocodificação. Status: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Cidade não encontrada. Verifique o nome e tente novamente.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2) Clima atual: buscar current_weather
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
      `&longitude=${longitude}&current_weather=true`;

    let weatherResponse;
    try {
      weatherResponse = await fetch(weatherUrl);
    } catch {
      throw new Error("Problema de rede ao acessar o serviço de clima.");
    }

    if (!weatherResponse.ok) {
      throw new Error(`Falha na API de clima. Status: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      throw new Error("A API não retornou dados atuais do clima (current_weather).");
    }

    const temperatureC = weatherData.current_weather.temperature;
    const weatherCode = weatherData.current_weather.weathercode;

    // 3) Retornar objeto JSON final
    return {
      city: country ? `${name} (${country})` : name,
      temperatureC, // número (ex: 28.4)
      description: getWeatherDescription(weatherCode)
    };
  } catch (error) {
    return {
      error: true,
      message: error.message
    };
  }
}

// =====================
// Exemplo de uso no Node
// =====================

// Troque a cidade aqui:
(async () => {
  const result = await getWeatherByCity("Recife");

  if (result.error) {
    console.error("❌ Erro:", result.message);
  } else {
    console.log("✅ Resultado:", result);
  }
})();
