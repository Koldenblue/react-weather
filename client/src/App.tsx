import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form, Card, Image } from 'react-bootstrap';
import ForecastCard from "./components/ForecastCard";
require("dotenv").config();

function App() {
  const [loading, setLoading] = useState(<></>);
  const [prevCities, setPrevCities] = useState([]);
  const [forecastCards, setForecastCards] = useState(<></>);
  let currentTime = dayjs().format();

  const displayForecastCards = (res: any): void => {
    let weatherTime = 0;
    let future = 1;
    let weatherList = [];
    while (weatherTime < 40) {
      // first get the weather icon picture
      const weatherIconCode = res.list[weatherTime].weather[0].icon;
      let iconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";

      // next get temperature in Fahrenheit and other relevant statistics
      const weatherTemp = res.list[weatherTime].main.temp;
      const humidity = res.list[weatherTime].main.humidity;
      const weatherDescription = res.list[weatherTime].weather[0].description;

      // create the main weather card body
      // let cardBody = $("<div class='card-body'>")

      // add on the day:
      let futureDate = dayjs().add(future, 'd').format("dddd, MMMM D")
      // Note: the text in the div must be set separately from creating the div element.
      // let cardDateText = $('<div>').html("<strong>" + futureDate + "</strong>").attr("class", "card-header");

      // Create new paragraphs to put onto each weather card
      let cardText1 = "Temp: " + weatherTemp + " °F";
      let cardText2 = "Humidity: " + humidity + "%";
      let cardText3 = "Forecast: " + weatherDescription;

      // let weatherCard = $("<div class='card text-white bg-info col-xl-2' style='width:18rem;'>").append(cardDateText).append(newIcon).append(cardBody);
      // $(".weather-list").append(weatherCard)
      weatherList.push({
        futureDate: futureDate,
        future: future,
        cardText1: cardText1,
        cardText2: cardText2,
        cardText3: cardText3,
        iconURL: iconURL,
      })

      // increment weatherTime by 8 to get the next day's weather. Last day index will be 39, rather than 40.
      weatherTime += 8;
      future++;
    }

    console.log(weatherList)

    setForecastCards(
      <>
        {weatherList.map(card => {
          return ( 
            <ForecastCard
              key={card.futureDate}
              futureDate={card.futureDate}
              future={future}
              cardText1={card.cardText1}
              cardText2={card.cardText2}
              cardText3={card.cardText3}
              iconURL={card.iconURL}
            />
          )
        })}
      </>
    )
  }


  function searchForecast(event: any): void {
    event.preventDefault();
    console.log(event.target[0].value);
    let cityName: string = event.target[0].value;
    let queryURL: string = "http://api.openweathermap.org/data/2.5/forecast?q="
      + cityName
      + "&units=imperial"
      + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";

    setLoading(<Loading />);
    axios.get(queryURL).then(res => {
      setLoading(<></>)
      console.log(res);

      // store city name and populate the previously searched list.
      localStorage.setItem("prevCities", JSON.stringify(prevCities));
      localStorage.setItem("lastForecast", JSON.stringify(res))

      displayForecastCards(res.data);

    }).catch(function (err) {
      console.error(err);
      setLoading(<></>);
      alert("That city's forecast could not be found!");
    });
  }

  return (
    <div className="App">
      {loading}
      <Clock />

      {forecastCards}

      <Form onSubmit={(event) => searchForecast(event)}>
        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City Name" />
          <Form.Text className="text-muted">
            Enter a city name to search the weather in that city.
            </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
          </Button>
      </Form>
    </div>
  );
}

export default App;
