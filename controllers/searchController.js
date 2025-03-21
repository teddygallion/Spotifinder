const axios = require("axios");
const { getAccessToken } = require("../utils/spotifyAuth");

const search = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.render("search/searchResults", { tracks: [], query, oEmbedScript: false });

  try {
    const accessToken = await getAccessToken(); 
    const spotifySearchResults = await axios.get("https://api.spotify.com/v1/search", {
      params: { q: query, type: "track", limit: 10 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const tracks = spotifySearchResults.data.tracks.items;

        const user = req.session.user || ""; 
        res.render("search/searchResults", { tracks, query, oEmbedScript: true, user });
  } catch (error) {
    console.error("Error during search:", error.response?.data || error.message);
    res.status(500).send("Error during search.");
  }
};
module.exports = { search };
