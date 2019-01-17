var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes.js");
var app = express();

app.use(bodyParser.json({limit: '500mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

routes(app);

var server = app.listen(8080, function () {
    console.log("app running on port.", server.address().port);
});
