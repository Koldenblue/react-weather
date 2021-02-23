import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState, useRef } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form, Jumbotron, Row, Col, Container, ButtonGroup } from 'react-bootstrap';
import ForecastCard from "./components/ForecastCard";
import DetailedForecastCard from './components/DetailedForecastCard';
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function App() {
  const [loading, setLoading] = useState(<></>);                  // JSX for loading screen
  const [forecastCards, setForecastCards] = useState(<></>);      // JSX for the forecast cards display
  const [prevSearchBar, setPrevSearchBar] = useState(<></>);      // JSX for the search bar of previous cities
  const [validated, setValidated] = useState(false);              // Validation check for the form
  const [displayingCards, setDisplayingCards] = useState(false);  // tracks whether forecast cards are displayed
  const [cityName, setCityName] = useState("");
  const fakeDelayRef = useRef();
  const moreDetailCheckboxRef = useRef();

  /** Displays cards with the forecast on the screen.
   * @param {object} res - the response.data from the weather API
   * @param {boolean} moreDetails - if this is true, then more detailed statistics are displayed..
  */
  const displayForecastCards = (res) => {
    let weatherTime = 0;
    let future = 1;
    let weatherList = [];
    let moreDetails = moreDetailCheckboxRef.current.checked;

    if (moreDetails) {
      while (weatherTime < 5) {
        const weatherTemp = "Temp: " + res.list[weatherTime].main.temp + " °F";
        const humidity = "Humidity: " + res.list[weatherTime].main.humidity + "%";
        const weatherDescription = "Forecast: " + res.list[weatherTime].weather[0].description;
        const cloudCover = "Cloud Cover: " + res.list[weatherTime].clouds.all + "%";
        const feelsLike = "Feels Like: " + res.list[weatherTime].main.feels_like + " °F";
        const minTemp = "Min Temp: " + res.list[weatherTime].main.temp_min + " °F";
        const maxTemp = "Max Temp: " + res.list[weatherTime].main.temp_max + " °F";
        const windSpeed = "Wind Speed: " + res.list[weatherTime].wind.speed + " miles/hour";
        const time = dayjs(res.list[weatherTime].dt_txt, "YYYY-MM-DD h:mm:ss").format("dddd, MMMM D h:mm a")

        weatherList.push({
          weatherTemp: weatherTemp,
          humidity: humidity,
          weatherDescription: weatherDescription,
          cloudCover: cloudCover,
          feelsLike: feelsLike,
          minTemp: minTemp,
          maxTemp: maxTemp,
          windSpeed: windSpeed,
          time: time
        })
        weatherTime++;
        future++;
      }
      setForecastCards(<>
        {weatherList.map(card => {
          return (
            <DetailedForecastCard
              time={card.time}
              weatherDescription={card.weatherDescription}
              weatherTemp={card.weatherTemp}
              humidity={card.humidity}
              cloudCover={card.cloudCover}
              feelsLike={card.feelsLike}
              minTemp={card.minTemp}
              maxTemp={card.maxTemp}
              windSpeed={card.windSpeed}
            />
          )
        })}
      </>)
    }

    else {
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

      // Finally, set the forecast cards JSX so that they are displayed.
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
  }


  /** Creates a list display of previously searched cities by mapping an array of city names to buttons.
   * @param {array} storedCities - An array consisting of the names of the prev cities. Should be lowercased.
  */
  const populatePrevSearches = (storedCities) => {
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


  // upon page load, populate the previous searches bar and display the forecast for the most recent search
  useEffect(() => {
    let storedCities = localStorage.getItem("prevCities");
    if (storedCities !== null) {
      storedCities = JSON.parse(storedCities);
      populatePrevSearches(storedCities);
      searchForecast(storedCities[0])
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


  /** makes AJAX call to open weather api
   * @param {string} cityName - The name of a city to get the forecast for
  */
  const searchForecast = (cityName) => {
    let delay = fakeDelayRef.current.value;

    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="
      + cityName
      + "&units=imperial"
      + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";
    setLoading(<Loading />);

    // Set a timeout in order to simulate a fake delay in the AJAX call
    setTimeout(() => {
      axios.get(queryURL).then(res => {
        setLoading(<></>)
        console.log(res.data);
        let prevCityArr = JSON.parse(localStorage.getItem("prevCities"));
        prevCityArr = (prevCityArr === null ? [] : prevCityArr);

        // store the city name in an array in local storage, 
        // at index 0 of the array so that it will be displayed at the top of the previously searched cities list
        if (!prevCityArr.includes(cityName.toLowerCase())) {
          prevCityArr.unshift(cityName.toLowerCase())
        } else {
          let cityIndex = prevCityArr.indexOf(cityName.toLowerCase());
          prevCityArr.splice(cityIndex, 1);
          prevCityArr.unshift(cityName.toLowerCase())
        }
        // store city name and populate the previously searched list.
        localStorage.setItem("prevCities", JSON.stringify(prevCityArr));
        localStorage.setItem("lastForecast", JSON.stringify(res.data));
        displayForecastCards(res.data);
        setDisplayingCards(true);
        populatePrevSearches(prevCityArr);
      }).catch(function (err) {
        console.error(err);
        setLoading(<></>);
        alert("That city's forecast could not be found! Be sure to use correct spelling.");
      });
    }, delay * 1000)
  }

  const switchDetailedView = () => {
    if (displayingCards) {
      let res = JSON.parse(localStorage.getItem('lastForecast'));
      if (res) {
        displayForecastCards(res);
      }
    }
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
                label={`More detailed one-day forecast?`}
                ref={moreDetailCheckboxRef}
                onChange={switchDetailedView}
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
