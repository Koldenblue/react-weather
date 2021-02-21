"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
function ForecastCards(props) {
    return (react_1["default"].createElement(react_bootstrap_1.Card, null,
        react_1["default"].createElement(react_bootstrap_1.Card.Body, null,
            react_1["default"].createElement(react_bootstrap_1.Card.Title, null, props.futureDate),
            props.weatherIcon,
            react_1["default"].createElement(react_bootstrap_1.Card.Text, null,
                react_1["default"].createElement("p", null, props.cardText1)),
            react_1["default"].createElement(react_bootstrap_1.Card.Text, null,
                react_1["default"].createElement("p", null, props.cardText2)),
            react_1["default"].createElement(react_bootstrap_1.Card.Text, null,
                react_1["default"].createElement("p", null, props.cardText3)))));
}
exports["default"] = ForecastCards;
