import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState, useRef } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form, Card, Image, Jumbotron, Row, Col, Container, ButtonGroup } from 'react-bootstrap';
import ForecastCard from "./components/ForecastCard";
require("dotenv").config();

function App() {
  const [loading, setLoading] = useState(<></>);                  // JSX for loading screen
  const [prevCities, setPrevCities] = useState([]);               // array of previous searches, stored in local storage
  const [forecastCards, setForecastCards] = useState(<></>);      // JSX for the forecast cards display
  const [prevSearchBar, setPrevSearchBar] = useState(<></>);      // JSX for the search bar of previous cities
  const [validated, setValidated] = useState(false);              // Validation check for the form
  const [fakeDelay, setFakeDelay] = useState(0);                  // amount of seconds that API call will be delayed
  const [moreDetails, setMoreDetails] = useState(false);
  const [cityName, setCityName] = useState("");

  const fakeDelayRef = useRef();
  const moreDetailCheckboxRef = useRef();

  /** Displays cards with the forecast on the screen.
   * @param {object} res - the response.list from the weather API
   * @param {boolean} moreDetails - if this is true, then a forecast every 3 hours is displayed instead of every day.
  */
  const displayForecastCards = (res, moreDetails) => {
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

  /** Creates a list of previously searched cities.
   * @param {array} storedCities - An array consisting of the names of the prev cities. Should be lowercased. */
  const populatePrevSearches = (storedCities) => {
    console.log(storedCities)
    let i = 0;
    setPrevSearchBar(
      <ButtonGroup vertical>
        {storedCities.map(city => {
          // title case the city names
          city = city.split('');
          city[0] = city[0].toUpperCase();
          try {
            for (let i = 0, j = city.length; i < j; i++) {
              if (city[i] === ' ') {
                city[i + 1] = city[i + 1].toUpperCase();
              }
            }
          }
          catch (err) {
            console.error(err);
          }
          city = city.join('')

          // return a button list of the previous searches
          return (
            <Button key={i++}
              variant={i === 0 ? 'primary' : 'outline-primary'}
              onClick={() => searchForecast(city)}
            >
              {city}
            </Button>
          )
        })}
      </ButtonGroup>
    )
  }


  useEffect(() => {
    let storedCities = localStorage.getItem("prevCities");
    if (storedCities !== null) {
      storedCities = JSON.parse(storedCities);
      console.log(storedCities)
      setPrevCities(storedCities)
      populatePrevSearches(storedCities);
    }
  }, [])

  function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true)
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    else {
      searchForecast(cityName)
    }
  }


  /** makes AJAX call to open weather api */
  const searchForecast = (cityName) => {
    let delay = fakeDelayRef.current.value;
    console.log(fakeDelayRef.current)
    console.log(fakeDelayRef.current.value)

    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="
      + cityName
      + "&units=imperial"
      + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";
    setLoading(<Loading />);
    setTimeout(() => {
      axios.get(queryURL).then(res => {
        setLoading(<></>)
        console.log(res);
        console.log(prevCities)
        let prevCityArr = JSON.parse(localStorage.getItem("prevCities"));
        prevCityArr = (prevCityArr === null ? [] : prevCityArr);
        if (!prevCityArr.includes(cityName.toLowerCase())) {
          prevCityArr.unshift(cityName.toLowerCase())
        } else {
          // put city at front of line
          let cityIndex = prevCityArr.indexOf(cityName.toLowerCase());
          prevCityArr.splice(cityIndex, 1);
          prevCityArr.unshift(cityName.toLowerCase())
        }
        console.log(prevCityArr)
        setPrevCities(prevCityArr)
        // store city name and populate the previously searched list.
        localStorage.setItem("prevCities", JSON.stringify(prevCityArr));
        localStorage.setItem("lastForecast", JSON.stringify(res))
        localStorage.setItem("test", '2')
        displayForecastCards(res.data, moreDetails);
        populatePrevSearches(prevCityArr);
      }).catch(function (err) {
        console.error(err);
        setLoading(<></>);
        alert("That city's forecast could not be found!");
      });
    }, delay * 1000)

  }

  return (
    <main className="App">
      {loading}

      <Jumbotron>
        <Row>
          <Col>
            <h1 className='text-center'>Weather Forecast</h1>
          </Col>
        </Row>

        <Row>
          <Col className='text-center'>
            <Clock />
          </Col>
        </Row>
      </Jumbotron>

      <Container fluid>

        <Form noValidate validated={validated} onSubmit={(event) => submitForm(event)}>
          <Form.Row>
            <Col>
              <Form.Check
                type='checkbox'
                id={`detail-form`}
                label={`More detailed forecast?`}
                onChange={(event) => setMoreDetails(event.target.checked)}
                ref={moreDetailCheckboxRef}
              />
            </Col>

            <Col>
              <Form.Group controlId="formCity">
                <Form.Control type="text" placeholder="City Name" required onChange={(event) => setCityName(event.target.value)} />
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
                <Form.Control 
                  type="number"
                  placeholder="Seconds of delay"
                  min='0' 
                  max='5' 
                  defaultValue='0' 
                  required 
                  onChange={(event) => setFakeDelay(event.target.value)} 
                  ref={fakeDelayRef}
                />
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
          <Col md={2}>
            {prevSearchBar}
          </Col>
          {forecastCards}
        </Row>
      </Container>

    </main>
  );
}

export default App;
