const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const recipeRoutes = require('./routes/recipeRoutes'); 
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes')
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/recipeBook')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/recipes', recipeRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/login', authRoutes);
app.use('/api/favorites', favoritesRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
