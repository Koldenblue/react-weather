import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Clock from './components/Clock'
import Loading from './components/Loading';
import { Button, Form } from 'react-bootstrap';

function App() {
  const [loading, setLoading] = useState(<></>);
  const [prevCities, setPrevCities] = useState([]);
  let currentTime = dayjs().format();

  function searchForecast(event: any): void {
    event.preventDefault();
    console.log(event.target[0].value);
    let cityName: string = "los angeles"
    let queryURL: string = "https://openweathermap.org/data/2.5/weather?q="
      + cityName
      + "&appid=" + "";

    setLoading(<Loading />);
    // axios.get(queryURL).then(res => {
    axios.get('/api/weather').then(res => {
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
