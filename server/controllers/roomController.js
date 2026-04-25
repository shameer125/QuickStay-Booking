const Room = require("../models/Room");

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { location, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (location) {
      query["location.city"] = { $regex: location, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ message: "Room not found" });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  const {
    title,
    description,
    price,
    amenities,
    category,
    type,
    offer,
    existingImages,
    location,
  } = req.body;

  let parsedLocation = {};
  if (location) {
    parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;
  } else {
    parsedLocation = {
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
    };
  }

  let imageUrls = [];
  if (existingImages) {
    imageUrls =
      typeof existingImages === "string"
        ? JSON.parse(existingImages)
        : existingImages;
  }
  if (req.files && req.files.length) {
    imageUrls = [...imageUrls, ...req.files.map((file) => file.path)];
  }

  const room = new Room({
    title,
    description,
    location: parsedLocation,
    price: Number(price),
    images: imageUrls,
    amenities:
      typeof amenities === "string" ? JSON.parse(amenities) : amenities,
    category,
    type,
    offer: Number(offer),
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    room.title = req.body.title || room.title;
    room.description = req.body.description || room.description;

    if (req.body.location) {
      room.location =
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location;
    } else {
      room.location = {
        address: req.body.address || room.location.address,
        city: req.body.city || room.location.city,
        country: req.body.country || room.location.country,
      };
    }

    room.price = req.body.price ? Number(req.body.price) : room.price;

    const existingImages = req.body.existingImages
      ? typeof req.body.existingImages === "string"
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages
      : room.images;

    const uploadedImages =
      req.files && req.files.length ? req.files.map((file) => file.path) : [];
    room.images = [...existingImages, ...uploadedImages];

    room.amenities = req.body.amenities
      ? typeof req.body.amenities === "string"
        ? JSON.parse(req.body.amenities)
        : req.body.amenities
      : room.amenities;
    room.category = req.body.category || room.category;
    room.type = req.body.type || room.type;
    room.offer = req.body.offer ? Number(req.body.offer) : room.offer;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404).json({ message: "Room not found" });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    await room.deleteOne();
    res.json({ message: "Room removed" });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
