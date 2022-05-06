var express = require("express");
var router = express.Router();
var axios = require("axios");

const api_key =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1hcnpvdWdhLnNhaWZAZ21haWwuY29tIiwicm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiI4MDE4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy92ZXJzaW9uIjoiMTA5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9saW1pdCI6IjEwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcCI6IkJhc2ljIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAyMi0wNS0wNiIsImlzcyI6Imh0dHBzOi8vYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTY1MTgzMzIyMCwibmJmIjoxNjUxODI2MDIwfQ.unyI9VMYJ9cIgOKKqgCwz5rvB8RxuDm99MyrU7bt1oM";

/* GET symptoms. */
router.get("/", async function (req, res, next) {
  const url = `https://healthservice.priaid.ch/symptoms?token=${api_key}&format=json&language=en-gb`;
  const data = await axios.get(url);
  //console.log(data["data"]);
  res.send(data["data"]);
});

router.post("/speciality", async function (req, res, next) {
  const url = `https://healthservice.priaid.ch/diagnosis/specialisations?symptoms=[${req.body.symptoms}]&gender=male&year_of_birth=1997&token=${api_key}&format=json&language=en-gb`;
  const data = await axios.get(url);
  //console.log(data["data"]);
  res.send(data["data"]);
});

module.exports = router;
