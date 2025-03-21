const User = require("../models/User");
const Playlist = require("../models/Playlist");

// Existing functions
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
    const userId = req.params.userId; // Get userId from the route parameter
    const user = await User.findById(userId); // Fetch the user from the database
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Pass user data to the view (e.g., profile page)
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
    const playlist = await Playlist.findById(req.params.id); // Find the playlist by its ID
    res.render('playlists/add-song', { user: req.user, playlist: playlist });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving playlist.");
  }
};
const getUserLibrary = async (req, res) => {
  try {
    // Find the user by their session ID
    const user = await User.findById(req.session.user._id);
    
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Ensure that library is always an array (even if empty)
    const library = user.library || [];

    // Render the user's library with their tracks
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

    // Find the user by their session ID
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Ensure that library is always an array (even if empty)
    user.library = user.library || [];

    // Check if the track already exists in the user's library
    const existingTrack = user.library.find(track => track.spotifyId === spotifyId);
    if (existingTrack) {
      return res.status(400).send("Track already exists in your collection.");
    }

    // Create a new track object
    const newTrack = {
      spotifyId,
      title,
      artist,
      album,
      albumArt,
      duration_ms
    };

    // Add the track to the user's library
    user.library.push(newTrack);
    await user.save();

    res.redirect(`/users/${req.session.user._id}/library`); // Redirect to the user's library page
  } catch (error) {
    console.error("Error adding track to collection:", error);
    res.status(500).send("Error adding track to collection.");
  }
};


const connectSpotify = (req, res) => {
  // This is a dummy route for now; later, this can be extended for Spotify OAuth
  res.send("Connecting with Spotify...");
};

module.exports = {
  getAllUsers,
  getUserProfile,
  getAddSongPage,
  getUserLibrary,
  addTrackToUserLibrary,
  getUserPlaylists,
  connectSpotify
};
