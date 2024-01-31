const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();

router.get('/concerts', (req, res) => {
    res.json(db.concerts);
});

router.get('/concerts/random', (req, res) => {
    randomIndex = Math.floor(Math.random() * db.concerts.length);
    randomConcerts = db.concerts[randomIndex];
    if(randomConcerts) {
        res.json(randomConcerts);
    } else {
        res.status(404).json({ error: 'not found concerts' });
    }
});

router.get('/concerts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const result = db.concerts.find(item => item.id === id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({error:'not found concert item'})
    }
});

router.post('/concerts', (req, res) => {
    const { performer, genre, price, day } = req.body
    if (!performer || !genre || !price || !day) {
        const missingFields = [];

        // Znajdź brakujące pola
        if (!performer) missingFields.push('performer');
        if (!genre) missingFields.push('genre');
        if (!price) missingFields.push('price');
        if (!day) missingFields.push('day');

        return res.status(400).json({ error: 'Missing required fields in the request body', missingFields });
    } 
    // Sprawdzenie, czy price jest liczbą
    if (isNaN(price)) {
        return res.status(400).json({ error: 'Invalid data type for price. It should be a number.' });
    }
    const id = uuidv4();
    const newConcert = {
        id,
        performer,
        genre,
        price, 
        day,
    };
    db.concerts.push(newConcert)
    res.status(201).json(newConcert);
});

router.put('/concerts/:id', (req, res) => {
    const id = req.params.id;
    const { performer, genre, price, day } = req.body;

    // Sprawdzenie, czy istnieje koncert o podanym id
    const concertIndex = db.concerts.findIndex(concert => concert.id === id || concert.id.toString() === id);

    if (concertIndex === -1) {
        return res.status(404).json({ error: 'Concert not found' });
    }

    // Sprawdzenie, czy wszystkie pola są dostępne
    if (!performer || !genre || !price || !day) {
        const missingFields = [];

        // Znajdź brakujące pola
        if (!performer) missingFields.push('performer');
        if (!genre) missingFields.push('genre');
        if (!price) missingFields.push('price');
        if (!day) missingFields.push('day');

        return res.status(400).json({ error: 'Missing required fields in the request body', missingFields });
    }

    // Sprawdzenie, czy price jest liczbą
    if (isNaN(price)) {
        return res.status(400).json({ error: 'Invalid data type for price. It should be a number.' });
    }

    // Aktualizacja danych koncertu
    db.concerts[concertIndex].performer = performer;
    db.concerts[concertIndex].genre = genre;
    db.concerts[concertIndex].price = price;
    db.concerts[concertIndex].day = day;

    res.json({ message: 'Concert updated successfully', updatedConcert: db.concerts[concertIndex] });
});

router.delete('/concerts/:id', (req, res) => {
    const id = req.params.id;

    // Sprawdzenie, czy istnieje koncert o podanym id
    const concertIndex = db.concerts.findIndex(concert => concert.id === id || concert.id.toString() === id);

    if (concertIndex === -1) {
        return res.status(404).json({ error: 'Concert not found' });
    }

    // Usunięcie koncertu z tablicy
    const deletedConcert = db.concerts.splice(concertIndex, 1)[0];

    res.json({ message: 'Concert deleted successfully', deletedConcert });
});

// router.delete('/concerts/:id', (req, res) => {
//     const id = req.params.id;

//     // Sprawdź, czy identyfikator istnieje w tablicy koncertów
//     const concertIndex = db.concerts.findIndex(concert => concert.id === id);

//     if (concertIndex === -1) {
//         return res.status(404).json({ error: 'Concert not found' });
//     }

//     // Usuń koncert z tablicy
//     const deletedConcert = db.concerts.splice(concertIndex, 1)[0];

//     res.json({ message: 'Concert deleted successfully', deletedConcert });
// });


module.exports = router