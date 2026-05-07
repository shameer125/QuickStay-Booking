const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET_MISSING");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Common failures when Mongo is down, URI missing, or connection never established */
const isDatabaseUnavailableError = (error) => {
  if (!error) return false;
  const name = error.name || "";
  const msg = String(error.message || "");
  return (
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoTimeoutError" ||
    /buffering timed out|not connected|Topology is closed|MONGODB_URI/i.test(msg)
  );
};

/** Match stored email even if legacy DB rows used different casing */
const findUserByEmail = async (normalizedEmail) => {
  if (!normalizedEmail) return null;
  let user = await User.findOne({ email: normalizedEmail });
  if (user) return user;
  user = await User.findOne({
    email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
  });
  return user;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!name || !email || password == null || password === "") {
      return res.status(400).json({
        message: "Please enter your name, email, and password.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Register blocked: JWT_SECRET is not set in environment");
      return res.status(500).json({
        message:
          "Server is missing JWT_SECRET. Add JWT_SECRET to your server .env and restart.",
      });
    }

    const userExists = await findUserByEmail(email);

    if (userExists) {
      return res.status(400).json({
        message:
          "An account with this email already exists. Sign in instead, or use a different email.",
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.code === 11000 || error.code === "11000") {
      return res.status(400).json({
        message:
          "An account with this email already exists. Try signing in instead.",
      });
    }

    if (error.message === "JWT_SECRET_MISSING") {
      return res.status(500).json({
        message:
          "Server is missing JWT_SECRET. Add JWT_SECRET to your server .env and restart.",
      });
    }

    if (error.name === "ValidationError") {
      const parts = Object.values(error.errors || {}).map((e) => e.message);
      return res.status(400).json({
        message: parts.length ? parts.join(" ") : "Invalid registration data.",
      });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message:
          "Server has no database configuration. Set MONGODB_URI in your server .env and restart.",
      });
    }

    if (isDatabaseUnavailableError(error)) {
      return res.status(503).json({
        message:
          "Database is unavailable. Start MongoDB, check MONGODB_URI in your server .env, and restart the API.",
      });
    }

    console.error("Register error:", error);
    return res.status(500).json({
      message: "Registration failed. Please try again in a moment.",
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error("Login blocked: JWT_SECRET is not set in environment");
      return res.status(500).json({
        message:
          "Server is missing JWT_SECRET. Add JWT_SECRET to your server .env and restart.",
      });
    }

    const user = await findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    if (error.message === "JWT_SECRET_MISSING") {
      return res.status(500).json({
        message:
          "Server is missing JWT_SECRET. Add JWT_SECRET to your server .env and restart.",
      });
    }
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message:
          "Server has no database configuration. Set MONGODB_URI in your server .env and restart.",
      });
    }
    if (isDatabaseUnavailableError(error)) {
      return res.status(503).json({
        message:
          "Database is unavailable. Start MongoDB, check MONGODB_URI in your server .env, and restart the API.",
      });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };

