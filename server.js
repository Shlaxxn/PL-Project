var express = require("express");
var app = express();
var dotenv = require('dotenv');
var path = require("path");
dotenv.config();
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));

function onHttpStart() {
console.log("Express http server listening on: " +
HTTP_PORT);
}
app.get("/", function(req,res){
res.sendFile(path.join(__dirname, "views/home.html"));
})
app.get("/game-stats", function(req,res){
res.sendFile(path.join(__dirname, "views/game-stats.html"));
});
app.get("/deck-stats", function(req,res){
res.sendFile(path.join(__dirname, "views/deck-stats.html"));
});
app.listen(HTTP_PORT, onHttpStart);