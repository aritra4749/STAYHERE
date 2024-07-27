const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51Ph2CGJ1aBo9Rqazqxj7KJK4cMbTKvlSN2jHQFbS0YmC58KA5mJ1LE3UvmiEhPr5WeyzIO0vWrSWqJgLx42iHyfK009GuoXq3u');

// Route to book a room
router.post('/bookroom', async (req, res) => {
  const { room, userid, fromDate, toDate, totalAmount, totalDays, token } = req.body;

  // Validate required fields
  if (!room || !userid || !fromDate || !toDate || !totalAmount || !totalDays || !token) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Process payment
    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100, // Stripe expects amount in cents
        customer: customer.id,
        currency: 'INR',
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      try {
        // Create a new booking
        const newBooking = new Booking({
          room: room.name,
          roomid: room._id,
          userid,
          fromDate: moment(fromDate, 'DD-MM-YYYY').toDate(),
          toDate: moment(toDate, 'DD-MM-YYYY').toDate(),
          totalAmount,
          totalDays,
          transactionid: payment.id,
        });

        const booking = await newBooking.save();
        console.log('New booking:', booking);

        // Update the room's current bookings
        const roomToUpdate = await Room.findOne({ _id: room._id });
        if (!roomToUpdate) {
          return res.status(404).json({ message: 'Room not found' });
        }

        roomToUpdate.currentbookings.push({
          bookingid: booking._id,
          fromDate: moment(fromDate, 'DD-MM-YYYY').toDate(),
          toDate: moment(toDate, 'DD-MM-YYYY').toDate(),
          userid,
          status: booking.status,
        });

        await roomToUpdate.save();
        console.log('Updated room:', roomToUpdate);

        res.status(200).json({ message: 'Booking successful', booking });
      } catch (error) {
        console.error('Error booking room:', error.message || error);
        res.status(500).json({ message: 'Booking failed', error: error.message });
      }
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error.message || error);
    res.status(400).json({ error: 'Payment processing error' });
  }
});

// Route to get bookings by user ID
router.post('/getbookingsbyuserid', async (req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Route to cancel a booking
router.post('/cancelbooking', async (req, res) => {
  const { bookingId, roomId } = req.body;

  try {
    const bookingItem = await Booking.findOne({ _id: bookingId });
    if (!bookingItem) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    bookingItem.status = 'cancelled';
    await bookingItem.save();

    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.currentbookings = room.currentbookings.filter(booking => booking.bookingid.toString() !== bookingId);
    await room.save();

    res.send('Your booking has been cancelled successfully');
  } catch (error) {
    console.error('Error cancelling booking:', error.message || error);
    return res.status(400).json({ error: error.message });
  }
});

// Route to get all bookings
router.get('/getallbookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
