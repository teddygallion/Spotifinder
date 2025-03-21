const User = require("../models/User");
const Playlist = require("../models/Playlist");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/index", { users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving users.");
  }
};


const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;     const user = await User.findById(userId);     if (!user) {
      return res.status(404).send("User not found");
    }
        res.render('user/profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user profile");
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id });
    res.render("users/playlists", { playlists });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving user playlists.");
  }
};
const getAddSongPage = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);     res.render('playlists/add-song', { user: req.user, playlist: playlist });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving playlist.");
  }
};
const getUserLibrary = async (req, res) => {
  try {
        const user = await User.findById(req.session.user._id);
    
    if (!user) {
      return res.status(404).send("User not found.");
    }

        const library = user.library || [];

        res.render('user/library', { 
      user: req.session.user, 
      library: library
    });
  } catch (error) {
    console.error("Error retrieving user library:", error);
    res.status(500).send("Error retrieving user library.");
  }
};

const addTrackToUserLibrary = async (req, res) => {
  try {
    const { spotifyId, title, artist, album, albumArt, duration_ms } = req.body;

        const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

        user.library = user.library || [];

        const existingTrack = user.library.find(track => track.spotifyId === spotifyId);
    if (existingTrack) {
      return res.status(400).send("Track already exists in your collection.");
    }

        const newTrack = {
      spotifyId,
      title,
      artist,
      album,
      albumArt,
      duration_ms
    };

        user.library.push(newTrack);
    await user.save();

    res.redirect(`/users/${req.session.user._id}/library`);   } catch (error) {
    console.error("Error adding track to collection:", error);
    res.status(500).send("Error adding track to collection.");
  }
};
const removeTrackFromLibrary = async (req, res) => {
  try {
    const { userId } = req.params;
    const { spotifyId } = req.body; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

        user.library = user.library.filter(track => track.spotifyId !== spotifyId);

    await user.save();
    res.redirect("/users/" + userId + "/library");   } catch (error) {
    console.error("Error removing track:", error);
    res.status(500).send("Server error");
  }
};

const connectSpotify = (req, res) => {
    res.send("Connecting with Spotify...");
};

module.exports = {
  getAllUsers,
  getUserProfile,
  getAddSongPage,
  getUserLibrary,
  removeTrackFromLibrary,
  addTrackToUserLibrary,
  getUserPlaylists,
  connectSpotify
};
