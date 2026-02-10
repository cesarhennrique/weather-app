// =====================
// Theme toggle
// =====================
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

applyTheme(localStorage.getItem("theme") || root.getAttribute("data-theme") || "dark");

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

// =====================
// UI helpers
// =====================
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const alertBox = document.getElementById("alert");
const resultBox = document.getElementById("result");

const resultCity = document.getElementById("resultCity");
const resultDesc = document.getElementById("resultDesc");
const tempValue = document.getElementById("tempValue");
const windValue = document.getElementById("windValue");
const humValue = document.getElementById("humValue");

function showAlert(message, type = "ok") {
  alertBox.hidden = false;
  alertBox.className = `alert ${type}`;
  alertBox.textContent = message;
}

function hideAlert() {
  alertBox.hidden = true;
  alertBox.textContent = "";
  alertBox.className = "alert";
}

function showResult() {
  resultBox.hidden = false;
}

function hideResult() {
  resultBox.hidden = true;
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "Buscando..." : "Buscar";
}

// =====================
// Weather description (WMO codes)
// =====================
function weatherDescriptionFromCode(code) {
  const map = {
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
  return map[code] ?? "Condição não identificada";
}

// =====================
// Open-Meteo API calls
// =====================
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Falha na API (status ${res.status}).`);
  }
  return res.json();
}

async function getWeatherByCity(cityName) {
  const name = cityName?.trim();
  if (!name) throw new Error("Digite uma cidade válida.");

  // 1) Geocoding
  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}` +
    `&count=1&language=pt&format=json`;

  const geoData = await fetchJson(geoUrl);

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Cidade não encontrada. Tente adicionar o estado (ex: Recife, PE).");
  }

  const place = geoData.results[0];
  const lat = place.latitude;
  const lon = place.longitude;

  const displayName = [
    place.name,
    place.admin1 ? place.admin1 : null,
    place.country ? place.country : null
  ].filter(Boolean).join(", ");

  // 2) Weather (usando `current=` para pegar também umidade)
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&timezone=auto`;

  const weatherData = await fetchJson(weatherUrl);

  if (!weatherData.current) {
    throw new Error("Não foi possível obter os dados atuais do clima.");
  }

  return {
    city: displayName,
    temperatureC: weatherData.current.temperature_2m,
    windKmh: weatherData.current.wind_speed_10m,
    humidity: weatherData.current.relative_humidity_2m,
    description: weatherDescriptionFromCode(weatherData.current.weather_code)
  };
}

// =====================
// Form submit (click Buscar / Enter)
// =====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  hideAlert();
  hideResult();

  try {
    setLoading(true);

    const data = await getWeatherByCity(cityInput.value);

    // Render
    resultCity.textContent = data.city;
    resultDesc.textContent = data.description;

    tempValue.textContent = Math.round(data.temperatureC);
    windValue.textContent = Math.round(data.windKmh);
    humValue.textContent = Math.round(data.humidity);

    showResult();
    showAlert("Dados atualizados com sucesso ✅", "ok");
  } catch (err) {
    const msg =
      err instanceof TypeError
        ? "Problema de rede. Verifique sua internet e tente novamente."
        : err.message;

    showAlert(msg, "error");
  } finally {
    setLoading(false);
  }
});
