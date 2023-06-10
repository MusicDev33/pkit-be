const express = require("express");
const { google } = require("googleapis");
const sheets = google.sheets("v4");

let app = express();
const port = 3000;

app.get("/ara", (req, res, next) => {
  const response = getAraSheet();
  res.send(response);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./SECRET-API-KEY.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
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

// const testing = getAraSheet();
// console.log(testing);
