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
})
app.get('/testimonials/:id', (req, res) => {
    const xid = parseInt(req.params.id);
    const result = db.find(item => item.id === xid);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: 'Not found'})
    }
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});

