const express = require("express");
const logger = require("morgan");
const routes = require("./routes/index.js");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(logger("dev"));

app.use(express.urlencoded( {extended: true} ));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(routes);
app.use(express.static("public"));
// port 3000 uses the react routes
// with this setup, express is on port 3001
// and the react front end is on 3000

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
