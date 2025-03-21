const express = require("express");
const trackController = require("../controllers/trackController");
const addEmbedUrls = require("../middleware/embedMiddleware");
const isSignedIn = require("../middleware/is-signed-in");

const router = express.Router();

router.post("/add/:trackId", isSignedIn, trackController.addTrackToUserLibrary);

router.get("/", trackController.getAllTracks, addEmbedUrls, (req, res) => {
  res.render("tracks/index", { tracks: res.locals.tracks });
});

router.get("/:id", trackController.getTrackById);

router.get("/oembed/:trackId", trackController.getOEmbed);

module.exports = router;
