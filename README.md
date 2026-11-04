# The weather app to end all weather apps
*Just kidding, but it does look nice.*

## What is this?
This is a web app made using React+Vite and a couple of libraries (Lucide React, Tailwind, Axios, react-hot-toast) . It uses the OpenWeather API and the Unsplash API to fetch the current weather data of just about every location in the world, and alongside it, it tries to fetch an image for said place from Unsplash's database.

The app shows you the location and the flag of the country it is in, its local time, the temperature in Celsius, Fahrenheit and Kelvin (you can change it at will by clicking the temperature container), the current weather (in text and as an icon), humidity, wind speed (in Imperial and Metric units) and direction, the time of sunrise and sunset (12 and 24-hour format, can also change at will by clicking their respective containers), and a forecast for the next 24 hours and 5 days. As you type, it suggests matching places (so you can tell Concordia, Entre Ríos from Concordia, Kansas), and it can also use your current location. Your unit choices and last searched place are remembered, and the URL can be shared to show someone the same place. The app has various animations, including borrowed animations for rainfall, snow and thunder (credited in the code), depending on the weather of the selected location, which are skipped if your system asks for reduced motion.

It works on phones as well as desktops, and can be used with a keyboard or a screen reader. This is merely something done for practice, so it isn't intended to be perfect.
![Web App Image](https://github.com/user-attachments/assets/f5ea3624-1f7e-435d-a3c1-a8a731195c18)

## Can I use it?
Yes, you can use it in real time by clicking the big text below:

### <a href="https://the-vb6enjoyer-weather-app.onrender.com/">CLICK ME!!!</a>

## Running it locally
You'll need Node.js 20 or newer, plus free API keys from [OpenWeather](https://home.openweathermap.org/api_keys) and [Unsplash](https://unsplash.com/oauth/applications).

```bash
npm install
cp .env.example .env   # then add your keys to .env
npm run dev
```

Other scripts:
- `npm test` runs the tests (`npm run test:watch` to rerun them on save)
- `npm run lint` checks the code with ESLint
- `npm run build` creates the production build in `dist/`

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), checked by a commit hook, and every pull request runs lint, tests and build in CI.
