const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  spotifyId: { type: String, unique: true, sparse: true },   playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],   createdAt: { type: Date, default: Date.now },
  library:[{
    spotifyId: { type: String, required: true },
    title: { type: String, required: true },
    duration_ms: { type: Number },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    albumArt: { type: String, required: true }
  }]
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;