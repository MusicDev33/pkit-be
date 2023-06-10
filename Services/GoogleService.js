const dotenv = require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { JWT } = require("google-auth-library");
const fs = require("fs");
const env = process.env;

class GoogleService {
  constructor() {
    const keyFile = `./${env.GOOGLE_APPLICATION_CREDENTIALS}`;
    const jsonCreds = JSON.parse(fs.readFileSync(keyFile, "utf-8"));
    // TODO don't forget to give the service account access to the sheets in question
    // maybe a folder or something lol
    this.client = new JWT({
      email: jsonCreds.client_email,
      key: jsonCreds.private_key,
      scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });
  }

  async getAraSheet() {
    const request = {
      spreadsheetId: env.SHEET_ID,
      range: "A:D",
      valueRenderOption: "FORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
      auth: this.client,
    };

    try {
      const response = await sheets.spreadsheets.values.get(request);
      return response.data.values;
    } catch (err) {
      console.error(err);
    }
  }

  // RECEIVES OBJECT formatted
  // {
  //     "range": string,
  //     "majorDimension": 'ROWS',
  //     "values": [[row data], [next row data]]
  //   }
  async postNewMerchAra(req) {
    console.log(req.query.ValueRange);
    const dataToAppend = JSON.parse(req.query.ValueRange);
    const params = {
      includeValuesInResponse: true,
      insertDataOption: "OVERWRITE",
      range: "G:O",
      responseDateTimeRenderOption: "FORMATTED_STRING",
      responseValueRenderOption: "FORMATTED_VALUE",
      spreadsheetId: env.SHEET_ID,
      valueInputOption: "RAW",
      requestBody: dataToAppend,
      auth: this.client,
    };
    try {
      const response = await sheets.spreadsheets.values.append(params);
      return response.data.values;
    } catch (error) {
      console.error(error);
    }
  }
}
const googleService = new GoogleService();
module.exports = googleService;
