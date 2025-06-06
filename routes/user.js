const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const verifyToken = require('../middleware/verifyToken');

//Get logged in user.
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});


//Get all reviews made by logged in user.
router.get('/user/review', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const reviews = await Review.find({ userId })
      .populate('movieId', 'title director releaseYear')
      .lean();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user reviews.' });
  }
});

//Get username by userId
router.get('/user/:id', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.sendStatus(404);
  res.json({ name: user.name });
});



// Delete logged-in user's account all of their reviews.
router.delete('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const deletedUser = await User.findByIdAndDelete(userId).lean();

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Delete all reviews made from this user
    await Review.deleteMany({ userId });

    res.json({
      message: `Account '${deletedUser.name}' and all related reviews have been deleted.`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

module.exports = router;