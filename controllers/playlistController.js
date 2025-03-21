const Playlist = require("../models/Playlist");
// Get all playlists
const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("user tracks");
    res.render("playlists/index", { playlists, user:req.session.user }); // Passing playlists to the view
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving playlists.");
  }
};

// Get a single playlist
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("user"); // No populate("tracks")
    const playlists = await Playlist.find({ user: req.session.user._id });
    if (!playlist) return res.status(404).send("Playlist not found.");

    res.render("playlists/show", { 
      user: req.session.user,
      playlists:playlists,
      playlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving the playlist.");
  }
};
const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.session.user._id });
    res.render("users/playlists", { 
      user: req.session.user, // Ensure user data is passed correctly
      playlists: playlists, // Passing the playlists as well
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving user playlists.");
  }
};
const getCreatePlaylist = async (req,res)=>{
   try{
    const playlists = await Playlist.find({ user: req.session.user._id });
    res.render("playlists/new", { 
      user: req.session.user,
      playlists:playlists, 
     }); 
   }catch(error){
    res.status(500).send("Error retrieving new playlist form.");
   }
}
const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic, isCollaborative } = req.body;
    const userId = req.session.user._id; 

    // Explicitly set default values if the checkbox is not checked
    const isPublicBoolean = isPublic === 'on';  // 'on' for checked, otherwise false
    const isCollaborativeBoolean = isCollaborative === 'on';  // 'on' for checked, otherwise false

    const newPlaylist = new Playlist({
      name,
      description,
      user: userId,
      isPublic: isPublicBoolean,
      isCollaborative: isCollaborativeBoolean,
    });

    await newPlaylist.save();
    res.redirect(`/playlists/${newPlaylist._id}`);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).send("Error creating playlist.");
  }
};
const getEditPlaylist = async (req, res) => {
   try {
      const playlist = await Playlist.findById(req.params.id).populate("user"); 
      const playlists = await Playlist.find({ user: req.session.user._id }); // Keep this for navbar

      if (!playlist) {
         return res.status(404).send("Playlist not found.");
      }

      if (playlist.user._id.toString() !== req.session.user._id.toString()) {
         return res.status(403).send("You do not have permission to edit this playlist.");
      }

      res.render("playlists/edit", { 
         user: req.session.user,
         playlists,  // Keep this for the navbar
         playlist,   // Send the specific playlist being edited
      }); 
   } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving playlist for editing.");
   }
};


const updatePlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    req.body.isPublic = !!req.body.isPublic; // Ensure boolean
    req.body.isCollaborative = !!req.body.isCollaborative; // Ensure boolean

    // Log the playlist ID and user for debugging
    console.log("Playlist ID:", req.params.id);
    console.log("Session User:", req.session.user);
    console.log("Request Body:", req.body);

    // Find the playlist by ID
    const playlist = await Playlist.findById(req.params.id);

    // Check if the playlist exists
    if (!playlist) {
      console.error("Playlist not found for ID:", req.params.id);
      return res.status(404).send("Playlist not found.");
    }

    // Check if the authenticated user owns the playlist
    if (playlist.user.toString() !== req.session.user._id.toString()) {
      console.error("Unauthorized: User does not own this playlist.");
      return res.status(403).send("Unauthorized");
    }

    // Update playlist properties
    playlist.name = name;
    playlist.description = description;
    playlist.isPublic = req.body.isPublic;
    playlist.isCollaborative = req.body.isCollaborative;

    // Save the updated playlist
    await playlist.save();

    // Log the updated playlist
    console.log("Updated Playlist:", playlist);

    // Redirect to the updated playlist's page
    res.redirect(`/playlists/${playlist._id}`);
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).send("Error updating playlist.");
  }
};

const addTrackToPlaylist = async (req, res) => {
  try {
    const { spotifyId, title, artist, album, albumArt, duration_ms } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }

    const newTrack = { spotifyId, title, artist, album, albumArt, duration_ms };

    // Check if track already exists in playlist
    if (playlist.tracks.some(track => track.spotifyId === spotifyId)) {
      return res.status(400).send("Track already exists in the playlist.");
    }

    // Add track to playlist
    playlist.tracks.push(newTrack);
    await playlist.save();

    res.redirect(`/playlists/${playlist._id}`);
  } catch (error) {
    console.error("Error adding track:", error);
    res.status(500).send("Error adding track.");
  }
};


const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { id, trackId } = req.params;
    const playlist = await Playlist.findById(id);

    if (!playlist) return res.status(404).send("Playlist not found.");
    if (playlist.user.toString() !== req.user._id.toString() && !playlist.isCollaborative)
      return res.status(403).send("Unauthorized");

    playlist.tracks = playlist.tracks.filter(track => track.toString() !== trackId);
    await playlist.save();

    res.redirect(`/playlists/${id}`);
  } catch (error) {
    console.error("Error removing track:", error);
    res.status(500).send("Error removing track.");
  }
};
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);

    if (!playlist) return res.status(404).send("Playlist not found.");
    if (playlist.user.toString() !== req.session.user._id.toString()) return res.status(403).send("Unauthorized");

    await Playlist.findByIdAndDelete(id);
    res.redirect("/playlists");
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).send("Error deleting playlist.");
  }
};

module.exports = {
  getAllPlaylists,
  getPlaylistById,
  getUserPlaylists,
  getCreatePlaylist,
  getEditPlaylist,
  createPlaylist,  
  updatePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  deletePlaylist
};