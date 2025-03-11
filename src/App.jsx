import { useState } from 'react';
import './App.css'
import RainEffect from './components/Rain/RainEffect';
import WeatherContainer from './components/WeatherContainer/WeatherContainer'
import Snowflakes from './components/Snowflakes/Snowflakes';
import Thunder from './components/Thunder/Thunder';

function App() {
  const [weather, setWeather] = useState(0);

  // Parallax effect
  document.addEventListener('mousemove', function (e) {
    const body = document.body;
    const overlay = document.getElementById("overlay");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    body.style.backgroundPosition = `${x * 33}% ${y * 66}%`;
    if (overlay) overlay.style.backgroundPosition = `${x * 33}% ${y * 66}%`;
  });

  const currentWeather = (id) => {
    setWeather(id);
  }

  return (
    <main>
      <WeatherContainer currentWeather={currentWeather} />
      <div id="overlay" style={{ opacity: 0 }}></div>
      {weather >= 200 && weather <= 531 ?
        <>
          <RainEffect />
          {weather >= 200 && weather <= 232 && <Thunder />}
        </>
        : weather >= 600 && weather <= 622 ?
          <Snowflakes />
          : ""}
    </main>
  )
}

export default App
