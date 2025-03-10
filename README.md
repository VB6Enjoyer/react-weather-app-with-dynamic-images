![imagen](https://github.com/user-attachments/assets/7c3f5b1c-5dc2-4d03-82a7-a8ef7cf66c8f)# The weather app to end all weather apps
*Just kidding, but it does look nice.*

## What is this?
This is a web app made using React+Vite, which also includes the Lucide React library. It uses the OpenWeather API and the Unsplash API to fetch the current weather data of just about every location in the world, and alongside it, it tries to fetch an image for said place from Unsplash's database.

The app shows you the location and the flag of the country it is in, the temperature in Celsius, Fahrenheit and Kelvin (you can change it at will by clicking the temperature system text), the current weather (in text and as an icon), humidity, wind speed (in Imperial and Metric units) and direction, and the time of sunrise and sunset (12 and 24-hour format, can also change at will by clicking the text).

It is worth nothing that the app was not done with responsive design in mind, so... uh... it's just not gonna look well if you aren't on fullscreen (TODO: implement responsiveness). The logic for loading the Unsplash background images is a bit messy too, so that also needs a bit of tweaking, but it generally works just fine. This is merely something done for practice, so it isn't intended to be perfect.
![Screenshot of the web app](https://i.imgur.com/sIdHINn.png)