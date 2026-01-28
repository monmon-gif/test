document.getElementById('getWeather').onclick = () => {
  // 東京の緯度経度
  const latitude = 35.682839;
  const longitude = 139.759455;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const weather = data.current_weather;
      console.log(weather);
      document.getElementById('weather').innerHTML =
        `<p>気温: ${weather.temperature}°C</p>
         <p>風速: ${weather.windspeed} km/h</p>
         <p>天気コード: ${weather.weathercode}</p>`;
    });
};
