const Playlist = require("../models/Playlist");

const fetchPlaylists = async (req, res, next) => {
  try {
    if (req.session.user) { // Ensure user is logged in
      res.locals.playlists = await Playlist.find().sort({ createdAt: -1 });
    } else {
      res.locals.playlists = []; // Empty if not authenticated
    }
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.locals.playlists = [];
  }
  next();
};

module.exports = fetchPlaylists;
