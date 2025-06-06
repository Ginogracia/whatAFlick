const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const swaggerDocument = YAML.load('./docs/swagger.yaml'); // adjust path as needed

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const movieRoute = require('./routes/movies');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/user');

// Swagger Stuff
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/movies', movieRoute);
app.use('/reviews', reviewRoute);
app.use('/', userRoute); // handles /user and related routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
