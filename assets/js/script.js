//on click user input as variable
$("#search").on("click", searchButton);
$(".saved-city").on("click", searchButton);

function searchButton() {
  var cityInput = $("#city").val().trim() || $(".saved-city").val(); //------------------------------------TODO make this work lol
  //-------------------------------------------------------------------------------------------TODO save city name to local storage
  $("#city").val("");

  //create and display city name and date
  var currentForecastEl = $("#current-forecast");
  currentForecastEl.text("");
  var currentCardEl = $('<div>').addClass('card');
  var currentCardBodyEl = $('<div>').addClass('card-body');
  var cityNameDateEl = $("<h2>").addClass('card-title').text(
    cityInput + " (" + moment().format("MM[/]DD[/]YY") + ")"
  );
  currentCardBodyEl.append(cityNameDateEl);
  currentCardEl.append(currentCardBodyEl);
  currentForecastEl.append(currentCardEl);

  //create a saved city button
  var savedCitiesContainer = $("#saved-cities");
  var savedCity = $("<button>").addClass("saved-city").text(cityInput);
  savedCitiesContainer.append(savedCity);
  //-----------------------------------------------------------------------------------------TODO create buttons from local storage
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

      //create children for current info card
      var cardBodyEl = $('.card-body');
      var currentTempEl = $("<p>").text("Temperature: " + currentData.temp);
      cardBodyEl.append(currentTempEl);
      var currentHumidityEl = $("<p>").text(
        "Humidity: " + currentData.humidity
      );
      cardBodyEl.append(currentHumidityEl);
      var currentWindEl = $("<p>").text("Wind: " + currentData.wind_speed);
      cardBodyEl.append(currentWindEl);
      var currentUviEl = $("<p>").text("UV Index: " + currentData.uvi);
      cardBodyEl.append(currentUviEl);
      //-------------------------------------------------------------------------------TODO change uvi background to be color coded

      //create the header for the future container
      $("#future-header").text("5-Day Forecast:");

      //empty card container
      $("#card-container").text("");

      //console.log(dailyData); //skip 0, for each date, clouds, temp, wind_speed, humidity
      //create cards for the next 5 days
      for (var i = 1; i < 6; i++) {
        dayData = dailyData[i];
        var cardContainerEl = $("#card-container");
        var dayCardEl = $("<div>").addClass("card");
        var dayCardBodyEl = $("<div>").addClass("card-body");
        //add title for date with class card-title
        var cardTitleEl = $("<h4>")
          .addClass("card-title")
          .text(moment().add(i, "days").format("MM[/]DD[/]YY"));
        dayCardBodyEl.append(cardTitleEl);
        //---------------------------------------------------------------------------------------------TODO add icon based on cloud
        //add card text for temp with class card-text
        var dayTempEl = $("<p>")
          .addClass("card-text")
          .text("Temp: " + dayData.temp.day);
        dayCardBodyEl.append(dayTempEl);
        //add card text for wind_speed with class card-text
        var dayWindEl = $("<p>")
          .addClass("card-text")
          .text("Wind: " + dayData.wind_speed);
        dayCardBodyEl.append(dayWindEl);
        //add card text for humidity with class card-text
        var dayHumidityEl = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + dayData.humidity);
        dayCardBodyEl.append(dayHumidityEl);
        //append the whole card
        dayCardEl.append(dayCardBodyEl);
        cardContainerEl.append(dayCardEl);
      }
    }
  }
}
