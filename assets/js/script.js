function init() {
  //get array to save names
  var savedCitiesObj = JSON.parse(localStorage.getItem("savedCitiesObj")) || [];
  savedCitiesObj.forEach(function (city) {
    //create a saved city button
    var savedCitiesContainer = $("#saved-cities");
    var savedCity = $("<button>")
      .addClass("saved-city")
      .attr("id", city)
      .text(city)
      .on("click", savedButtonClick);
    savedCitiesContainer.append(savedCity);
  });
}
init();

//listener on the search button
$("#search").on("click", searchButtonClick);

//check user input, pass on if acceptable
function searchButtonClick() {
  var cityInput = $("#city").val().trim();
  if (cityInput === "" || null) {
    var alertContainer = $("#alert").text("");
    var alertText = $("<p>").text("Please enter a city.");
    alertContainer.append(alertText);
  } else {
    fetchAndDisplayLocation(cityInput);
  }
}

//called from the listener on the saved buttons
function savedButtonClick() {
  var cityName = this.textContent;
  fetchAndDisplayLocation(cityName);
}

function fetchAndDisplayLocation(cityInput) {
  //clear input and alert text
  $("#city").val("");
  $("#alert").text("");

  //get lon and lat of city, pass it on
  var requestLocationUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityInput +
    "&limit=1&appid=cb9916baff495c48795f434351381868";

  fetch(requestLocationUrl)
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      alert("Error: Unable to connect");
    })
    .then(function (data) {
      if (data.length === 0) {
        var alertContainer = $("#alert").text("");
        var alertText = $("<p>").text("Please enter a city.");
        alertContainer.append(alertText);
      } else {
        var name = data[0].name;
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeatherInfo(lat, lon);
        cityNameHandler(name);
      }
    });

  function cityNameHandler(cityName) {
    //get array to save names
    var savedCitiesObj =
      JSON.parse(localStorage.getItem("savedCitiesObj")) || [];
    //filter out names that match what was inputted, to avoid duplicates
    savedCitiesObj = savedCitiesObj.filter(function (names) {
      return names !== cityName;
    });
    //push the inputted name and save to local storage
    savedCitiesObj.push(cityName);
    localStorage.setItem("savedCitiesObj", JSON.stringify(savedCitiesObj));
    //create and display city name and date
    var currentForecastEl = $("#current-forecast");
    currentForecastEl.text("");
    var currentCardEl = $("<div>").addClass("card");
    var currentCardBodyEl = $("<div>").addClass("card-body");
    var cityNameDateEl = $("<h2>")
      .addClass("card-title")
      .text(cityName + " (" + moment().format("MM[/]DD[/]YY") + ")");
    currentCardBodyEl.append(cityNameDateEl);
    currentCardEl.append(currentCardBodyEl);
    currentForecastEl.append(currentCardEl);
    //create a saved city button, avoiding duplicates
    var sameSavedCity = document.getElementById(cityName);
    if (sameSavedCity === null || undefined) {
      var savedCitiesContainer = $("#saved-cities");
      var savedCity = $("<button>")
        .addClass("saved-city")
        .attr("id", cityName)
        .text(cityName)
        .on("click", savedButtonClick);
      savedCitiesContainer.append(savedCity);
    } else {
      sameSavedCity.remove();
      var savedCitiesContainer = $("#saved-cities");
      var savedCity = $("<button>")
        .addClass("saved-city")
        .attr("id", cityName)
        .text(cityName)
        .on("click", savedButtonClick);
      savedCitiesContainer.append(savedCity);
    }
  }
}

function getWeatherInfo(lat, lon) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=minutely,hourly&appid=cb9916baff495c48795f434351381868";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var currentData = data.current;
      var dailyData = data.daily;
      displayWeather(currentData, dailyData);
    });
}

function displayWeather(currentData, dailyData) {
  //create children for current info card
  var cardBodyEl = $(".card-body");
  //create and append icon
  var iconCode = currentData.weather[0].icon;
  var iconLocation = "./assets/images/" + iconCode + ".png";
  var currentCloudEl = $("<img>")
    .addClass("current-icon")
    .attr("src", iconLocation);
  cardBodyEl.append(currentCloudEl);
  //create and append temperature
  var currentTempEl = $("<p>").text("Temperature: " + currentData.temp + " °F");
  cardBodyEl.append(currentTempEl);
  //create and append wind speed
  var currentWindEl = $("<p>").text("Wind: " + currentData.wind_speed + " MPH");
  cardBodyEl.append(currentWindEl);
  //create and append humidity
  var currentHumidityEl = $("<p>").text(
    "Humidity: " + currentData.humidity + "%"
  );
  cardBodyEl.append(currentHumidityEl);
  //create and append uvi
  var currentUviEl = $("<p>").text("UV Index: ");
  var uviSpanEl = $("<span>").text(currentData.uvi);
  if (currentData.uvi < 3.33) {
    uviSpanEl.addClass('favorable');
  } else if (currentData.uvi > 6.66) {
    uviSpanEl.addClass('severe');
  } else {
    uviSpanEl.addClass('moderate');
  }
  currentUviEl.append(uviSpanEl);
  cardBodyEl.append(currentUviEl);

  //create the header for the future container
  $("#future-header").text("5-Day Forecast:");
  //empty card container
  $("#card-container").text("");
  //create cards for the next 5 days
  for (var i = 1; i < 6; i++) {
    dayData = dailyData[i];
    var cardContainerEl = $("#card-container");
    var dayCardEl = $("<div>").addClass("card");
    var dayCardBodyEl = $("<div>").addClass("card-body");
    //add title for date
    var cardTitleEl = $("<h4>")
      .addClass("card-title")
      .text(moment().add(i, "days").format("MM[/]DD[/]YY"));
    dayCardBodyEl.append(cardTitleEl);
    //add weather icon
    var iconCode = dayData.weather[0].icon;
    var iconLocation = "./assets/images/" + iconCode + ".png";
    var dayCloudEl = $("<img>")
      .addClass("card-icon card-text")
      .attr("src", iconLocation);
    dayCardBodyEl.append(dayCloudEl);
    //add card text for temp
    var dayTempEl = $("<p>")
      .addClass("card-text")
      .text("Temp: " + dayData.temp.day + " °F");
    dayCardBodyEl.append(dayTempEl);
    //add card text for wind_speed
    var dayWindEl = $("<p>")
      .addClass("card-text")
      .text("Wind: " + dayData.wind_speed + " MPH");
    dayCardBodyEl.append(dayWindEl);
    //add card text for humidity
    var dayHumidityEl = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + dayData.humidity + "%");
    dayCardBodyEl.append(dayHumidityEl);
    //append the whole card
    dayCardEl.append(dayCardBodyEl);
    cardContainerEl.append(dayCardEl);
  }
}
