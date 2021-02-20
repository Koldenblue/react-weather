import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form } from 'react-bootstrap';
const API_KEY = "113e4bfcfb385e8bac4e5a9052f2e349";

function App() {
  const [loading, setLoading] = useState(<></>);
  const [prevCities, setPrevCities] = useState([]);
  let currentTime = dayjs().format();

  function searchForecast(event): void {
    event.preventDefault();
    console.log(event.target[0].value);
    let cityName: string = "los angeles"
    // let queryURL: string = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?q="
    //   + cityName + "&units=imperial&appid=" + API_KEY;

    let queryURL: string = `https://openweathermap.org/data/2.5/find?q=los angeles&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1613861896449`
    // display loading spinner while making api call
    setLoading(<Loading />);

    axios.get(queryURL).then(res => {
      setLoading(<></>)
      console.log(res);

      // store city name and populate the previously searched list.
      localStorage.setItem("prevCities", JSON.stringify(prevCities));
      localStorage.setItem("lastForecast", JSON.stringify(res))

    }).catch(function (err) {
      console.error(err);
      setLoading(<></>);
      alert("That city's forecast could not be found!");
    });

    // queryURL = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`
    // makeCall(queryURL).then(response => {
    //   console.log(response);
    //   displayCurrentWeather(response);
    //   localStorage.setItem("currentWeather", JSON.stringify(response));

    //   // get uv conditions using returned latitude and longitude
    //   let lat = response.coord.lat;
    //   let lon = response.coord.lon;
    //   queryURL = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${lat}&lon=${lon}`;
    //   makeCall(queryURL).then(function (response) {
    //     console.log("uv conditions");
    //     console.log(response);
    //     localStorage.setItem("uvIndex", response.value);
    //     displayUVIndex(response.value);
    //   }).catch(error => {
    //     console.log("uv index error");
    //     console.log(error);
    //   })
    // }).catch(error => {
    //   console.log("Current weather error");
    //   console.log(error);
    // });
  }



  return (
    <div className="App">
      {loading}
      <Clock />

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
