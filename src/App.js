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
var API_KEY = "113e4bfcfb385e8bac4e5a9052f2e349";
function App() {
    var _a = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState([]), prevCities = _b[0], setPrevCities = _b[1];
    var currentTime = dayjs_1["default"]().format();
    function searchForecast(event) {
        event.preventDefault();
        console.log(event.target[0].value);
        var cityName = "los angeles";
        // let queryURL: string = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?q="
        //   + cityName + "&units=imperial&appid=" + API_KEY;
        var queryURL = "https://openweathermap.org/data/2.5/find?q=los angeles&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1613861896449";
        // display loading spinner while making api call
        setLoading(react_1["default"].createElement(Loading_1["default"], null));
        axios_1["default"].get(queryURL).then(function (res) {
            setLoading(react_1["default"].createElement(react_1["default"].Fragment, null));
            console.log(res);
            // store city name and populate the previously searched list.
            localStorage.setItem("prevCities", JSON.stringify(prevCities));
            localStorage.setItem("lastForecast", JSON.stringify(res));
        })["catch"](function (err) {
            console.error(err);
            setLoading(react_1["default"].createElement(react_1["default"].Fragment, null));
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
    return (react_1["default"].createElement("div", { className: "App" },
        loading,
        react_1["default"].createElement(Clock_1["default"], null),
        react_1["default"].createElement(react_bootstrap_1.Form, { onSubmit: function (event) { return searchForecast(event); } },
            react_1["default"].createElement(react_bootstrap_1.Form.Group, { controlId: "formCity" },
                react_1["default"].createElement(react_bootstrap_1.Form.Label, null, "City"),
                react_1["default"].createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "City Name" }),
                react_1["default"].createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Enter a city name to search the weather in that city.")),
            react_1["default"].createElement(react_bootstrap_1.Button, { variant: "primary", type: "submit" }, "Submit"))));
}
exports["default"] = App;
