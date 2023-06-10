const express = require("express");
const dotenv = require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { JWT } = require("google-auth-library");
const fs = require("fs");

const env = process.env;
const keyFile = env.GOOGLE_APPLICATION_CREDENTIALS;

let app = express();
const port = 3000;

app.get("/ara", async (req, res, next) => {
  try {
    const response = await getAraSheet();
    console.log(response);
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const jsonCreds = JSON.parse(fs.readFileSync(keyFile, "utf-8"));
// TODO don't forget to give the service account access to the sheets in question
// maybe a folder or something lol
const client = new JWT({
  email: jsonCreds.client_email,
  key: jsonCreds.private_key,
  scopes: [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

async function getAraSheet() {
  const request = {
    spreadsheetId: "14TKTeY8TFYASxbetfyKc8GJRDEtp-zIZOEBbRbLkumM",
    range: "A:D",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: client,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    return response.data.values;
  } catch (err) {
    console.error(err);
  }
}
