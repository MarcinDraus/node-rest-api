const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = [
    { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
    { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
  ];

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


// app.get('/testimonials/random', (req, res) => {
//     console.log('Request to /testimonials/random');

//     const randomIndex = Math.floor(Math.random() * db.length);
//     console.log('Random index:', randomIndex);

//     const randomTestimonial = db[randomIndex];
//     console.log('Random testimonial:', randomTestimonial);

//     if (randomTestimonial) {
//         res.json(randomTestimonial);
//     } else {
//         res.status(404).json({ error: 'Not found random' });
//     }
// });

// app.get('/testimonials/:id', (req, res) => {
//     const xid = parseInt(req.params.id);

//     // Dodaj sprawdzenie, czy xid jest prawidłową liczbą
//     if (!isNaN(xid)) {
//         const result = db.find(item => item.id === xid);
//         if (result) {
//             res.json(result);
//         } else {
//             res.status(404).json({ error: 'Not found id' });
//         }
//     } else {
//         res.status(400).json({ error: 'Invalid id format' });
//     }
// });





app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});

