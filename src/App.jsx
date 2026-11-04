import React, { useEffect, useState } from 'react';
import './App.css'
import RainEffect from './components/Rain/RainEffect';
import WeatherContainer from './components/WeatherContainer/WeatherContainer'
import Snowflakes from './components/Snowflakes/Snowflakes';
import Thunder from './components/Thunder/Thunder';
import Credits from './components/Credits/Credits';

function App() {
  const [weather, setWeather] = useState(0);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const overlay = document.getElementById("overlay");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const position = `${x * 33}% ${y * 66}%`;

      document.body.style.backgroundPosition = position;
      if (overlay) overlay.style.backgroundPosition = position;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentWeather = (id) => {
    setWeather(id);
  }

  return (
    <React.Fragment>
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
      <Credits />
    </React.Fragment>
  )
}

export default App
