import React from 'react'
import { Seat } from './Seat';
import styled from 'styled-components'

// Component to arrange the seats in proper styling.
export const Seats = ({status}) => {
    let seats = [];
    let base = 0;
    // 12 rows will be there, each having 7 seats (except 12th one).
    for(let i=1; i<=12; i++){
      // will store current row.
      let tmp = [];
      for(let j=1; j<8; j++){
          // ignoring seats after 80.
          if(base + j > 80) continue;
          
          // seats are in spiral manner hence
          // order for odd rows.
          if((i&1)===0)
              tmp.unshift(<Seat num={base + j} key={base+j} status={status[base + j - 1]}/>);
              
          // order for even rows.
          else if(i&1)
              tmp.push(<Seat num={base + j} key={base+j} status={status[base + j - 1]} />);

          // Inside the Seats component, update Space component rendering
          if (j === 3 && (i & 1) === 0)
              tmp.unshift(<Space key={`space-${i}-${j}`} />);

          // Add a key prop based on row (i) and seat (j) indices
          else if (j === 4 && (i & 1))
              tmp.push(<Space key={`space-${i}-${j}`} />);
      }
      // adding cuurent row in the whole coach.
      seats = [...seats, ...tmp];
      // updating base to calculate seat number.
      base = base + 7;
    }

  return (
    <div>
      <Container>{seats}</Container>
    </div>
  )
}

// Styling Space to put inside a row.
const Space = styled.div`
    width: 3.75em;
    display: inline-block;
`;

// Styling whole Seat Arrangement. Like centering it, making border, etc.
const Container = styled.div`
    border: 2px solid black;
    margin-inline: auto;
    margin-bottom: 1em;
    max-width: 26.875em;
    height: auto;
    min-width: 26.875em;
    background-color: white;
`;