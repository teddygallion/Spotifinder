const axios = require("axios");

const addEmbedUrls = async (req, res, next) => {
  if (!res.locals.tracks) return next(); 
  try {
    const embedPromises = res.locals.tracks.map(async (track) => {
      const embedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${track.spotifyId}`;

      const { data } = await axios.get(embedUrl);
      return { ...track, embedHtml: data.html };     });

    res.locals.tracks = await Promise.all(embedPromises);
    next();
  } catch (error) {
    console.error("Error fetching OEmbed:", error.message);
    next();   }
};

module.exports = addEmbedUrls;