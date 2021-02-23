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
var DetailedForecastCard_1 = __importDefault(require("./components/DetailedForecastCard"));
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs_1["default"].extend(customParseFormat);
function App() {
    var _a = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), loading = _a[0], setLoading = _a[1]; // JSX for loading screen
    var _b = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), forecastCards = _b[0], setForecastCards = _b[1]; // JSX for the forecast cards display
    var _c = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), prevSearchBar = _c[0], setPrevSearchBar = _c[1]; // JSX for the search bar of previous cities
    var _d = react_1.useState(false), validated = _d[0], setValidated = _d[1]; // Validation check for the form
    var _e = react_1.useState(false), displayingCards = _e[0], setDisplayingCards = _e[1]; // tracks whether forecast cards are displayed
    var _f = react_1.useState(""), cityName = _f[0], setCityName = _f[1];
    var fakeDelayRef = react_1.useRef();
    var moreDetailCheckboxRef = react_1.useRef();
    /** Displays cards with the forecast data on the screen.
     * @param {object} res - the response.data from the weather API
    */
    var displayForecastCards = function (res) {
        var weatherTime = 0;
        var future = 1;
        var weatherList = [];
        var moreDetails = moreDetailCheckboxRef.current.checked;
        // If the more details checkbox is checked, then display the DetailedForecastCard.js components.
        if (moreDetails) {
            // iterating through API data:
            while (weatherTime < 5) {
                var weatherTemp = "Temp: " + res.list[weatherTime].main.temp + " °F";
                var humidity = "Humidity: " + res.list[weatherTime].main.humidity + "%";
                var weatherDescription = "Forecast: " + res.list[weatherTime].weather[0].description;
                var cloudCover = "Cloud Cover: " + res.list[weatherTime].clouds.all + "%";
                var feelsLike = "Feels Like: " + res.list[weatherTime].main.feels_like + " °F";
                var minTemp = "Min Temp: " + res.list[weatherTime].main.temp_min + " °F";
                var maxTemp = "Max Temp: " + res.list[weatherTime].main.temp_max + " °F";
                var windSpeed = "Wind Speed: " + res.list[weatherTime].wind.speed + " miles/hour";
                var time = dayjs_1["default"](res.list[weatherTime].dt_txt, "YYYY-MM-DD h:mm:ss").format("dddd, MMMM D h:mm a");
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
                });
                weatherTime++;
                future++;
            }
            // Set the forecast cards JSX so that they are displayed in UI.
            setForecastCards(react_1["default"].createElement(react_1["default"].Fragment, null, weatherList.map(function (card) {
                return (react_1["default"].createElement(DetailedForecastCard_1["default"], { time: card.time, weatherDescription: card.weatherDescription, weatherTemp: card.weatherTemp, humidity: card.humidity, cloudCover: card.cloudCover, feelsLike: card.feelsLike, minTemp: card.minTemp, maxTemp: card.maxTemp, windSpeed: card.windSpeed }));
            })));
        }
        else {
            // iterating through API data:
            while (weatherTime < 40) {
                // Get the weather icon picture
                var weatherIconCode = res.list[weatherTime].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";
                // next get temperature in Fahrenheit and other relevant statistics
                var cardText1 = "Temp: " + res.list[weatherTime].main.temp + " °F";
                var cardText2 = "Humidity: " + res.list[weatherTime].main.humidity + "%";
                var cardText3 = "Forecast: " + res.list[weatherTime].weather[0].description;
                var futureDate = dayjs_1["default"]().add(future, 'd').format("dddd, MMMM D");
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
            // Set the forecast cards JSX so that they are displayed in UI.
            setForecastCards(react_1["default"].createElement(react_1["default"].Fragment, null, weatherList.map(function (card) {
                return (react_1["default"].createElement(ForecastCard_1["default"], { key: card.futureDate, futureDate: card.futureDate, future: future, cardText1: card.cardText1, cardText2: card.cardText2, cardText3: card.cardText3, iconURL: card.iconURL }));
            })));
        }
    };
    /** Creates a list display of previously searched cities by mapping an array of city names to buttons.
     * @param {array} storedCities - An array consisting of the names of the prev cities. Should be lowercased.
    */
    var populatePrevSearches = function (storedCities) {
        var i = 0;
        setPrevSearchBar(react_1["default"].createElement(react_bootstrap_1.ButtonGroup, { vertical: true }, storedCities.map(function (city) {
            // title case the city names
            city = city.split('');
            city[0] = city[0].toUpperCase();
            try {
                for (var i_1 = 0, j = city.length; i_1 < j; i_1++) {
                    if (city[i_1] === ' ') {
                        city[i_1 + 1] = city[i_1 + 1].toUpperCase();
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            city = city.join('');
            return (react_1["default"].createElement(react_bootstrap_1.Button, { variant: i === 0 ? 'primary' : 'outline-primary', key: i++, onClick: function () { return searchForecast(city); } }, city));
        })));
    };
    // upon page load, populate the previous searches bar and display the forecast for the most recent search
    react_1.useEffect(function () {
        var storedCities = localStorage.getItem("prevCities");
        if (storedCities !== null) {
            var storedCitiesArr = JSON.parse(storedCities);
            populatePrevSearches(storedCitiesArr);
            searchForecast(storedCitiesArr[0]);
        }
    }, []);
    function submitForm(event) {
        event.preventDefault();
        var form = event.currentTarget;
        setValidated(true);
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            searchForecast(cityName);
        }
    }
    /** makes AJAX call to open weather api
     * @param {string} cityName - The name of a city to get the forecast for
    */
    var searchForecast = function (cityName) {
        var delay = fakeDelayRef.current.value;
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="
            + cityName
            + "&units=imperial"
            + "&appid=" + "c218adccd0a9e7a9f97aae69f078301b";
        setLoading(react_1["default"].createElement(Loading_1["default"], null));
        // Set a timeout in order to simulate a fake delay in the AJAX call
        setTimeout(function () {
            axios_1["default"].get(queryURL).then(function (res) {
                setLoading(react_1["default"].createElement(react_1["default"].Fragment, null));
                var storedArr = localStorage.getItem("prevCities");
                storedArr = (storedArr === null ? '[]' : storedArr);
                var prevCityArr = JSON.parse(storedArr);
                // store the city name in an array in local storage, 
                // at index 0 of the array so that it will be displayed at the top of the previously searched cities list
                if (!prevCityArr.includes(cityName.toLowerCase())) {
                    prevCityArr.unshift(cityName.toLowerCase());
                }
                else {
                    var cityIndex = prevCityArr.indexOf(cityName.toLowerCase());
                    prevCityArr.splice(cityIndex, 1);
                    prevCityArr.unshift(cityName.toLowerCase());
                }
                // store city name and populate the previously searched list.
                localStorage.setItem("prevCities", JSON.stringify(prevCityArr));
                localStorage.setItem("lastForecast", JSON.stringify(res.data));
                displayForecastCards(res.data);
                setDisplayingCards(true);
                populatePrevSearches(prevCityArr);
            })["catch"](function (err) {
                console.error(err);
                setLoading(react_1["default"].createElement(react_1["default"].Fragment, null));
                alert("That city's forecast could not be found! Be sure to use correct spelling.");
            });
        }, delay * 1000);
    };
    /** Upon checkbox click, switches the view from a detailed one-day forecast to a 5-day forecast. */
    var switchDetailedView = function () {
        if (displayingCards) {
            var storedRes = localStorage.getItem('lastForecast');
            if (storedRes !== null) {
                var res = JSON.parse(storedRes);
                displayForecastCards(res);
            }
        }
    };
    return (react_1["default"].createElement("main", { className: "App" },
        loading,
        react_1["default"].createElement(react_bootstrap_1.Jumbotron, null,
            react_1["default"].createElement(react_bootstrap_1.Row, null,
                react_1["default"].createElement(react_bootstrap_1.Col, null,
                    react_1["default"].createElement("h1", { className: 'text-center' }, "Weather Forecast"))),
            react_1["default"].createElement(react_bootstrap_1.Row, null,
                react_1["default"].createElement(react_bootstrap_1.Col, { className: 'text-center' },
                    react_1["default"].createElement(Clock_1["default"], null)))),
        react_1["default"].createElement(react_bootstrap_1.Container, null,
            react_1["default"].createElement(react_bootstrap_1.Form, { noValidate: true, validated: validated, onSubmit: function (event) { return submitForm(event); } },
                react_1["default"].createElement(react_bootstrap_1.Form.Row, null,
                    react_1["default"].createElement(react_bootstrap_1.Col, null,
                        react_1["default"].createElement(react_bootstrap_1.Form.Check, { type: 'checkbox', id: "detail-form", label: "Switch from 5-day forecast to detailed one-day forecast?", ref: moreDetailCheckboxRef, onChange: switchDetailedView })),
                    react_1["default"].createElement(react_bootstrap_1.Col, null,
                        react_1["default"].createElement(react_bootstrap_1.Form.Group, { controlId: "formCity" },
                            react_1["default"].createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "City Name", required: true, onChange: function (event) { return setCityName(event.target.value); } }),
                            react_1["default"].createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Enter a city name to search the weather forecast in that city.")),
                        react_1["default"].createElement(react_bootstrap_1.Button, { variant: "success", type: "submit" }, "Submit")),
                    react_1["default"].createElement(react_bootstrap_1.Col, null,
                        react_1["default"].createElement(react_bootstrap_1.Form.Group, { controlId: "delay-form" },
                            react_1["default"].createElement(react_bootstrap_1.Form.Control, { type: "number", placeholder: "Seconds of delay", min: '0', max: '5', defaultValue: '0', required: true, ref: fakeDelayRef }),
                            react_1["default"].createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Enter a number, 0 through 5, to simulate a delay of that many seconds in the API call."),
                            react_1["default"].createElement(react_bootstrap_1.Form.Control.Feedback, { type: "invalid" }, "Please enter an integer from 0 to 5.")))))),
        react_1["default"].createElement(react_bootstrap_1.Container, { fluid: true },
            react_1["default"].createElement("hr", null),
            react_1["default"].createElement(react_bootstrap_1.Row, null,
                react_1["default"].createElement(react_bootstrap_1.Col, { md: 2 }, prevSearchBar),
                forecastCards))));
}
exports["default"] = App;
