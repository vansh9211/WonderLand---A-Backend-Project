const express = require("express");
const app = express();
const mongoose = require("mongoose");

const session = require("express-session");
const flash = require("connect-flash");

const mongoStore = require("connect-mongo");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./ErrorClass/ExpressError.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//routes
const listingRoutes = require("./Routes/listingRoutes.js");
const listingReviewRoutes = require("./Routes/listingReviewsRoutes.js");
const userRoutes = require("./Routes/userRoutes.js");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); // User model dependency

const PORT = 3008;

const DB_URL =
  "mongodb+srv://Vansh:231980@listingcluster.vpecpda.mongodb.net/?appName=ListingCluster";

// FIX 1: Define the session store using the correct secret
const store = mongoStore.create({
  mongoUrl: DB_URL, // Use the correct connection string
  crypto: {
    secret: "mySuperSecretCode",
  },
  touchAfter: 24 * 3600, // means after 24 hours session will update
});

// Handle store errors
store.on("error", (error) => {
  console.log("Error in Mongo Session Store:", error);
});

// Connect to DB
async function connectToDB() {
  await mongoose.connect(DB_URL);
}
connectToDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB Connection Error:", err));

// EJS setup & Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// 1. Session Middleware (Must run before flash and passport)
const sessionOptions = {
  // CRITICAL FIX: Pass the persistent store object
  store: store,
  secret: "mySuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

// Use the session options with the mongo store
app.use(session(sessionOptions));
app.use(flash()); // 2. Flash Middleware (Must run after session)

// 3. Passport Initialization (Must run after session)
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration (Uses User model)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 4. Global Flash Message & Local Variables Middleware
app.use((req, resp, next) => {
  // Make flash messages available to all templates
  resp.locals.successMsg = req.flash("success");
  resp.locals.errorMsg = req.flash("error");

  // Pass user object (if authenticated) to all templates
  resp.locals.currentUser = req.user;
  next();
});

// ---------------- ROUTERS ---------------- //
app.use("/listing", listingRoutes);
app.use("/listing/:id/reviews", listingReviewRoutes);
app.use("/", userRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { status, message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/listing`);
});
