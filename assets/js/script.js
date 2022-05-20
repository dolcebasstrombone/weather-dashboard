//on click user input as variable
$("#search").on("click", function () {
  var cityInput = $("#city").val().trim();

  //TODO use cityInput for saved button and current forecast h2
  //same function use moment or whats here to slap the date on there

  //get lon and lat of city, pass it on
  var requestLocationUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityInput +
    "&limit=1&appid=cb9916baff495c48795f434351381868";
  fetch(requestLocationUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeatherInfo(lat, lon);
    });

  function getWeatherInfo(lat, lon) {
    var requestUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly&appid=cb9916baff495c48795f434351381868";
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var currentWeather = data.current; //need: temp, clouds, humidity, wind_speed, uvi
        var dailyWeather = data.daily; //skip 0, for each date, clouds, temp, wind_speed, humidity
        console.log(currentWeather, dailyWeather);
      });
  }
});
