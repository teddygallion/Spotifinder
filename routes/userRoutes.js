const express = require("express");
const userController = require("../controllers/userController");
const isSignedIn = require("../middleware/is-signed-in");
const fetchPlaylists = require("../middleware/fetchPlaylists");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:userId", isSignedIn, fetchPlaylists, userController.getUserProfile);
router.get("/playlists", isSignedIn, fetchPlaylists, userController.getUserPlaylists);
router.get("/connect-spotify", isSignedIn, userController.connectSpotify);
router.get("/:userId/library", isSignedIn, userController.getUserLibrary);
router.post("/:userId/library", isSignedIn, userController.addTrackToUserLibrary)
module.exports = router;