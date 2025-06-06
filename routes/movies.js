const express = require('express');
const Movie = require('../models/Movie');
const Review = require('../models/Review')

const verifyToken = require('../middleware/verifyToken')
const requireAdmin = require('../middleware/requireAdmin')

const router = express.Router();


//Get details and average ratings for a movie.
router.get('/:id', async (req, res) => { 
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });



    res.json({ ...movie.toJSON() });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

//Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().lean();

    res.json(movies);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

//Add new movie to DB (Requires admin role).
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {

    //Title unique checker..
    if (err.code === 11000 && err.keyPattern?.title) {
      return res.status(409).json({ error: 'A movie with this title already exists.' });
    }

    res.status(400).json({ error: 'Failed to create movie.' });
  }
});

//Update movie details (Requires admin role).
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const movieId = req.params.id;

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    ).lean();

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    res.json(updatedMovie);
  } catch (err) {
    // Title unique checker..
    if (err.code === 11000 && err.keyPattern?.title) {
      return res.status(409).json({ error: 'A movie with this title already exists.' });
    }

    res.status(400).json({ error: 'Failed to update movie.' });
  }
});

//Get all reviews for a specific movie.
router.get('/:id/reviews', async (req, res) => {
  try {
    const movieId = req.params.id;

    const reviews = await Review.find({ movieId }).populate('userId', 'name').lean();

    res.json(reviews);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

//Delete specific movie. (Requires admin role).
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const movieId = req.params.id;

    const deletedMovie = await Movie.findByIdAndDelete(movieId).lean();

    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    await Review.deleteMany({ movieId }); //Delete all related reviews.

    res.json({ message: 'Movie deleted successfully.', movie: deletedMovie });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie.' });
  }
});

module.exports = router;