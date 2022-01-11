
//apikey = e6a41f6fdcb53d621e32978ad90ef82f
var cityArray = JSON.parse(localStorage.getItem("cityNames")) || [];
for(let i = 0 ; i < cityArray.length ; i++){
  var city = cityArray[i].replace(" ", "+");
  var cityButton = $('<button type="button">');
  cityButton.text(cityArray[i]);
  cityButton.addClass("btn btn-primary m-1 cityButton");
  cityButton.attr("data-city", city);
  $('#cityButtons').append(cityButton);
}
$('#searchButton').on('click', function () {

  var cityInput = $('#cityText').val();
  fetchWeather(cityInput);
  $('#cityText').val("");
})

$('#clear').on('click', function () {
  localStorage.clear();
})

$('#cityButtons').on('click', '.cityButton', function () {
  var city = $(this).text();

  console.log(city);
  fetchWeather(city);
})

var fetchWeather = function (cityInput) {
  var city = cityInput.replace(" ", "+");
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=e6a41f6fdcb53d621e32978ad90ef82f';

  //fetch weather
  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      return response.json()

    })
    .then(function (data) {
      if (data.message == "city not found") {
        alert('Error: ' + data.message);
        return;
      }
      console.log(data);

      if (!cityArray.includes(cityInput)) {
        generateButton(cityInput, city);
      }


      //display weather
      var currentDate = moment().format("(M/DD/YYYY)");
      var weatherIcon = $('<img>');
      weatherIcon.attr("src", 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')


      $('#city').text(data.name + " " + currentDate);
      $('#city').append(weatherIcon)

      $('#weatherCondition').text("Weather: " + data.weather[0].description)
      $('#temp').text("Temperature: " + data.main.temp + " °F")
      $('#humidity').text("Humidity: " + data.main.humidity + "%")
      $('#windspeed').text("Wind Speed: " + data.wind.speed + " MPH")

      var lat = data.coord.lat;
      var lon = data.coord.lon;


      getUVI(lat, lon);

      get5day(city);

    })
    .catch(function (error) {
      alert('Error: ' + error.message);
      console.log(error.message);
      return;
    })
}


//GENERATE BUTTON
var generateButton = function (cityInput, city) {
  //Add button and reset textbox
  var cityButton = $('<button type="button">');
  cityButton.text(cityInput);
  cityButton.addClass("btn btn-primary m-1 cityButton");
  cityButton.attr("data-city", city)
  //ONLY DO THIS IF CITY IS ALREADY NOT IN LOCAL STORAGE
  cityArray.push(cityInput);
  localStorage.setItem("cityNames", JSON.stringify(cityArray));

  $('#cityButtons').append(cityButton);

}



//fetch UV index using the lat and long
var getUVI = function (latitude, longitude) {
  var uviUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&appid=e6a41f6fdcb53d621e32978ad90ef82f'

  fetch(uviUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $('#uvi').text("UV Index: " + data.current.uvi)
      var uvindex = data.current.uvi;
      console.log("uvindex: ", uvindex);
      //check condition
      if (uvindex < 2) {
        $('#uvi').css("background-color", "green")

      } else if (uvindex >= 2 && uvindex < 5) {
        $('#uvi').css("background-color", "yellow")

      } else if (uvindex >= 5 && uvindex < 8) {
        $('#uvi').css("background-color", "orange")

      } else {
        $('#uvi').css("background-color", "red")

      }
    })
}


//GET 5 DAY FORECAST
var get5day = function (city) {

  var forecastHeader = $('<h3>').text("5 Day Forecast:")
  $('#5day').append(forecastHeader);
  forecastHeader.addClass("col-md-12")
  var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=e6a41f6fdcb53d621e32978ad90ef82f'
  console.log("city: ", city);
  console.log(forecastURL)
  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("forecast", data);

      //clear future forcast if data exists
      $('#5day').empty();

      for (let i = 2; i < data.list.length; i += 8) {

        //Date, Icon, temp, Humidity
        let weatherikon = $('<img>');
        weatherikon.attr("src", 'http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png')
        var card = $('<div>');
        card.addClass("card");
        var cardbody = $('<div>');
        cardbody.addClass("card-body");

        $('#5day').append(card);
        card.append(cardbody);

        let tomorrow = moment().add((i - 1) / 8, 'days').format("M/DD/YYYY");
        cardbody.append($('<h4>').text(tomorrow));
        cardbody.append(weatherikon);
        cardbody.append($('<p>').text("Temperature: " + data.list[i].main.temp + " °F"));
        cardbody.append($('<p>').text("Humidity: " + data.list[i].main.humidity + "%"));
        cardbody.append($('<p>').text("Windspeed: " + data.list[i].wind.speed + " MPH"));




      }
    })
}