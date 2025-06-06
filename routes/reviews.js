const express = require('express');
const Review = require('../models/Review');

const verifyToken = require('../middleware/verifyToken')
const requireAdmin = require('../middleware/requireAdmin')

const router = express.Router();

//Post a review and assign a user to the review by checking token.
router.post('/', verifyToken, async (req, res) => {
  try {

    const exists = await Review.findOne({
      userId: req.user.userId,
      movieId: req.body.movieId
    });

    if (exists) {
      return res.status(409).json({ error: 'You have already rated this movie.' });
    }

    const reviewData = {
      ...req.body,
      userId: req.user.userId
    };

    const newReview = new Review(reviewData);
    await newReview.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

//Get every review for every movie ever made (Admin role required).
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('movieId', 'title')

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

//Get details for a specific review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name')    
      .populate('movieId', 'title'); 

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

//Update a specific review.
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;


    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });


    if (review.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You can only edit your own reviews.' });
    }


    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.comment !== undefined) review.comment = req.body.comment;


    await review.save();

    res.json(review);
  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({ error: 'Duplicate review detected.' });
    }

    res.status(500).json({ error: 'Failed to update review.' });
  }
});

//Remove a specific review.
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    // Check ownership
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own reviews.' });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

module.exports = router