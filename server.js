const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
const db = require('./db');
//const router = express.Router();
const testimonialsRoutes = require('./routes/testimonials.routes');
const testimonialsConcerts = require('./routes/concerts.routes');
const testimonialsSeats = require('./routes/seats.routes')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', testimonialsRoutes);
app.use('/api', testimonialsConcerts);
app.use('/api', testimonialsSeats);


app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});

