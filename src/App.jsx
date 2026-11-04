import React, { useEffect, useState } from 'react';
import './App.css'
import RainEffect from './components/Rain/RainEffect';
import WeatherContainer from './components/WeatherContainer/WeatherContainer'
import Snowflakes from './components/Snowflakes/Snowflakes';
import Thunder from './components/Thunder/Thunder';
import Credits from './components/Credits/Credits';
import Background from './components/Background/Background';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import kyotoBackground from './assets/Kyoto.jpeg';

function App() {
  const [weather, setWeather] = useState(0);
  const [backgroundUrl, setBackgroundUrl] = useState(kyotoBackground);
  const reduceMotion = usePrefersReducedMotion();

  // Parallax effect
  useEffect(() => {
    if (reduceMotion) return;

    // Pointer position from -1 to 1 on each axis; Background.css shifts the
    // photo slightly against it
    const root = document.documentElement;
    const handleMouseMove = (e) => {
      root.style.setProperty('--parallax-x', (e.clientX / window.innerWidth) * 2 - 1);
      root.style.setProperty('--parallax-y', (e.clientY / window.innerHeight) * 2 - 1);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);

      // Recenter the background if motion gets turned off mid-session
      root.style.removeProperty('--parallax-x');
      root.style.removeProperty('--parallax-y');
    };
  }, [reduceMotion]);

  const currentWeather = (id) => {
    setWeather(id);
  }

  return (
    <React.Fragment>
      <main>
        <Background url={backgroundUrl} />
        <WeatherContainer currentWeather={currentWeather} onBackgroundChange={setBackgroundUrl} />
        {/* Weather effects are skipped when the user asks for reduced motion */}
        {reduceMotion ? "" : weather >= 200 && weather <= 531 ?
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
