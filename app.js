import express from "express";
import { getAraSheet, postNewMerchAra } from "./Services/GoogleService";

const env = process.env;

let app = express();
const PORT = env.PORT;

app.get("/ara", async (_, res) => {
  try {
    const response = await getAraSheet();
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

app.post("/ara", async (req, res) => {
  try {
    const response = await postNewMerchAra(req);
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
  console.log(`Server started in mode '${process.env.NODE_ENV}'`);
});
