var express = require('express')
var axios = require('axios')
var app = express()
var port = process.env.PORT || 3000

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var addNewEntry = (token, context) => {
  var post_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/AbEntryCreate"
  var createRequest = {
    Token: token,
    "AbEntry": {
      "Data": {
        "Key": null,
        "Type": "Individual",
        "LastName": "Preston",
        "FirstName": "Isaac",
        "Email": "isaac@verbalplusvisual.com",
        "Phone": "267-243-6875",
        "Udf/$NAME(Leads\\GetNewsletter)": [
          "2"
        ],
        "Udf/$NAME(Sales\\Lead status)": [
          "57998"
        ]
      }
    }
  };

  axios.post(post_url, JSON.stringify(createRequest))
  .then(function (response, err) {
    console.log(response.data)
    context.send("success!")
  })
  .catch((err) => {
    context.send("server error")
  })
}


app.get('*', function (req, res) {

  //construct the request
  var authRequest = {"Database": "Tufenkian2007","UID": "ISAAC","Password": "verbalplusvisual2"}

  var auth_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/Authenticate"

  axios.post(auth_url, JSON.stringify(authRequest))
  .then(function (response, err) {
    if(response.data["Code"] === 0) {
      var token = response.data["Data"]["Token"]
      addNewEntry(token, res)
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
