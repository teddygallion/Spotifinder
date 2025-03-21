const axios = require("axios");

const addEmbedUrls = async (req, res, next) => {
  if (!res.locals.tracks) return next(); // Skip if no tracks

  try {
    const embedPromises = res.locals.tracks.map(async (track) => {
      const embedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${track.spotifyId}`;

      const { data } = await axios.get(embedUrl);
      return { ...track, embedHtml: data.html }; // Attach embed HTML
    });

    res.locals.tracks = await Promise.all(embedPromises);
    next();
  } catch (error) {
    console.error("Error fetching OEmbed:", error.message);
    next(); // Don't block request if OEmbed fails
  }
};

module.exports = addEmbedUrls;