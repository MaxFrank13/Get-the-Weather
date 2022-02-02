# Get-my-Weather
An application that uses the OpenWeather API to generate a forecast based on the user's location.

## Description

This is a basic weather application used to find the weekly forecast of a given city with the employment of the Open Weather API. Each city is pushed to an array to save this app's information in local storage. When the page loads, it will check to see if there is a key "WeatherApp" in your browser's local storage. If that key exists, it's content will be rendered to the page as a weather forecast.

[Weather App](https://maxfrank13.github.io/Get-the-Weather/)

![Picture of Weather App](https://github.com/MaxFrank13/Get-the-Weather/blob/main/assets/app-photo.PNG)

## What's Happening in the Code

### HTML

Establish general structure of form and provide an empty `div` in which to render a forecast. DayJS is linked as well as a mini CSS library for providing clay-like styles with ease.

### CSS

A color pallette is provided in variables that resemble a heat map. "Hotter" colors are pink and "colder" colors are blue with various shades of purple in between. These are used to color code each forecast entry based on its temperature. Basic format using mostly vanilla CSS and the Clay.css mini-library. One media query is needed to ensure responsiveness on smaller screens.

### JavaScript

On page load, the JS checks to see if "WeatherApp" is a key in the user's local storage. If it finds "WeatherApp", it will use the value of that key to make a request to the Open Weather API and render the results of that request to the page as forecast cards. The storage is reset to those forecast values, rather than the values from a previous session.

#### Rough breakdown 
1. In order to get a forecast, a request is made to the Open Weather API
    - there is a GeoCoding API available through Open Weather that takes in a city name (with the option for country code and state codes for the US) and returns latitude/longitude of that input
    - the One Call API (also within Open Weather) requires latitude and longitude as parameters when retrieving the forecast of a given location
    - these two calls are chained together using two seperate fetch calls
        - the second one only fires after the first one has been returned using `.then` and nesting the call as its own function
    - One Call then returns an array of information regarding that location
        - the current and daily keys are accessed inside the returned object
        - together these keys provide a forecast for the entire upcoming week
2. Using the returned object from One Call, a full-week forecast is rendered to the page
    - by constructing a new object from the response for each day, the data becomes easier to work with
    - each object is passed through a `createForecast()` function that uses the objects values as reference when creating elements to render to the DOM
    - these objects are added to an array and then local storage is set using that array
3. Styling is applied through JS by adding a class that corresponds to the temperature of that day
    - i.e. if the day's temperature is below 10 degrees Fahrenheit, the card will be styled with a sky blue gradient
        - in contrast, on days that are above 90 degrees the cards are styled with a hot-pink gradient
    - the same concept is used to change the color of the UV-index reading depending on its value
    


