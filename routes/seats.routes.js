const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/seats', (req, res) => {
    res.json(db.seats);
});

router.get('/seats/random', (req, res) => {
    randomSeats = Math.floor(Math.random() * db.seats.length);
    seatsRandom = db.seats[randomSeats]
    if (seatsRandom) {
        res.status(200).json({message: 'random seats successfully', seatsRandom });
    } else {
        res.status(404).json({error: 'not found seats random'});
    }
});

router.get('/seats/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const findId = db.seats.find(item => item.id === id);
    if (findId) {
        res.status(200).json({message: 'succes find item', findId})
    } else {
        res.status(404).json({error: 'not found id'});
    }
});

router.post('/seats', (req, res) => {
    const { day, seat, client, email } = req.body;
    if (!day || !seat || !client || !email) {
        missingSeat = [];
        if (!day) missingSeat.push('day');
        if (!seat) missingSeat.push('seat');
        if (!client) missingSeat.push('client');
        if (!email) missingSeat.push('email');
        res.status(404).json({ error: 'Missing required fields in the request body', missingSeat});
    }
      // Sprawdzenie, czy seat jest liczbą
      if (isNaN(seat)) {
        return res.status(400).json({ error: 'Invalid data type for seat. It should be a number.' });
    }
    const id = uuidv4();
    const newSeat = { id, day, seat, client, email };
    db.seats.push(newSeat);
    res.status(201).json(newSeat);
});

router.put('/seats/:id', (req, res) => {
    const seatId = req.params.id;
    const { day, seat, client, email } = req.body;
    const seatIndex = db.seats.findIndex(item => item.id === seatId || item.id.toString() === seatId
    );

    if (seatIndex === -1) {
        return res.status(404).json({ error: 'Seat not found' });
    }

    // Sprawdź, czy przynajmniej jedno pole do aktualizacji zostało przekazane
    if (!day && !seat && !client && !email) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    // Aktualizuj dane miejsca
    db.seats[seatIndex].day = day || db.seats[seatIndex].day;
    db.seats[seatIndex].seat = seat || db.seats[seatIndex].seat;
    db.seats[seatIndex].client = client || db.seats[seatIndex].client;
    db.seats[seatIndex].email = email || db.seats[seatIndex].email;

    res.json({ message: 'Seat updated successfully', updatedSeat: db.seats[seatIndex] });

    // Sprawdź, czy wszystkie wymagane pola są dostępne w ciele żądania
    // if (!day || !seat || !client || !email) {
    //     const missingFields = [];

    //     if (!day) missingFields.push('day');
    //     if (!seat) missingFields.push('seat');
    //     if (!client) missingFields.push('client');
    //     if (!email) missingFields.push('email');

    //     return res.status(400).json({ error: 'Missing required fields in the request body', missingFields });
    // }

    // // Aktualizuj dane miejsca
    // db.seats[seatIndex].day = day;
    // db.seats[seatIndex].seat = seat;
    // db.seats[seatIndex].client = client;
    // db.seats[seatIndex].email = email;

    // res.json({ message: 'Seat updated successfully', updatedSeat: db.seats[seatIndex] });

});

router.delete('/seats/:id', (req, res) => {
    const idDeleted = req.params.id
    const deletedID = db.seats.findIndex(item => item.id === idDeleted || item.id.toString() === idDeleted);
    if (deletedID === -1) {
        res.status(404).json({error:'not found seats', deletedID})
    }
    const seatsDeleted = db.seats.splice(deletedID, 1)[0]
    res.status(200).json({message: 'successfully deleted seats' ,seatsDeleted});
});

module.exports = router