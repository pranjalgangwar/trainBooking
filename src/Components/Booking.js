import React, { useState } from 'react'
import styled from 'styled-components'

// Component that manages booking of the seats.
// It also manages how to find nearby seats.
export const Booking = ({status, setStatus, reset}) => {
  // calculate current available seats
  // it will help to set upper limit on number of
  // seats user can select currently.
  let available = 0;
  for(let i=0; i<80; i++)
    if(status[i]===false) available++;

  // seats state will basically store user input - number of seats user wants to book.
  const [seats, setSeats] = useState(1);
  // to show the output (seat numbers booked) to the user.
  const [notification, setNotification] = useState({status: false, seats: ''});

  // will handle input change.
  const handleChange = (e) => {
    setSeats(e.target.value);
  }

  // to handle 'Book' click.
  const handleClick = (e) => {
    fetch("https://api.render.com/deploy/srv-cke190tjhfbs73a0hp4g?key=BNlieoCXe10/book", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "numSeats": seats }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        // Handle the data returned from the API here
        setStatus(data.bookedSeats);
        console.log(data.bookedSeats); // You can log or use the data as needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
    // After 5 seconds, remove the output
    setTimeout(() => setNotification({ status: false, seats: '' }), 5000);
  };
  

  return (
    <Container>
        {/* If available seats are more than 0 then only show the input field. */}
        { (available > 0) && 
            <>
                {/* Input box to take number of seats as input from the user. */}
                <InputBox type={"number"} value={seats} onChange={handleChange} min={1} max={Math.min(available, 7)}/>
                {/* Button to book seats. */}
                <BookButton disabled={seats > Math.min(available, 7) || notification.status} onClick={handleClick}>Book</BookButton>
                {/* Button to reset the whole coach */}
                <ResetButton disabled={available===80} onClick={() => reset()}> Reset </ResetButton>
            </>
        }

        {/* if notification state is set then will show seat numbers booked for the user. */}
        {
            notification.status &&
            <>
                <p><b>You have successfully booked {seats} ticket(s)</b></p>
                <p><b>Here are you seat number(s): {notification.seats}</b></p>
            </>
        }

        {/* Just showing friendly message to the user. */}
        { 
            (available > 0) && 
            <p><b>Please Select Number of Seats You want to Book! 🙂🎫</b></p> 
        } 

        {/* Handling invalid inputs */}
        { 
            (available > 0  && available < 7 && seats>available) && 
            <p style={{color: "red"}}><b>You can't book {seats} ticket(s) for now☹️.</b></p>
        }

        {/* Showing the limit to the user. */}
        { 
            (available > 0  && available >=7 && seats>7) && 
            <p style={{color: "red"}}><b>You can only book up to {7} tickets at a time.</b></p>
        }

        {/* When no tickets are available */}
        {
            !available && 
            <>
                <p style={{color: "red", fontSize: "1.5em"}}><b>Tickets SOLD OUT 😓</b></p>
                <p style={{opacity: "0.6", width: "auto"}}>Please try again some time later!</p>
                <ResetButton disabled={available===80} onClick={() => reset()}> Reset </ResetButton>
            </>
        }
    </Container>
  )
}

// Styling the container of the component.
// fixing width, bringing content to center, etc.
const Container = styled.div`
    width: 100%;
    text-align: center;
    padding-top: 3em;
    padding-bottom: 1em;
    margin-top: 0em;
`;

// Styling the button for Booking the seats.
const BookButton = styled.button`
    padding: .5em 1em;
    font-weight: bold;
    border-radius: 5px;
    background-color: blue;
    color: white;
    border: none;
    cursor: pointer;
    margin-left: 1em;
    
    // when hovering.
    &:hover{
        background-color: rgba(0, 0, 255, .8);
    }

    // When disabled - when seats more than current limit are selected.
    &:disabled{
        opacity: .4;
        cursor: not-allowed;
    }
`;

// Styling the Reset Button.
const ResetButton = styled.button`
    padding: .5em 1em;
    font-weight: bold;
    border-radius: 5px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    margin-left: 1em;

    // When Hovering
    &:hover{
        background-color: rgba(255, 0, 0, .8);
    }

    // When Disabled - when it is already reseted.
    &:disabled{
        opacity: .4;
        cursor: not-allowed;
    }
`;

// Styling the input box. 
const InputBox = styled.input`
    text-align: center;
    font-weight: bold;
    outline: none;
    display: inline-block;
    width: 10%;
    margin-inline: auto;
    padding: .5em .75em;
`;


