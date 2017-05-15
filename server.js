var express = require('express')
var bodyParser = require('body-parser')
var axios = require('axios')
var app = express()
var port = process.env.PORT || 3000

app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var addNewEntry = (token, context, requestObject) => {
  var post_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/AbEntryCreate"
  var createRequest = {
    Token: token,
    "AbEntry": {
      "Data": {
        "Key": null,
        "Type": "Individual",
        "LastName": requestObject["LastName"],
        "FirstName": requestObject["FirstName"],
        "Email": requestObject["Email"],
        "Phone": requestObject["Phone"],
        "Udf/$NAME(Leads\\GetNewsletter)": [
          "2"
        ]
        // "Udf/$NAME(Sales\\Lead status)": [
        //   "57998"
        // ]
      }
    }
  }
  axios.post(post_url, JSON.stringify(createRequest))
  .then(function (response, err) {
    context.send("success: " + requestObject["FirstName"] + " " + requestObject["LastName"] + " " + request["Email"] + " " + request["Phone"] + " " + response.data["Code"])
  })
  .catch((err) => {
    context.send("server error")
  })
}


app.get('*', function (req, res) {
  res.send('Server running on port ' + port)
})

app.post('*', function (req, res) {
  var authRequest = {"Database": "Tufenkian2007","UID": "ISAAC","Password": "verbalplusvisual2"}
  var requestObject = {
    "FirstName": req.body["FirstName"],
    "LastName": req.body["LastName"],
    "Email": req.body["Email"],
    "Phone": req.body["Phone"]
  }
  var auth_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/Authenticate"

  axios.post(auth_url, JSON.stringify(authRequest))
  .then(function (response, err) {
    if(response.data["Code"] === 0) {
      var token = response.data["Data"]["Token"]
      addNewEntry(token, res, requestObject)
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