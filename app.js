const express = require("express");
const dotenv = require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const googleAuthLib = require("google-auth-library");

const env = process.env;
let app = express();
const port = 3000;

app.get("/ara", (req, res, next) => {
  const response = getAraSheet();
  res.send(response);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

async function authorize() {
  try {
    const auth = await new google.auth.GoogleAuth({
      keyFile: "./SECRET-API-KEY.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log(auth);
    return auth;
  } catch (err) {
    console.error(err);
  }
}

async function getAraSheet() {
  const auth = authorize();
  const request = {
    spreadsheetId: "14TKTeY8TFYASxbetfyKc8GJRDEtp-zIZOEBbRbLkumM",
    range: "A2:D2",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: auth,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    return response;
  } catch (err) {
    console.error(err);
  }
}
const test = JSON.parse(env.CREDS);
console.log("Would be nice to hear " + test);
