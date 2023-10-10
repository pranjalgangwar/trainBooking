import React from 'react'
import styled from 'styled-components'

// Component for each seat, nothing just a square.
export const Seat = ({num, status}) => {
  return (
    // background color will be based on current status of the seat.
    <Container style={{backgroundColor: status ? "#A7BBC7" : "transparent"}}>{num}</Container>
  );
}

// Styling the seat, setting margin, border, border-radius, etc.
const Container = styled.div`
    width: 25.5px;
    height: 25.5px;
    border-radius: 50%;
    margin: 1em 1em;
    text-align: center;
    border: .5px solid black;
    font-size: .5em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
`;