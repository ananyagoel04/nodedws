const express = require("express");
const path = require("path");
const db = require("../config/mongoose-connection.js");
const cookieParser = require("cookie-parser");
const upload = require("../config/multer.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const adminRouter = require("../routes/adminRouter.js");
const pageRouter = require("../routes/pageRouter.js");
const aboutRoutes = require("../routes/aboutRouter.js");
const userRouter = require("../routes/userRouter.js");
const studentRoutes = require("../routes/studentRouter.js");
const galleryRoutes = require("../routes/galleryRoutes.js");
const parentRoutes = require("../routes/parentRoutes.js");
const adRouter = require("../routes/adRouter.js");
const imghomeRouter = require("../routes/imagehomeRouter.js");
const newsletterRotuer = require("../routes/newsletterRoutes.js");
const Ad = require("../models/ad.js");
const app = express();
const dev = process.env.NODE_ENV;
const flash = require("connect-flash");
const { Homeimg } = require('../models/home.js');


require("dotenv").config();
// require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
const isLoggedin = require("../middlewares/isLoggedin.js");
app.use(methodOverride("_method"));

app.use(flash());

app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  next();
});


app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "..", "public"), { maxAge: "7d" }));

// Subdomain middleware
const subdomainMiddleware = require("../middlewares/subdomain.js");
app.use(subdomainMiddleware);

app.use(async (req, res, next) => {
  if (!req.subdomain) return next(); // Not a subdomain, go to main site

  // Example: admissions subdomain
  if (req.subdomain === "admissions") {
    // Load the same data as your old /admissions route
    try {
      const homeimgData = await Homeimg.find({}).select("image_url");
      return res.render("admissions", { homeimgData });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(404).send("Subdomain not found");
});


app.use("/admin", isLoggedin, adminRouter);
app.use("/", pageRouter);
app.use("/", imghomeRouter);
app.use("/admin", isLoggedin, aboutRoutes);
app.use("/users", userRouter);
app.use("/admin/tc", isLoggedin, studentRoutes);
app.use("/admin/parent", isLoggedin, parentRoutes);
app.use("/admin/ads", isLoggedin, adRouter);
app.use("/admin/subscribe", isLoggedin, newsletterRotuer);
app.use("/admin/gallery", galleryRoutes);



app.use((req, res) => {
  res.status(404).render("404", {
    url: req.originalUrl
  });
});

const PORT = process.env.PORT || 3000;


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
