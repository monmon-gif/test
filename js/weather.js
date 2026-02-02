// ================================
// 天気取得
// ================================
document.getElementById("getWeather").onclick = () => {
  const latitude = document.getElementById("latitude").value.trim();
  const longitude = document.getElementById("longitude").value.trim();
  const dateStr = document.getElementById("date").value;   // ← 文字列
  const timeStr = document.getElementById("time").value;   // ← 文字列
  const weatherEl = document.getElementById("weather");
  const address = document.getElementById("address").value.trim();

  if (!latitude || !longitude) {
    alert("緯度と経度を入力してください");
    return;
  }

  weatherEl.innerHTML = "<p>☀️天気を取得中...⛅</p>";

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m&timezone=Asia%2FTokyo&start_date=${dateStr}&end_date=${dateStr}`
  )
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) {
        weatherEl.innerHTML = "<p>天気情報が取得できませんでした</p>";
        return;
      }

      const weather = data.current_weather;
      const weatherType = getWeatherType(weather.weathercode);

      // ✅ 15時などのhourlyを取る（UTCにしない）
      const target = `${dateStr}T${timeStr}`;
      const hourlyIndex = data.hourly.time.indexOf(target);
      if (hourlyIndex !== -1) {
        weather.temperature = data.hourly.temperature_2m[hourlyIndex];
        weather.windspeed = data.hourly.windspeed_10m[hourlyIndex];
      }

      document.body.classList.remove("sunny", "cloudy", "rain", "snow", "nomal");
      document.body.classList.add(weatherType);

      const icon = getWeatherIcon(weatherType);
      const advice = getClothingAdvice(weather.temperature, weather.windspeed);

      // ✅ 表示用：Dateオブジェクトに変換してから getMonth/getDay/getHours
      const selected = new Date(`${dateStr}T${timeStr}`);
      const weeks = ["日", "月", "火", "水", "木", "金", "土"];
      const month = selected.getMonth() + 1;
      const day = selected.getDate();
      const week = weeks[selected.getDay()];
      const hour = selected.getHours();
      const accuracy = getAccuracy(day);
      weatherEl.innerHTML = `
        <p style="font-size:40px">${icon}</p>
        <p>${address} ${month}月${day}日(${week}) ${hour}時<br>の天気情報</p>
        <p>気温: ${weather.temperature}°C</p>
        <p>風速: ${weather.windspeed} km/h</p>
        <p>天気の精度: ${accuracy}</p>
        <p>着替えのアドバイス: <br>${advice}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      weatherEl.innerHTML = "<p>天気情報の取得中にエラーが発生しました</p>";
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

function getAccuracy(day) {
  const localDayNow = new Date().getDate();
  const gap = day - localDayNow;
  if (gap <= 1) return "◎　!(^^)!";
  if (gap <= 3) return "〇　(^_^)";
  if (gap <= 7) return "△　(・・;)";
  if (gap <= 8) return "✕　( ;∀;)";
  return "参考程度に..(*_*))";
}

// 0埋め
const pad2 = (n) => String(n).padStart(2, "0");

// 日付 (今日〜N日後)
function buildDateOptions(days = 7) {
  const dateSelect = document.getElementById("date");
  dateSelect.innerHTML = "";

  const today = new Date();
  for (let i = 0; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    const value = `${y}-${m}-${day}`;

    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value; // 表示も同じでOK
    dateSelect.appendChild(opt);
  }
}

// 時間 (00:00〜23:00)
function buildTimeOptions() {
  const timeSelect = document.getElementById("time");
  timeSelect.innerHTML = "";

  for (let h = 0; h < 24; h++) {
    const value = `${pad2(h)}:00`;
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    timeSelect.appendChild(opt);
  }
}

// 初期化
buildDateOptions(7);  // 7日先まで（必要なら16に）
buildTimeOptions();

