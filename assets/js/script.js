//on click user input as variable
$("#search").on("click", function () {
  var cityInput = $("#city").val().trim();

  //create and display city name and date
  var currentHeaderEl = $("#current-header");
  currentHeaderEl.text("");
  var cityNameDateEl = $("<h2>").text(
    cityInput + " (" + moment().format("MM[/]DD[/]YY") + ")"
  );
  currentHeaderEl.append(cityNameDateEl);

  //create a saved city button
  var savedCitiesContainer = $("#saved-cities");
  var savedCity = $("<button>").text(cityInput);
  savedCitiesContainer.append(savedCity);
  //----------------------------------------------------------------------TODO dont execute above code if the button already exists

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
        var currentData = data.current;
        var dailyData = data.daily;
        displayWeather(currentData, dailyData);
      });

    function displayWeather(currentData, dailyData) {
      //-----------------------------------------------------------------------------TODO use cloud info to choose and display icon
      //currentCloudEl = $('<li>').text('' + currentData.clouds);
      //currentInfoEl.append(currentCloudEl);

      //create children for the #current-info ul
      var currentInfoEl = $("#current-info");
      currentInfoEl.text("");
      var currentTempEl = $("<li>").text("Temperature: " + currentData.temp);
      currentInfoEl.append(currentTempEl);
      var currentHumidityEl = $("<li>").text(
        "Humidity: " + currentData.humidity
      );
      currentInfoEl.append(currentHumidityEl);
      var currentWindEl = $("<li>").text("Wind: " + currentData.wind_speed);
      currentInfoEl.append(currentWindEl);
      var currentUviEl = $("<li>").text("UV Index: " + currentData.uvi);
      currentInfoEl.append(currentUviEl);
      //-------------------------------------------------------------------------------TODO change uvi background to be color coded

      //create the header for the future container
      $("#future-header").text("5-Day Forecast");

      //console.log(dailyData); //skip 0, for each date, clouds, temp, wind_speed, humidity
      //create cards for the next 5 days
      for (var i = 1; i < 6; i++) {
        dayData = dailyData[i];
        var cardContainerEl = $("#card-container");
        var dayCardEl = $("<div>").addClass("card");
        //add title for date with class card-title
        var cardTitleEl = $("<h4>")
          .addClass("card-title")
          .text(moment().add(i, "days").format("MM[/]DD[/]YY"));
        dayCardEl.append(cardTitleEl);
        //---------------------------------------------------------------------------------------------TODO add icon based on cloud
        //add card text for temp with class card-text
        var dayTempEl = $("<p>")
          .addClass("card-text")
          .text("Temp: " + dayData.temp.day);
        dayCardEl.append(dayTempEl);
        //add card text for wind_speed with class card-text
        var dayWindEl = $("<p>")
          .addClass("card-text")
          .text("Wind: " + dayData.wind_speed);
        dayCardEl.append(dayWindEl);
        //add card text for humidity with class card-text
        var dayHumidityEl = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + dayData.humidity);
        dayCardEl.append(dayHumidityEl);
        //append the whole card
        cardContainerEl.append(dayCardEl);
      }
    }
  }
});
