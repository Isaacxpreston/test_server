var express = require('express')
var axios = require('axios')
var app = express()
var port = process.env.PORT || 3000

var token;


app.get('/', function (req, res) {

  //construct the request
  var authRequest = {"Database": "Tufenkian2007","UID": "ISAAC","Password": "verbalplusvisual2"}
  
  var auth_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/Authenticate"

  axios.post(auth_url, JSON.stringify(authRequest))
  .then(function (response, err) {
    if(response.data["Code"] === 0) {
      token = response.data["Data"]["Token"]
      res.send(token)
    } else {
      res.send("invalid credentials")
    }
  })
  .catch((err) => {
    console.log("ERROR", err.data)
    res.send("server error")
  })
  
})

app.listen(port, function () {
  console.log("running on " + port)
})