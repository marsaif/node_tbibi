var express = require("express");
var router = express.Router();
var axios = require("axios");

const api_key =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1hcnpvdWdhLnNhaWZAaG90bWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6Ijc2OTIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIxMDkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiMTAwIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiQmFzaWMiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xhbmd1YWdlIjoiZW4tZ2IiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDk5LTEyLTMxIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwc3RhcnQiOiIyMDIyLTAyLTE2IiwiaXNzIjoiaHR0cHM6Ly9hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNjUxODA4MzQyLCJuYmYiOjE2NTE4MDExNDJ9.bk73Chzd8W4NE1X8bkBSlM4eG4z97Zi-A1_IyH3iUic";
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
