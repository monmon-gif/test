document.getElementById('getWeather').onclick = () => {
  // 緯度経度を取得
  const latitude = document.getElementById('latitude').value.trim();
  const longitude = document.getElementById('longitude').value.trim();

  // 入力チェック
  if (!latitude || !longitude) {
    alert("緯度と経度を入力してください");
    return; // 入力がない場合は処理を止める
  }

  document.getElementById('weather').innerHTML = `<p>☁️ 天気を取得中...</p>`;

  // API呼び出し
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) {
        document.getElementById('weather').innerHTML = "<p>天気情報が取得できませんでした</p>";
        return;
      }
      const body = document.body;
      const weather = data.current_weather;
      const weatherType = getWeatherType(weather.weathercode);
      body.classList.remove("sunny", "cloudy", "rain", "snow", "nomal");
      body.classList.add(weatherType);
      const icon = getWeatherIcon(weatherType);

      const advice = getClothingAdvice(weather.temperature, weather.windspeed);
      document.getElementById('weather').innerHTML =
        `<p style="font-size:40px">${icon}</p>
        <p>気温: ${weather.temperature}°C</p>
         <p>風速: ${weather.windspeed} km/h</p>
         <p>着替えのアドバイス: ${advice}</p>`;
    })
    .catch(err => {
      console.error(err);
      document.getElementById('weather').innerHTML = "<p>天気情報の取得中にエラーが発生しました</p>";
    });
};

document.getElementById("search").onclick = () => {
    const address = encodeURIComponent(document.getElementById("address").value);
    if(!address) {
    alert("住所を入力してください");
    return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
    .then(res => res.json())
    .then(data => {
        const resultDiv = document.getElementById("result");
        if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        resultDiv.innerHTML = `
            <p>住所: ${display_name}</p>
            <p>緯度: ${lat}</p>
            <p>経度: ${lon}</p>
        `;
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;
        } else {
        resultDiv.innerHTML = "住所が見つかりませんでした";
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("result").innerText = "検索中にエラーが発生しました";
    });
};

function getClothingAdvice(temperature, windspeed) {
    let advice = "";
    if(temperature >= 25){
        advice = "半袖でOK！";
    } else if(temperature >= 15 && temperature < 25){
        advice = "長袖がいいかも？！。";
    } else if (temperature < 10){
        advice = "コートがあるといいね";
    } else {
        advice = "ダウン着ないと！";
    }
    if(windspeed >= 15){
        advice += " 風が強いから防風対策も忘れずに！";
    }
    return advice;
}

function getWeatherType(weathercode) {
    if(weathercode === 0){
        return "sunny";
    } else if(weathercode >= 1 && weathercode <= 3){
        return "cloudy";
    }  else if(weathercode >= 61 && weathercode <= 67){
        return "rain";
    } else if(weathercode >= 71 && weathercode <= 77){
        return "snow";
    } else {
        return "nomal";
    }
};

function getWeatherIcon(type) {
  if (type === "sunny") return "☀️";
  if (type === "cloudy") return "☁️";
  if (type === "rain") return "🌧️";
  if (type === "snow") return "❄️";
  return "🌤️";
}