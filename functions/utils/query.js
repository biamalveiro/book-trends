const axios = require("axios");
require("dotenv").config();

const API_ENDPOINT = "https://data.seattle.gov/resource/tmmm-ytt6.json";

module.exports = async (params) => {
  const { data, errors } = await axios({
    url: API_ENDPOINT,
    method: "GET",
    headers: {
      "X-App-Token": process.env.SEATTLE_APP_TOKEN,
    },
    params: params,
  });

  if (errors) {
    console.error(errors);
    throw new Error("Something went wrong when fetching data");
  }
  return data;
};
