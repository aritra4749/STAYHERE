const express = require("express");
const router = express.Router();
const Room = require('../models/room');
const moment = require('moment');
const mongoose = require('mongoose');

// Helper function to format dates safely
const formatDate = (date) => {
  const formattedDate = moment(date);
  return formattedDate.format('DD-MM-YYYY');
};

// Route to get all rooms with properly formatted dates
router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    const formattedRooms = rooms.map(room => ({
      ...room.toObject(),
      currentbookings: room.currentbookings.map(booking => ({
        ...booking._doc,
        fromDate: formatDate(booking.fromDate),
        toDate: formatDate(booking.toDate)
      }))
    }));
    res.send(formattedRooms);
  } catch (error) {
    console.error('Error fetching all rooms:', error.message || error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Route to get a room by ID with properly formatted dates
router.post("/getroombyid", async (req, res) => {
  const { roomid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(roomid)) {
    return res.status(400).json({ message: 'Invalid room ID' });
  }

  try {
    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const formattedRoom = {
      ...room.toObject(),
      currentbookings: room.currentbookings.map(booking => ({
        ...booking._doc,
        fromDate: formatDate(booking.fromDate),
        toDate: formatDate(booking.toDate)
      }))
    };
    res.send(formattedRoom);
  } catch (error) {
    console.error('Error fetching room by ID:', error.message || error);
    res.status(500).json({ message: 'Error fetching room' });
  }
});

// Corrected route name for adding a room
router.post("/addroom", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.send('New room added successfully');
  } catch (error) {
    console.error('Error adding room:', error.message || error);
    res.status(400).json({ message: 'Error adding room', error: error.message || error });
  }
});

module.exports = router;
