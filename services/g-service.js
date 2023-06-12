import { google } from "googleapis";
import { JWT } from "google-auth-library";

const sheets = google.sheets("v4");

require("dotenv").config();
const env = process.env;

const gClient = new JWT({
  email: env.G_CLIENT_EMAIL,
  key: env.G_PRIV_KEY,
  scopes: [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const getAraSheet = async () => {
  const request = {
    spreadsheetId: env.SHEET_ID,
    range: "A:D",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: gClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    return response.data.values;
  } catch (err) {
    console.error(err);
  }
}

const postNewAraMerch = async () => {
  console.log(req.query.ValueRange);
  const params = {
    includeValuesInResponse: true,
    insertDataOption: "OVERWRITE",
    range: "G:O",
    responseDateTimeRenderOption: "FORMATTED_STRING",
    responseValueRenderOption: "FORMATTED_VALUE",
    spreadsheetId: env.SHEET_ID,
    valueInputOption: "RAW",
    requestBody: JSON.parse(req.query.ValueRange),
    auth: gClient,
  };

  try {
    const response = await sheets.spreadsheets.values.append(params);
    return response.data.values;
  } catch (error) {
    console.error(error);
  }
}

export default {
  getAraSheet,
  postNewAraMerch
}
