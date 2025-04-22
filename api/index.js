

const express = require("express");
const path = require("path");
const db = require("../config/mongoose-connection");
const cookieParser = require("cookie-parser");
const upload = require("../config/multer");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const adminRouter = require("../routes/adminRouter");
const pageRouter = require("../routes/pageRouter");
const aboutRoutes = require("../routes/aboutRouter");
const userRouter = require("../routes/userRouter");
const studentRoutes = require("../routes/studentRouter");
const galleryRoutes = require("../routes/galleryRoutes");
const parentRoutes = require("../routes/parentRoutes");
const adRouter = require("../routes/adRouter");
const imghomeRouter = require("../routes/imagehomeRouter");
const Ad = require("../models/ad");
const app = express();
const dev = process.env.NODE_ENV;
// require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("MongoStore connection string:", process.env.DATA_BASE);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATA_BASE,
      collectionName: "usersessions",
      ttl: 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);

const methodOverride = require("method-override");
const isLoggedin = require("../middlewares/isLoggedin");
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "..", "public"), { maxAge: "7d" }));

app.use("/admin", isLoggedin, adminRouter);
app.use("/", pageRouter);
app.use("/", imghomeRouter);
app.use("/admin", isLoggedin, aboutRoutes);
app.use("/users", userRouter);
app.use("/admin/tc", isLoggedin, studentRoutes);
app.use("/admin/parent", isLoggedin, parentRoutes);
app.use("/admin/ads", isLoggedin, adRouter);

app.use("/admin/gallery", galleryRoutes);
const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

db()
  .then(() => {
    app.listen(PORT, () => {
      if (dev === "dev") {
        console.log(`Server running on port ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });


// db()
//   .then(() => {
//     app.listen(PORT, () => {
//       if (dev === "dev") {
//         console.log(`Server running on port ${PORT}`);
//       }
//     });
//   })
//   .catch((err: Error) => {
//     console.error("Error connecting to the database:", err);
//     process.exit(1);
//   });

module.exports = app;
