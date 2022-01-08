
//apikey = e6a41f6fdcb53d621e32978ad90ef82f


$('.btn').on('click', function () {
  var city = $('#cityText').val();
  city = city.replace(" ", "+");
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=e6a41f6fdcb53d621e32978ad90ef82f';

  console.log(city);
  console.log(requestUrl)


  //fetch weather
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //display weather
      var currentDate = moment().format("(M/DD/YYYY)");

      $('#city').text(data.name + " " + currentDate);
      $('#temp').text("Temperature: " + data.main.temp + " F")
      $('#humidity').text("Humidity: " + data.main.humidity + "%")
      $('#windspeed').text("Wind Speed: " + data.wind.speed + " MPH")

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      console.log("lat", lat);
      console.log("lon", lon);

      var uviUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=e6a41f6fdcb53d621e32978ad90ef82f'
      //fetch UV index using the lat and long
      fetch(uviUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          $('#uvi').text("UV Index: " + data.current.uvi)
          var uvindex = data.current.uvi;

          //check condition
          if (uvindex < 2) {
            $('#uvi').css("background-color","green")
            $('#uvi').css("color","white")
          }else if(uvindex>=2 && unindex<5){
            $('#uvi').css("background-color","yellow")
            $('#uvi').css("color","white")
          }else if(uvindex>=5 && unindex<8){
            $('#uvi').css("background-color","orange")
            $('#uvi').css("color","white")
          }else{
            $('#uvi').css("background-color","red")
            $('#uvi').css("color","white")
          }

        })

    })



})



// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions
// for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an
// icon representation of weather conditions, the temperature, the humidity,
// the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether
// the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the
// date, an icon representation of weather conditions, the temperature,
// and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city