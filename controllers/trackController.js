const axios = require("axios")

const Track = require("../models/Track");
const User = require("../models/User");

const { getAccessToken } = require("../utils/spotifyAuth"); // Assuming you have this function



const getAllTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.locals.tracks = tracks; // Attach tracks to `res.locals`
    next(); // Pass to embed middleware
  } catch (error) {
    console.error("Error retrieving tracks:", error.message);
    res.status(500).send("Error retrieving tracks.");
  }
};

// Get a single track
const getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    res.render("tracks/show", { track });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving the track.");
  }
};
const getOEmbed = async (req, res) => {
  const trackId = req.params.trackId;

  try {
    const response = await axios.get(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`);
    res.json(response.data); // Send OEmbed data back as JSON
  } catch (error) {
    console.error("Error fetching OEmbed:", error.message);
    res.status(500).json({ error: "Failed to load Spotify player" });
  }
};

// Add track to user's collection
const addTrackToUserLibrary = async (req, res) => {
  const trackId = req.params.trackId; // Track ID from Spotify
  const userId = req.session.user._id; // User ID from the session

  try {
    // Search for the track in the database using the Spotify ID
    let track = await Track.findOne({ spotifyId: trackId });

    if (!track) {
      // If track isn't already in the database, fetch it from Spotify
      const accessToken = await getAccessToken();
      const spotifyTrack = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Create a new track from the Spotify response
      track = new Track({
        name: spotifyTrack.data.name,
        artist: spotifyTrack.data.artists[0].name,
        album: spotifyTrack.data.album.name,
        spotifyId: spotifyTrack.data.id,
      });

      // Save the new track to the database
      await track.save();
    }

    // Find the user and add the track to their collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Add track to the user's collection
    user.tracks.push(track._id);
    await user.save();

    res.redirect(`/users/${user._id}`); // Redirect to user's profile or collection page
  } catch (error) {
    console.error("Error adding track to collection:", error.message);
    res.status(500).send("Error adding track to collection.");
  }
};

module.exports = {
  getAllTracks,
  getTrackById,
  addTrackToUserLibrary,
  getOEmbed, 
};
