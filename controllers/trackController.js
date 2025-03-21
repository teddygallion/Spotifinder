const axios = require("axios")

const Track = require("../models/Track");
const User = require("../models/User");

const { getAccessToken } = require("../utils/spotifyAuth"); 


const getAllTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.locals.tracks = tracks;     next();   } catch (error) {
    console.error("Error retrieving tracks:", error.message);
    res.status(500).send("Error retrieving tracks.");
  }
};

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
    res.json(response.data);   } catch (error) {
    console.error("Error fetching OEmbed:", error.message);
    res.status(500).json({ error: "Failed to load Spotify player" });
  }
};

const addTrackToUserLibrary = async (req, res) => {
  const trackId = req.params.trackId;   const userId = req.session.user._id; 
  try {
        let track = await Track.findOne({ spotifyId: trackId });

    if (!track) {
            const accessToken = await getAccessToken();
      const spotifyTrack = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

            track = new Track({
        name: spotifyTrack.data.name,
        artist: spotifyTrack.data.artists[0].name,
        album: spotifyTrack.data.album.name,
        spotifyId: spotifyTrack.data.id,
      });

            await track.save();
    }

        const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

        user.tracks.push(track._id);
    await user.save();

    res.redirect(`/users/${user._id}`);   } catch (error) {
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
