const express = require("express");
const googleService = require("./Services/GoogleService");

const env = process.env;

let app = express();
const port = 3000;

app.get("/ara", async (req, res, next) => {
  try {
    const response = await googleService.getAraSheet();
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

app.post("/ara", async (req, res, next) => {
  try {
    const response = await googleService.postNewMerchAra(req);
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
