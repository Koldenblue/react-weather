import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState, useRef } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form, Jumbotron, Row, Col, Container, ButtonGroup } from 'react-bootstrap';
import ForecastCard from "./components/ForecastCard";
import DetailedForecastCard from './components/DetailedForecastCard';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function App() {
  const [loading, setLoading] = useState(<></>);                  // JSX for loading screen
  const [forecastCards, setForecastCards] = useState(<></>);      // JSX for the forecast cards display
  const [prevSearchBar, setPrevSearchBar] = useState(<></>);      // JSX for the search bar of previous cities
  const [validated, setValidated] = useState(false);              // Validation check for the form
  const [displayingCards, setDisplayingCards] = useState(false);  // tracks whether forecast cards are displayed
  const [cityName, setCityName] = useState("");
  const fakeDelayRef = useRef<HTMLInputElement>();
  const moreDetailCheckboxRef = useRef<HTMLInputElement>();

  /** Displays cards with the forecast data on the screen.
   * @param {object} res - the response.data from the weather API
  */
  const displayForecastCards = (res): void => {
    let weatherTime: number = 0;
    let future: number = 1;
    let weatherList: Array<any> = [];
    let moreDetails: boolean = (moreDetailCheckboxRef.current.checked as boolean)

    // If the more details checkbox is checked, then display the DetailedForecastCard.js components.
    if (moreDetails) {
      // iterating through API data:
      while (weatherTime < 5) {
        const weatherTemp: string = "Temp: " + res.list[weatherTime].main.temp + " °F";
        const humidity: string = "Humidity: " + res.list[weatherTime].main.humidity + "%";
        const weatherDescription: string = "Forecast: " + res.list[weatherTime].weather[0].description;
        const cloudCover: string = "Cloud Cover: " + res.list[weatherTime].clouds.all + "%";
        const feelsLike: string = "Feels Like: " + res.list[weatherTime].main.feels_like + " °F";
        const minTemp: string = "Min Temp: " + res.list[weatherTime].main.temp_min + " °F";
        const maxTemp: string = "Max Temp: " + res.list[weatherTime].main.temp_max + " °F";
        const windSpeed: string = "Wind Speed: " + res.list[weatherTime].wind.speed + " miles/hour";
        const time: string = dayjs(res.list[weatherTime].dt_txt, "YYYY-MM-DD h:mm:ss").format("dddd, MMMM D h:mm a")

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
      // Set the forecast cards JSX so that they are displayed in UI.
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
      // iterating through API data:
      while (weatherTime < 40) {
        // Get the weather icon picture
        const weatherIconCode = res.list[weatherTime].weather[0].icon;
        let iconURL: string = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";

        // next get temperature in Fahrenheit and other relevant statistics
        const cardText1: string = "Temp: " +  res.list[weatherTime].main.temp + " °F";
        const cardText2: string = "Humidity: " + res.list[weatherTime].main.humidity  + "%";
        const cardText3: string  = "Forecast: " + res.list[weatherTime].weather[0].description;
        let futureDate: string = dayjs().add(future, 'd').format("dddd, MMMM D");
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

      // Set the forecast cards JSX so that they are displayed in UI.
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
  const populatePrevSearches = (storedCities: Array<string>): void => {
    let i: number = 0;
    setPrevSearchBar(
      <ButtonGroup vertical>
        {storedCities.map((city: Array<string> | string) => {
          // title case the city names
          city = (city as string).split('');
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
          city = (city as Array<string>).join('')

          return (
            <Button 
              variant={i === 0 ? 'primary' : 'outline-primary'}
              key={i++}
              onClick={() => searchForecast(city as string)}
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
    let storedCities: string | null = localStorage.getItem("prevCities");
    if (storedCities !== null) {
      let storedCitiesArr: Array<string> = JSON.parse(storedCities);
      populatePrevSearches(storedCitiesArr);
      searchForecast(storedCitiesArr[0])
    }
  }, [])


  function submitForm(event): void {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
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
  const searchForecast = (cityName: string): void => {
    let delay: number = (fakeDelayRef.current.value as unknown) as number;

    let queryURL: string = "http://api.openweathermap.org/data/2.5/forecast?q="
      + cityName
      + "&units=imperial"
      + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";
    setLoading(<Loading />);

    // Set a timeout in order to simulate a fake delay in the AJAX call
    setTimeout(() => {
      axios.get(queryURL).then(res => {
        setLoading(<></>);
        let storedArr: string | null = localStorage.getItem("prevCities");
        storedArr = (storedArr === null ? '[]' : storedArr);
        let prevCityArr: Array<string> = JSON.parse(storedArr)

        // store the city name in an array in local storage, 
        // at index 0 of the array so that it will be displayed at the top of the previously searched cities list
        if (!prevCityArr.includes(cityName.toLowerCase())) {
          prevCityArr.unshift(cityName.toLowerCase())
        } else {
          let cityIndex: number = prevCityArr.indexOf(cityName.toLowerCase());
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


  /** Upon checkbox click, switches the view from a detailed one-day forecast to a 5-day forecast. */
  const switchDetailedView = (): void => {
    if (displayingCards) {
      let storedRes: string | null = localStorage.getItem('lastForecast');
      if (storedRes !== null) {
        let res: object = JSON.parse(storedRes);
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

      <Container>
        <Form noValidate validated={validated} onSubmit={(event) => submitForm(event)}>
          <Form.Row>
            <Col>
              <Form.Check
                type='checkbox'
                id={`detail-form`}
                label={`Switch from 5-day forecast to detailed one-day forecast?`}
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
              <Button variant="success" type="submit">
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
      </Container>

      <Container fluid>
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
