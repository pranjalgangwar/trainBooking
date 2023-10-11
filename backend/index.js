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
  
      let bestcoach = 0;
      let cc = 0;
      let bestrow = 0;
      let ncr = 0;
      let nbr=80;
      let flag = 0;
    for (const coach of data){
    let cr = 0;
    for(const row of coach){
      const emptySeats = [];
      let currentSeat = 0;
      for(const seat of row){
        if (seat === false) {
          emptySeats.push({coach:cc, row: cr, seat: currentSeat});
          ncr++;
        }
      }
      if(ncr >= numSeats && nbr > ncr){
        bestcoach = cc;
        bestrow = cr;
        flag =1;
        nbr = ncr;
      }
      cr++;
      ncr = 0;
    } 
    cc++;
  }
      // If enough empty seats are found in the same row, return them 
    let seatbooked = [];
    let num = numSeats
    if (flag === 1) {
      let currentSeatNumber = 0;
      for (const seat of data[bestcoach][bestrow]) {
      if (seat === false && num>0){
        seatbooked.push({coach:bestcoach, row: bestrow, seat:currentSeatNumber});
        num--;
      }
      currentSeatNumber++;
    }
    return seatbooked;
    }
    //If not enough seats in a single row, find any available empty seats
    const availableSeats = [];
    let referenceNumber = 0;
    let currentCoach = 0;
    for(const coach of data){
      let currentRow = 0;
     for(const row of coach){
      let currentSeat = 0;
      for(const seat of row){
        if (seat === false) {
          availableSeats.push({coach:currentCoach,row: currentRow, seat: currentSeat, referenceNumber: referenceNumber});
        }
        currentSeat++;
        referenceNumber++;
      }
      currentRow++;
    }
    currentCoach++;
  }
  
    let n = availableSeats.length;
    let mini = 81;
    let end = numSeats - 1;
    let strt = 0;
  
    for (let i = 0; i <= n - numSeats; i++) {
      if (availableSeats[end].referenceNumber - availableSeats[i].referenceNumber < mini) {
        mini = availableSeats[end].referenceNumber - availableSeats[i].referenceNumber;
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
  let data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  let seatsToBook = findSeats(data, numSeats);
  if (!seatsToBook) {
    res.status(400).json({ error: 'Not enough seats available.' });
    return;
  }
  seatsToBook.forEach(seat => {
    data[seat.coach][seat.row][seat.seat] = true;
  });

  fs.writeFileSync('./data.json', JSON.stringify(data));

  res.json({ bookedSeats: seatsToBook }).status(200).end();
});

// Route to handle reseting seats
app.post('/reset', (req, res) => {
  try {
    // Read the existing seating data from the data.json file
    const existingData = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

    // Initialize the data array with the same dimensions as the existing data
    const data = [];
    for(let c = 0; c<2; c++){
    const numRows = existingData[c].length;
    const coachData = [];

    for (let row = 0; row < numRows; row++) {
      const seatsPerRow = existingData[c][row].length;
      coachData.push(Array(seatsPerRow).fill(false));
    }
    data.push(coachData);
  }

    // Write the updated data back to the data.json file
    fs.writeFileSync('./data.json', JSON.stringify(data));

    res.status(200).json({ message: 'All seats have been reset.' }).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset seats.' }).end();
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});