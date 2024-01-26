

app.get('/seats', (req, res) => {
    res.json(db.seats);
});