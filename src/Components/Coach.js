import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Booking } from './Booking';
import { Seats } from './Seats';
import { Seat } from './Seat';
import backgroundImage from './Images/image.jpeg';

export const Coach = () => {
  // State to store the status of all the seats.
  const [status, setStatus] = useState([]);

  // Fetching the data from the backend about the booking.
  useEffect(() => {
    // Use the fetch API to make a request to the API endpoint.
    fetch("http://localhost:3001/")
      .then(res => res.json())
      .then(data => {
        // Parsing JSON Data to get a normal JavaScript array.
        data = JSON.parse(data);
        // Update the status of the Coach.
        setStatus([...data]);
      });
  }, []);

  // Function to handle booking function,
  // it is used inside the Booking Component.
  const handleBooking = (i) => {
    setStatus(prev => {
      // Update the state of Coach temporarily.
      // Permanent state change in the database will happen in Booking.
      i.forEach(seat => {
        prev[seat.row][seat.seat] = true;
      });
      return [...prev];
    });
  }

  // Function to reset the Coach state,
  // just for testing purposes.
  const reset = () => {
    fetch("http://localhost:3001/reset",{method: 'POST'})
    .then(res => res.json);
    let data = [];
    const numRows = status.length;

    for (let row = 0; row < numRows; row++) {
      const seatsPerRow = status[row].length;
      data.push(Array(seatsPerRow).fill(false));
    }
    setStatus([...data]);
  }

  return (
    <Container>
      {/* Passing function to handle booking, function to reset the state of coach 
            to the booking and the state of coach to the Booking Component */}
      <Booking status={status} setStatus={handleBooking} reset={reset} />
      <Description>
        <Legend>
          <Seat num={" "} status={true} />
          <p>Booked</p>
        </Legend>
        <Legend>
          <Seat num={" "} status={false} />
          <p>Available</p>
        </Legend>
      </Description>
      <Seats status={status} />
    </Container>
  );
}

// Styled component for the main container.
const Container = styled.div`
  border: 2px solid #333;
  padding: 2em;
  background-color: #f5f5f5;
  min-width: 40em;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-image: url(${backgroundImage});
  background-size: cover; /* Adjust the background size as needed */
  background-repeat: no-repeat;
`;

// Styled component for the description and legend.
const Description = styled.div`
  margin-bottom: 1em;
  text-align: center;
  display: flex;
  justify-content: center;
`;

// Styled component for each legend item.
const Legend = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  & > p {
    margin-left: 5px;
    font-weight: bold;
  }
`;

