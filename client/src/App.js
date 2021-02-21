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
function App() {
    var _a = react_1.useState(react_1["default"].createElement(react_1["default"].Fragment, null)), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState([]), prevCities = _b[0], setPrevCities = _b[1];
    var currentTime = dayjs_1["default"]().format();
    function searchForecast(event) {
        event.preventDefault();
        console.log(event.target[0].value);
        var cityName = "los angeles";
        var queryURL = "https://openweathermap.org/data/2.5/weather?q="
            + cityName
            + "&appid=" + "";
        setLoading(react_1["default"].createElement(Loading_1["default"], null));
        // axios.get(queryURL).then(res => {
        axios_1["default"].get('/api/weather').then(function (res) {
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
