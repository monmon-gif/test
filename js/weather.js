// ================================
// 天気取得
// ================================
document.getElementById("getWeather").onclick = () => {
  const latitude = document.getElementById("latitude").value.trim();
  const longitude = document.getElementById("longitude").value.trim();
  const weatherEl = document.getElementById("weather");

  if (!latitude || !longitude) {
    alert("緯度と経度を入力してください");
    return;
  }

  weatherEl.innerHTML = "<p>☁️ 天気を取得中...</p>";

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  )
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) {
        weatherEl.innerHTML = "<p>天気情報が取得できませんでした</p>";
        return;
      }

      const weather = data.current_weather;
      const weatherType = getWeatherType(weather.weathercode);

      document.body.classList.remove(
        "sunny",
        "cloudy",
        "rain",
        "snow",
        "nomal"
      );
      document.body.classList.add(weatherType);

      const icon = getWeatherIcon(weatherType);
      const advice = getClothingAdvice(
        weather.temperature,
        weather.windspeed
      );

      weatherEl.innerHTML = `
        <p style="font-size:40px">${icon}</p>
        <p>気温: ${weather.temperature}°C</p>
        <p>風速: ${weather.windspeed} km/h</p>
        <p>着替えのアドバイス: ${advice}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      weatherEl.innerHTML =
        "<p>天気情報の取得中にエラーが発生しました</p>";
    });
};

// ================================
// 住所検索 → 緯度経度取得
// ================================
document.getElementById("search").onclick = () => {
  const addressInput = document.getElementById("address").value.trim();
  const resultEl = document.getElementById("result");

  if (!addressInput) {
    alert("住所を入力してください");
    return;
  }

  const address = encodeURIComponent(addressInput);

  fetch(
    `https://nominatim.openstreetmap.org/search?q=${address}&format=json`
  )
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        resultEl.innerText = "住所が見つかりませんでした";
        return;
      }

      const { lat, lon, display_name } = data[0];

      resultEl.innerHTML = ""; // 中身を一旦クリア

      const addressP = document.createElement("p");
      addressP.className = "address";
      addressP.textContent = `住所: ${display_name}`;

      const latP = document.createElement("p");
      latP.className = "lat";
      latP.textContent = `緯度: ${lat}`;

      const lonP = document.createElement("p");
      lonP.className = "lon";
      lonP.textContent = `経度: ${lon}`;

      resultEl.append(addressP, latP, lonP);

      document.getElementById("latitude").value = lat;
      document.getElementById("longitude").value = lon;
    })
    .catch(err => {
      console.error(err);
      resultEl.innerText = "検索中にエラーが発生しました";
    });
};

// ================================
// 着替えアドバイス
// ================================
function getClothingAdvice(temperature, windspeed) {
  let advice = "";

  if (temperature >= 25) {
    advice = "半袖でOK！";
  } else if (temperature >= 15) {
    advice = "長袖がいいかも？！";
  } else if (temperature >= 10) {
    advice = "上着あると安心！";
  } else {
    advice = "コート（ダウン）あるといいね";
  }

  if (windspeed >= 15) {
    advice += " 風が強いから防風対策も忘れずに！";
  }

  return advice;
}

// ================================
// 天気タイプ判定
// ================================
function getWeatherType(weathercode) {
  if (weathercode === 0) return "sunny";
  if (weathercode >= 1 && weathercode <= 3) return "cloudy";
  if (weathercode >= 61 && weathercode <= 67) return "rain";
  if (weathercode >= 71 && weathercode <= 77) return "snow";
  return "nomal";
}

// ================================
// 天気アイコン
// ================================
function getWeatherIcon(type) {
  if (type === "sunny") return "☀️";
  if (type === "cloudy") return "☁️";
  if (type === "rain") return "🌧️";
  if (type === "snow") return "❄️";
  return "🌤️";
}
