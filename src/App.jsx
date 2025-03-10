import './App.css'
import WeatherContainer from './components/WeatherContainer/WeatherContainer'

function App() {

  // Parallax effect
  document.addEventListener('mousemove', function (e) {
    const body = document.body;
    const overlay = document.getElementById("overlay");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    body.style.backgroundPosition = `${x * 33}% ${y * 66}%`;
    overlay.style.backgroundPosition = `${x * 33}% ${y * 66}%`;
  });

  return (
    <main>
      <div id="overlay" style={{ opacity: 0 }}></div>
      <WeatherContainer />
    </main>
  )
}

export default App
