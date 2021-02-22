import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form, Card, Image, Jumbotron, Row, Col, Container } from 'react-bootstrap';
import ForecastCard from "./components/ForecastCard";
require("dotenv").config();

function App() {
  const [loading, setLoading] = useState(<></>);
  const [prevCities, setPrevCities] = useState([]);
  const [forecastCards, setForecastCards] = useState(<></>);
  const [prevSearchBar, setPrevSearchBar] = useState(<></>);
  const [validated, setValidated] = useState(false);

  const displayForecastCards = (res) => {
    let weatherTime = 0;
    let future = 1;
    let weatherList = [];
    // iterate through the API response in order to populate the data on displayed cards
    while (weatherTime < 40) {
      // first get the weather icon picture
      const weatherIconCode = res.list[weatherTime].weather[0].icon;
      let iconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";

      // next get temperature in Fahrenheit and other relevant statistics
      const weatherTemp = res.list[weatherTime].main.temp;
      const humidity = res.list[weatherTime].main.humidity;
      const weatherDescription = res.list[weatherTime].weather[0].description;

      // Create new paragraphs to put onto each weather card
      let futureDate = dayjs().add(future, 'd').format("dddd, MMMM D")
      let cardText1 = "Temp: " + weatherTemp + " °F";
      let cardText2 = "Humidity: " + humidity + "%";
      let cardText3 = "Forecast: " + weatherDescription;

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

    // Finally, set the cards JSX so that they are displayed.
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


  const populatePrevSearches = (storedCities) => {
    console.log(prevCities)
    let i = 0;
    setPrevSearchBar(<>
      {storedCities.map(city => {
        return (
          <Button key={++i}>a city</Button>
        )
      })}
    </>)
  }


  useEffect(() => {
    let storedCities = JSON.parse(localStorage.getItem("prevCities"));
    console.log(storedCities)
    if (storedCities !== null) {
      populatePrevSearches(storedCities);
    }
  }, [])


  function searchForecast(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true)
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      console.log("false")
    }

    else {

      let cityName = event.target[0].value;
      let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="
        + cityName
        + "&units=imperial"
        + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";


      // setLoading(<Loading />);
      // axios.get(queryURL).then(res => {
      //   setLoading(<></>)
      //   console.log(res);

      //   setPrevCities((prevCities) => prevCities.push(cityName))
      //   // store city name and populate the previously searched list.
      //   localStorage.setItem("prevCities", JSON.stringify(prevCities));
      //   localStorage.setItem("lastForecast", JSON.stringify(res))

      //   displayForecastCards(res.data);

      // }).catch(function (err) {
      //   console.error(err);
      //   setLoading(<></>);
      //   alert("That city's forecast could not be found!");
      // });
    }
  }

  return (
    <div className="App">
      {loading}

      <Jumbotron>
        <Row>
          <Col></Col>
          <Col>
            <h1>Weather Forecast</h1>
          </Col>
          <Col></Col>
        </Row>

        <Row>
          <Col></Col>
          <Col>
            <Clock />
          </Col>
          <Col></Col>
        </Row>
      </Jumbotron>

      <Container fluid>

        <Form noValidate validated={validated} onSubmit={(event) => searchForecast(event)}>
          <Form.Row>
            <Col>
              <Form.Check
                type='checkbox'
                id={`detail-form`}
                label={`More detailed forecast?`}
              />
            </Col>

            <Col>
              <Form.Group controlId="formCity">
                <Form.Control type="text" placeholder="City Name" required />
                <Form.Text className="text-muted">
                  Enter a city name to search the weather forecast in that city.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>

            <Col>
              <Form.Group controlId="delay-form">
                <Form.Control type="number" placeholder="Seconds of delay" min='0' max='5' defaultValue='0' required/>
                <Form.Text className="text-muted">
                  Enter a number, 0 through 5, to simulate a delay of that many seconds in the API call.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please enter an integer from 0 to 5.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Form.Row>
        </Form>

<hr /> 

        <Row>
          {prevSearchBar}
          <button onClick={populatePrevSearches}>prev searches</button>
          {forecastCards}
        </Row>
      </Container>

    </div>
  );
}

export default App;
