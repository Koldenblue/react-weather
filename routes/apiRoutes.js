const axios = require("axios");
const router = require("express").Router();
require("dotenv").config();
// Routes starting with '/api/'

router.get('/hello', (req, res) => {
  res.json('hi')
})

router.get('/weather', (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*');

  let queryURL = "http://api.openweathermap.org/data/2.5/weather?q="
    + "los%20angeles" 
    // + "&units=imperial"
    + "&appid=" + process.env.API_KEY;

  axios.get(queryURL).then(data => {
    console.log(data.data);
    res.json(data.data);
  }).catch(err => {
    console.log(err)
    res.status(400).send();
  })
})
module.exports = router;