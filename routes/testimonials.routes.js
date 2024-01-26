const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const id = uuidv4();


router.delete('/testimonials/:id', (req, res) => {
    const id = req.params.id;

    // Sprawdź, czy identyfikator jest prawidłowym identyfikatorem UUID.
    if (!isValidUUID(id)) {
        res.status(400).json({ error: 'Invalid UUID format' });
        return;
    }

    // Szukaj indeksu elementu w tablicy db o identyfikatorze równym id.
    const index = db.testimonials.findIndex(item => item.id === id);

    // Sprawdź, czy element został znaleziony.
    if (index !== -1) {
        // Usuń element z tablicy db na podstawie indeksu.
        db.testimonials.splice(index, 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

// Funkcja sprawdzająca, czy ciąg znaków jest prawidłowym identyfikatorem UUID.
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(uuid);
}

router.post('/testimonials', (req, res) => {
    // Pobranie danych z ciała żądania
    const { author, text } = req.body;

    // Sprawdzenie czy wszystkie wymagane pola są dostępne
    if (!author || !text) {
        return res.status(400).json({ error: 'Missing author or text in the request body' });
    }

    // Generowanie unikalnego identyfikatora za pomocą uuid
    const id = uuidv4();

    // Tworzenie nowego testimonial
    const newTestimonial = {
        id,
        author,
        text,
    };

    // Dodanie nowego testimonial do tablicy
    db.testimonials.push(newTestimonial);

    // Odpowiedź z nowym testimonial i kodem 201 Created
    res.status(201).json(newTestimonial);
});

router.put('/testimonials/:id', (req, res) => {
    const id = req.params.id;
    const { author, text } = req.body;

    if (!author || !text) {
        return res.status(400).json({ error: 'Missing author or text in the request body' });
    }

    const testimonialIndex = db.testimonials.findIndex(item => item.id === id);

    if (testimonialIndex !== -1) {
        // Modyfikacja atrybutów author i text
        db.testimonials[testimonialIndex].author = author;
        db.testimonials[testimonialIndex].text = text;

        res.json(db.testimonials[testimonialIndex]);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});
router.get('/testimonials', (req, res) => {
    res.json(db.testimonials);
});
router.get('/testimonials/random', (req, res) => {
    console.log('Request to /testimonials/random');

    const randomIndex = Math.floor(Math.random() * db.testimonials.length);
    console.log('Random index:', randomIndex);

    const randomTestimonial = db.testimonials[randomIndex];
    console.log('Random testimonial:', randomTestimonial);

    if (randomTestimonial) {
        res.json(randomTestimonial);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

router.get('/testimonials/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log('Request to /testimonials/:id with id:', id);

    const result = db.testimonials.find(item => item.id === id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: 'Not found id'})
    }
});

module.exports = router;