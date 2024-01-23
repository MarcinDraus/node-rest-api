const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const id = uuidv4();

const db = [
    { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
    { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
  ];

  app.delete('/testimonials/:id', (req, res) => {
    const id = req.params.id;

    // Sprawdź, czy identyfikator jest prawidłowym identyfikatorem UUID.
    if (!isValidUUID(id)) {
        res.status(400).json({ error: 'Invalid UUID format' });
        return;
    }

    // Szukaj indeksu elementu w tablicy db o identyfikatorze równym id.
    const index = db.findIndex(item => item.id === id);

    // Sprawdź, czy element został znaleziony.
    if (index !== -1) {
        // Usuń element z tablicy db na podstawie indeksu.
        db.splice(index, 1);
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

app.post('/testimonials', (req, res) => {
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
    db.push(newTestimonial);

    // Odpowiedź z nowym testimonial i kodem 201 Created
    res.status(201).json(newTestimonial);
});

app.put('/testimonials/:id', (req, res) => {
    const id = req.params.id;
    const { author, text } = req.body;

    if (!author || !text) {
        return res.status(400).json({ error: 'Missing author or text in the request body' });
    }

    const testimonialIndex = db.findIndex(item => item.id === id);

    if (testimonialIndex !== -1) {
        // Modyfikacja atrybutów author i text
        db[testimonialIndex].author = author;
        db[testimonialIndex].text = text;

        res.json(db[testimonialIndex]);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.get('/', (req, res) => {
    res.send('express server');
});

app.get('/testimonials', (req, res) => {
    res.json(db);
});

app.get('/testimonials/random', (req, res) => {
    console.log('Request to /testimonials/random');

    const randomIndex = Math.floor(Math.random() * db.length);
    console.log('Random index:', randomIndex);

    const randomTestimonial = db[randomIndex];
    console.log('Random testimonial:', randomTestimonial);

    if (randomTestimonial) {
        res.json(randomTestimonial);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.get('/testimonials/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log('Request to /testimonials/:id with id:', id);

    const result = db.find(item => item.id === id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: 'Not found id'})
    }
});






app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});

