"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
function ForecastCard(props) {
    return (react_1["default"].createElement(react_bootstrap_1.Col, { lg: 2 },
        react_1["default"].createElement(react_bootstrap_1.Card, { style: { width: '12em' } },
            react_1["default"].createElement(react_bootstrap_1.Card.Body, { className: 'current-conditions' },
                react_1["default"].createElement(react_bootstrap_1.Card.Title, null, props.futureDate),
                react_1["default"].createElement(react_bootstrap_1.Image, { src: props.iconURL, className: 'card-img-top current-weather-icon', alt: "forecast for " + props.future + " day(s) out" }),
                react_1["default"].createElement(react_bootstrap_1.Card.Text, null, props.cardText3),
                react_1["default"].createElement(react_bootstrap_1.Card.Text, null, props.cardText1),
                react_1["default"].createElement(react_bootstrap_1.Card.Text, null, props.cardText2)))));
}
exports["default"] = ForecastCard;
