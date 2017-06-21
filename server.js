var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var app = express();
var md5 = require('md5');
var port = process.env.PORT || 3000;

//  var api_keys =  require('./keys.js');
var api_keys = process.env.MAILCHIMP

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var addNewEntry = (token, context, requestObject) => {
  console.log(requestObject)
  var post_url = "http://74.95.35.226:6060/MaximizerWebData/Data.svc/json/AbEntryCreate"
  var createRequest = {
    Token: token,
    "AbEntry": {
      "Data": {
        "Key": null,
        "Type": "Individual",
        "CompanyName": requestObject["CompanyName"] ? requestObject["CompanyName"].slice(0, 79) : "",
        "LastName": requestObject["LastName"] ? requestObject["LastName"].slice(0, 79) : "",
        "FirstName": requestObject["FirstName"] ? requestObject["FirstName"].slice(0, 79) :  "",
        "Email": requestObject["Email"] ? requestObject["Email"].slice(0, 255) : "",
        "Phone": requestObject["Phone"] ? requestObject["Phone"].slice(0, 21) : "",
        "Address": {
          "AddressLine1": requestObject["AddressLine1"] ? requestObject["AddressLine1"].slice(0, 79) : "",
          "AddressLine2": requestObject["AddressLine2"] ? requestObject["AddressLine2"].slice(0, 79) : "",
          "ZipCode": requestObject["ZipCode"] ? requestObject["ZipCode"].slice(0, 79) : "",
          "City": requestObject["City"] ? requestObject["City"].slice(0, 79) : "",
          "StateProvince": requestObject["StateProvince"] ? requestObject["StateProvince"].slice(0, 79) : ""
        },
        "Udf/$NAME(Leads\\GetNewsletter)": requestObject["Sub"], //["2"], //set to anything other than 2 for 'No'
        "Udf/$NAME(Leads\\CallMe)": requestObject["Call"], //["2"],
        "Udf/$NAME(Leads\\Contact Invoicing)": requestObject["ContactInvoicing"] ? requestObject["ContactInvoicing"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\Contact Receiving)": requestObject["ContactReceiving"] ? requestObject["ContactReceiving"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\Instagram)": requestObject["SocialMedia"] ? requestObject["SocialMedia"].slice(0, 90) : "",
        "Udf/$NAME(Leads\\Type Entity)": requestObject["TypeEntity"] ? requestObject["TypeEntity"].slice(0, 59) : "",
        "Udf/$NAME(Leads\\State of Resale Lic)": requestObject["StateResale"] ? requestObject["StateResale"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\Resale Tax Number)": requestObject["ResaleTax"] ? requestObject["ResaleTax"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\Years In Business)": requestObject["YearsBusiness"] ? requestObject["YearsBusiness"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\Affiliations)": requestObject["Affiliations"] ? requestObject["Affiliations"].slice(0, 59) : "",
        "Udf/$NAME(Leads\\Showroom)": requestObject["Showroom"] ? requestObject["Showroom"].slice(0, 59) : "",
        "Udf/$NAME(Leads\\MarketingChannel)": requestObject["MarketingChannel"] ? requestObject["MarketingChannel"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\Sales Person)": requestObject["SalesRep"] ? requestObject["SalesRep"].slice(0, 29) : "",
        "Udf/$NAME(Leads\\SearchTerm)": requestObject["SearchTerm"] ? requestObject["SearchTerm"].slice(0, 59) : "Search Term",
        "Udf/$NAME(Leads\\ProductURL)": requestObject["ProductURL"] ? requestObject["ProductURL"].slice(0, 100) : "",
        "Udf/$NAME(Leads\\ProductID)": requestObject["ProductID"] ? requestObject["ProductID"].slice(0, 59) : "",
        "Lead": true
      }
    }
  }
  axios.post(post_url, JSON.stringify(createRequest))
  .then(function (response, err) {
    console.log("POST SUCCESS", response.data)
    context.send(response.data)
  })
  .catch((err) => {
    console.log("POST ERROR", err)
    context.send("server error")
  })
}

app.post('/maximizer', function (req, res) {
  var authRequest = {"Database": "Tufenkian2007","UID": "ISAAC","Password": "verbalplusvisual2"}
  var requestObject = {
    "FirstName": req.body["FirstName"],
    "LastName": req.body["LastName"],
    "Email": req.body["Email"],
    "Phone": req.body["Phone"],
    "AddressLine1": req.body["AddressLine1"],
    "AddressLine2": req.body["AddressLine2"],
    "ZipCode": req.body["ZipCode"],
    "City": req.body["City"],
    "StateProvince": req.body["StateProvince"],
    "CompanyName": req.body["CompanyName"],
    "ContactInvoicing": req.body["ContactInvoicing"],
    "ContactReceiving": req.body["ContactReceiving"],
    "SocialMedia": req.body["SocialMedia"],
    "TypeEntity": req.body["TypeEntity"],
    "StateResale": req.body["StateResale"],
    "ResaleTax": req.body["ResaleTax"],
    "YearsBusiness": req.body["YearsBusiness"],
    "Affiliations": req.body["Affiliations"],
    "Showroom": req.body["Showroom"],
    "MarketingChannel": req.body["Website"],
    "SalesRep": req.body["SalesRep"],
    "SearchTerm": req.body["SearchTerm"],
    "ProductURL": req.body["ProductURL"],
    "ProductID": req.body["ProductID"],
    "Call": req.body["Call"],
    "Sub": req.body["Sub"]
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

app.post('/mailchimp', function(req, res) {
  console.log("received")
  console.log(req.body['email_address'])
  var md_email = md5(req.body['email_address'])
  // var config = { headers: {'Authorization': api_keys.mailchimp_key} }
  var config = { headers: {'Authorization': api_keys} }
  var list_id = "d7fa963c59"
  var mailchimp_url = "https://us15.api.mailchimp.com/3.0/lists/" + list_id + "/members/" + md_email
  axios.put(mailchimp_url, req.body, config)
  .then(function(response, err) {
    console.log("response message")
    console.log(response.data.status)
    res.send("subscribed/updated")
  })
  .catch(function(err) {
    console.log("error message")
    console.log(err.response.data.title)
    res.send(err.response.data)
  })
})

app.get('*', function (req, res) {
  res.send('Server running on port ' + port)
})

app.listen(port, function () {
  console.log("running on " + port)
})