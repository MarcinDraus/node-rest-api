const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// const corsOptions = {
//    origin: 'http://localhost:3000', // Adres front-endu
//    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//    credentials: true, // Włącz obsługę ciasteczek (jeśli korzystasz z sesji)
//    optionsSuccessStatus: 204,
//  };
 
//  app.use(cors(corsOptions));
 

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


app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});

