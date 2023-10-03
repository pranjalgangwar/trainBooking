const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();

// Parse JSON request body
app.use(bodyParser.json());
// handling CORS - Cross Origin Resourse Sharing.
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

// Utility function to find available seats based on the number of seats requested
function findSeats(data, numSeats) {
    // Check if the number of seats requested is within limit (1-7)
    if (numSeats > 7 || numSeats < 1) {
      return null;
    }
  
    // Loop through the rows (each having 7 seats except the last one)
    for (let i = 0; i < data.length; i += 7) {
      const emptySeats = [];
  
      // If it is the last row, only check three seats
      let end = i === 77 ? i + 3 : i + 7;
      for (let j = i; j < end && j < data.length; j++) {
        // Find empty seats in the current row
        if (data[j] === false) {
          emptySeats.push(j);
        }
      }
  
      // If enough empty seats are found in the same row, return them
      if (emptySeats.length >= numSeats) {
        return emptySeats.slice(0, numSeats);
      }
    }
  
    // If not enough seats in a single row, find any available empty seats
    
    const availableSeats = [];
    for (let i = 0; i < 80; i++) {
      if (data[i] === false) availableSeats.push(i);
    }
  
    let n = availableSeats.length;
    let mini = 81;
    let end = numSeats - 1;
    let strt = 0;
  
    for (let i = 0; i <= n - numSeats; i++) {
      if (availableSeats[end] - availableSeats[i] < mini) {
        mini = availableSeats[end] - availableSeats[i];
        strt = i;
      }
      end++;
    }
    return availableSeats.slice(strt,strt+numSeats);
  }

// default path, will basically return the current data.
app.get('/', (req, res) => {
    let data = fs.readFileSync('./data.json', 'utf-8');
    res.json(data).status(200).end();
});

// Route to handle booking seats
app.post('/book', (req, res) => {
  let numSeats = req.body.numSeats;
  console.log(numSeats);
  let data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  let seatsToBook = findSeats(data, numSeats);
  if (!seatsToBook) {
    res.status(400).json({ error: 'Not enough seats available.' });
    return;
  }

  seatsToBook.forEach(seat => {
    data[seat] = true;
  });

  fs.writeFileSync('./data.json', JSON.stringify(data));

  res.json({ bookedSeats: seatsToBook }).status(200).end();
});

// Route to handle reseting seats
app.post('/reset', (req, res) => {
  const data = Array(80).fill(false);
  fs.writeFileSync('./data.json', JSON.stringify(data));
  res.status(200).json({ message: 'All seats have been reset.' }).end();
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});