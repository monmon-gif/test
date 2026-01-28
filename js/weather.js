document.getElementById('getWeather').onclick = () => {
  // 緯度経度を取得
  const latitude = document.getElementById('latitude').value.trim();
  const longitude = document.getElementById('longitude').value.trim();

  // 入力チェック
  if (!latitude || !longitude) {
    alert("緯度と経度を入力してください");
    return; // 入力がない場合は処理を止める
  }

  // API呼び出し
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) {
        document.getElementById('weather').innerHTML = "<p>天気情報が取得できませんでした</p>";
        return;
      }

      const weather = data.current_weather;
      document.getElementById('weather').innerHTML =
        `<p>気温: ${weather.temperature}°C</p>
         <p>風速: ${weather.windspeed} km/h</p>
         <p>天気コード: ${weather.weathercode}</p>`;
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
        } else {
        resultDiv.innerHTML = "住所が見つかりませんでした";
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("result").innerText = "検索中にエラーが発生しました";
    });
};
