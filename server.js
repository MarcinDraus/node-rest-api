const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

const port = process.env.PORT || 8000;
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
const db = require('./db');
const testimonialsRoutes = require('./routes/testimonials.routes');
const testimonialsConcerts = require('./routes/concerts.routes');
const testimonialsSeats = require('./routes/seats.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', testimonialsRoutes);
app.use('/api', testimonialsConcerts);
app.use('/api', testimonialsSeats);

// Obsługa plików statycznych z folderu client/build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Obsługa wszystkich innych żądań, przekierowuje na index.html z Reacta
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});

