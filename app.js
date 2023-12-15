const express = require("express");
const path = require("path");
const session = require("express-session");
const fs = require("fs");
const app = express();
const _dirname = path.resolve();

app.use(
  session({
    secret: "BETTER@LEAVE",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("views", path.join(_dirname, "../views"));
app.set("view engine", "ejs");

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(_dirname, "../public")));

    
const dashboardPages = require("./routes/dashboardPages");
const dashboardApis = require("./routes/dashboardApis");
app.use("/", dashboardPages);
app.use("/api", dashboardApis);

 
// Define route to get image
app.get("/images", function (req, res) {
  const imagePath = path.join(__dirname, "public", req.query.id);

  // Check if image file exists
  if (fs.existsSync(imagePath)) {
    // Set content type as image
    res.setHeader("Content-Type", "image/jpeg");
    // Send the image
    res.sendFile(imagePath);
  } else {
    // Send error message if image file doesn't exist
    res.status(404).send("Image not found");
  }
});

module.exports = { app };
