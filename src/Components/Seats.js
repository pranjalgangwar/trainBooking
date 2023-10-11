import React from 'react';
import { Seat } from './Seat';
import styled from 'styled-components';

// Component to arrange the seats in proper styling.
export const Seats = ({ status, coachName }) => {
  return (
    <div>
      <Container>
      <div style={{display: 'flex',margin: '10px',justifyContent: 'center'}}><strong>{coachName}</strong></div>
        {status.map((row, i) => (
          <Row key={`row-${i}`}>
            {i % 2 !== 0
              ? row
                  .slice()
                  .reverse()
                  .map((seatStatus, j) => (
                    <Seat
                      num={`${i + 1}-${row.length - j}`}
                      key={`${i + 1}-${row.length - j}`}
                      status={seatStatus}
                    />
                  ))
              : row.map((seatStatus, j) => (
                  <Seat
                    num={`${i + 1}-${j + 1}`}
                    key={`${i + 1}-${j + 1}`}
                    status={seatStatus}
                  />
                ))}
          </Row>
        ))}
      </Container>
    </div>
  );
};

// Styling whole Seat Arrangement. Like centering it, making border, etc.
const Container = styled.div`
  border: 2px solid black;
  margin-inline: auto;
  margin-bottom: 1em;
  max-width: 21.875em;
  height: auto;
  min-width: auto;
  background-color: white;
`;

// Styling for a row of seats.
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
