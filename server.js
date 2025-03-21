const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");
const fetchPlaylists = require("./middleware/fetchPlaylists")
const app = express();
const port = process.env.PORT || 3000;


const Playlist = require('./models/Playlist'); 
const searchRoutes = require("./routes/searchRoutes.js");
const authController = require("./controllers/auth.js");
const playlistRoutes = require("./routes/playlistRoutes.js");
const trackRoutes = require("./routes/trackRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev")); app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(fetchPlaylists);
app.use("/auth", authController);
app.use("/playlists", playlistRoutes);
app.use("/tracks", trackRoutes);
app.use("/users", userRoutes);
app.use("/search", searchRoutes);
app.get("/", (req, res) => {
    Playlist.find({ isPublic: true })
    .populate('user', 'username')     .sort({ createdAt: -1 })     .limit(10)     .then(publicPlaylists => {
      res.render("index", { 
        user: req.session.user,
        publicPlaylists: publicPlaylists 
      });
    })
    .catch(err => {
      console.error("Error fetching playlists: ", err);
      res.render("index", { user: req.session.user, publicPlaylists: [] });
    });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party, ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

app.listen(port, () => {
  console.log(`The Express app is ready on port ${port}!`);
});
