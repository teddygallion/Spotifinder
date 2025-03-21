const axios = require("axios");

let accessToken = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  if (accessToken && currentTime < tokenExpiresAt) {
    return accessToken; // Return cached token if still valid
  }

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", 
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: "Basic " + Buffer.from(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiresAt = currentTime + response.data.expires_in; // Update expiration time

    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.response?.data || error.message);
    throw new Error("Failed to get Spotify access token");
  }
};

module.exports = { getAccessToken };
