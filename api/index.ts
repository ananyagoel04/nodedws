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
const subdomainMap = require("../config/subdomainMap");


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
app.use((req, res, next) => {
    res.locals.req = req;
    next();
});

app.use(express.static(path.join(__dirname, "..", "public"), { maxAge: "7d" }));

// Subdomain middleware
const subdomainMiddleware = require("../middlewares/subdomain.js");
app.use(subdomainMiddleware);

app.use(async (req, res, next) => {
  if (req.subdomain !== "admissions") return next();
  if (req.path !== "/") return next();

  try {
    const homeimgData = await Homeimg.find({}).select("image_url");

    return res.render("admissions", {
      homeimgData,
      subdomain: "admissions",
    });
  } catch (err) {
    console.error("Admissions subdomain error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

app.use((req, res, next) => {
  if (req.subdomain) {
    if (req.path !== "/") {
      return res.redirect(301, `https://divinewisdom.edu.in${req.path}`);
    }
  }
  next();
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
