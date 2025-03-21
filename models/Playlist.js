const mongoose = require("mongoose")

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Playlist owner
  tracks: [{
    spotifyId: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true }, 
    duration_ms: { type: Number },
    albumArt: { type: String, required: true }
  }],
  isPublic: { type: Boolean, default: true },
  isCollaborative: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;