"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var dayjs_1 = __importDefault(require("dayjs"));
var react_1 = __importStar(require("react"));
var Clock_1 = __importDefault(require("./components/Clock"));
var Loading_1 = __importDefault(require("./components/Loading"));
var react_bootstrap_1 = require("react-bootstrap");
var ForecastCard_1 = __importDefault(require("./components/ForecastCard"));
require("dotenv").config();
function App() {
    var _a = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState([]), prevCities = _b[0], setPrevCities = _b[1];
    var _c = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), forecastCards = _c[0], setForecastCards = _c[1];
    var currentTime = dayjs_1["default"]().format();
    var displayForecastCards = function (res) {
        var weatherTime = 0;
        var future = 1;
        var weatherList = [];
        while (weatherTime < 40) {
            // first get the weather icon picture
            var weatherIconCode = res.list[weatherTime].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";
            // next get temperature in Fahrenheit and other relevant statistics
            var weatherTemp = res.list[weatherTime].main.temp;
            var humidity = res.list[weatherTime].main.humidity;
            var weatherDescription = res.list[weatherTime].weather[0].description;
            // create the main weather card body
            // let cardBody = $("<div class='card-body'>")
            // add on the day:
            var futureDate = dayjs_1["default"]().add(future, 'd').format("dddd, MMMM D");
            // Note: the text in the div must be set separately from creating the div element.
            // let cardDateText = $('<div>').html("<strong>" + futureDate + "</strong>").attr("class", "card-header");
            // Create new paragraphs to put onto each weather card
            var cardText1 = "Temp: " + weatherTemp + " °F";
            var cardText2 = "Humidity: " + humidity + "%";
            var cardText3 = "Forecast: " + weatherDescription;
            // let weatherCard = $("<div class='card text-white bg-info col-xl-2' style='width:18rem;'>").append(cardDateText).append(newIcon).append(cardBody);
            // $(".weather-list").append(weatherCard)
            weatherList.push({
                futureDate: futureDate,
                future: future,
                cardText1: cardText1,
                cardText2: cardText2,
                cardText3: cardText3,
                iconURL: iconURL
            });
            // increment weatherTime by 8 to get the next day's weather. Last day index will be 39, rather than 40.
            weatherTime += 8;
            future++;
        }
        console.log(weatherList);
        setForecastCards(react_1["default"].createElement(react_1["default"].Fragment, null, weatherList.map(function (card) {
            return (react_1["default"].createElement(ForecastCard_1["default"], { key: card.futureDate, futureDate: card.futureDate, future: future, cardText1: card.cardText1, cardText2: card.cardText2, cardText3: card.cardText3, iconURL: card.iconURL }));
        })));
    };
    function searchForecast(event) {
        event.preventDefault();
        console.log(event.target[0].value);
        var cityName = event.target[0].value;
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="
            + cityName
            + "&units=imperial"
            + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";
        setLoading(react_1["default"].createElement(Loading_1["default"], null));
        axios_1["default"].get(queryURL).then(function (res) {
            setLoading(react_1["default"].createElement(react_1["default"].Fragment, null));
            console.log(res);
            // store city name and populate the previously searched list.
            localStorage.setItem("prevCities", JSON.stringify(prevCities));
            localStorage.setItem("lastForecast", JSON.stringify(res));
            displayForecastCards(res.data);
        })["catch"](function (err) {
            console.error(err);
            setLoading(react_1["default"].createElement(react_1["default"].Fragment, null));
            alert("That city's forecast could not be found!");
        });
    }
    return (react_1["default"].createElement("div", { className: "App" },
        loading,
        react_1["default"].createElement(Clock_1["default"], null),
        forecastCards,
        react_1["default"].createElement(react_bootstrap_1.Form, { onSubmit: function (event) { return searchForecast(event); } },
            react_1["default"].createElement(react_bootstrap_1.Form.Group, { controlId: "formCity" },
                react_1["default"].createElement(react_bootstrap_1.Form.Label, null, "City"),
                react_1["default"].createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "City Name" }),
                react_1["default"].createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Enter a city name to search the weather in that city.")),
            react_1["default"].createElement(react_bootstrap_1.Button, { variant: "primary", type: "submit" }, "Submit"))));
}
exports["default"] = App;
