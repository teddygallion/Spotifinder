const axios = require("axios");
const { getAccessToken } = require("../utils/spotifyAuth");

const search = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.render("search/searchResults", { tracks: [], query, oEmbedScript: false });

  try {
    const accessToken = await getAccessToken(); // Fetch access token

    const spotifySearchResults = await axios.get("https://api.spotify.com/v1/search", {
      params: { q: query, type: "track", limit: 10 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const tracks = spotifySearchResults.data.tracks.items;

    // Assuming you have a way to get the current user, like from the session
    const user = req.session.user || ""; // or however the user is stored in your session

    // Pass user object to the view
    res.render("search/searchResults", { tracks, query, oEmbedScript: true, user });
  } catch (error) {
    console.error("Error during search:", error.response?.data || error.message);
    res.status(500).send("Error during search.");
  }
};
module.exports = { search };
