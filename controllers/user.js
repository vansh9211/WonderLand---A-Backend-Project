const User = require("../models/user.js"); // User model dependency
const passport = require("passport");

module.exports.renderSignUpForm = (req, resp) => {
  resp.render("SignUp.ejs");
};

module.exports.signUp = async (req, resp) => {
  try {
    let { username, password, email } = req.body;
    let newUser = new User({
      username: username,
      email: email,
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      //after sign-up also login automatically - req.login();
      if (err) return next(err);
      req.flash("success", "Login successfully");
      resp.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    resp.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, resp) => {
  resp.render("Login.ejs");
};

(module.exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
})),
  async (req, resp) => {
    req.flash("error", "Welcome Back!");
    resp.redirect("/listing");
  };

module.exports.logout = (req, resp) => {
  req.logout((err) => {
    if (err) return next(err);
    else {
      req.flash("success", "Logout Successfully");
      resp.redirect("/listing");
    }
  });
};
