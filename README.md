# The weather app to end all weather apps
*Just kidding, but it does look nice.*

## What is this?
This is a web app made using React+Vite and a couple of libraries (Lucide React, Tailwind, Axios, react-hot-toast) . It uses the OpenWeather API and the Unsplash API to fetch the current weather data of just about every location in the world, and alongside it, it tries to fetch an image for said place from Unsplash's database.

The app shows you the location and the flag of the country it is in, the temperature in Celsius, Fahrenheit and Kelvin (you can change it at will by clicking the temperature container), the current weather (in text and as an icon), humidity, wind speed (in Imperial and Metric units) and direction, and the time of sunrise and sunset (12 and 24-hour format, can also change at will by clicking their respective containers). The app has various animations, including (stolen) animations for rainfall, snow and thunder, depending on the weather of the selected location.

It is worth nothing that the app was not done with responsive design in mind, so... uh... it's just not gonna look well if you aren't on fullscreen (TODO: implement responsiveness). The logic for loading the Unsplash background images is a bit messy too, so that also needs a bit of tweaking, but it generally works just fine. This is merely something done for practice, so it isn't intended to be perfect.
![Web App Image](https://github.com/user-attachments/assets/f5ea3624-1f7e-435d-a3c1-a8a731195c18)

## Can I use it?
Yes, you can use it in real time by clicking the big text below:

### <a href="https://the-vb6enjoyer-weather-app.onrender.com/">CLICK ME!!!</a>
