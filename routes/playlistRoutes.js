const express = require("express");
const playlistController = require("../controllers/playlistController");
const isSignedIn = require("../middleware/is-signed-in");

const router = express.Router();



router.get("/", isSignedIn, playlistController.getAllPlaylists);
router.get("/new", isSignedIn, playlistController.getCreatePlaylist);
router.post("/", isSignedIn, playlistController.createPlaylist);
router.get("/:id", isSignedIn, playlistController.getPlaylistById);
router.put("/:id", isSignedIn, playlistController.updatePlaylist);
router.get("/:id/edit", isSignedIn, playlistController.getEditPlaylist);
router.post("/:id", isSignedIn, playlistController.addTrackToPlaylist);
router.delete("/:id/remove/:trackId", isSignedIn, playlistController.removeTrackFromPlaylist);
router.delete("/:id", isSignedIn, playlistController.deletePlaylist);

module.exports = router;
