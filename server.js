var express = require('express')
var axios = require('axios')
var app = express()
var port = process.env.PORT || 3000

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var addNewEntry = (token) => {
  console.log("new entry called")
  var post_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/AbEntryCreate"
  var createRequest = {
    Token: token,
    AbEntry: {
      Data: {
        "Key": null,
        "Type": "Individual",
        "LastName": "Somogyi",
        "FirstName": "Peter YO",
        "Email": "petersomogyi@maximizer.com",
        "Phone": "604-601-8071",
        "Udf/$NAME(Leads\\GetNewsletter)": [
        "2"
        ]
      }
    }
  };

  axios.post(post_url, JSON.stringify(createRequest))
  .then(function (response, err) {
    res.send("yeah man it worked")
  })
  .catch((err) => {
    console.log("ERROR", err.data)
    res.send("server error")
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
      addNewEntry(token)
      //res.send(token)
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
