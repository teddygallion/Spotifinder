const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },   title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  duration_ms: { type: Number },
  albumCover: { type: String },   previewUrl: { type: String } });

const Track = mongoose.models.Track || mongoose.model('Track', TrackSchema);
module.exports = Track;