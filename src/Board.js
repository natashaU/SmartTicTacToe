import React, { Component } from 'react';

// I pass in the board array (an array which contains the numbers 0-8) as a prop
// from App.js. I iterate over the board array to create a DIV for each box.
// I pass in a click event prop from app.js. If the display value of the board is
// not a number (i.e. X or O) then I display the value in the box on each click,
//however, if it's a number, I display null, so that only X and O is showed to the user.

class Board extends Component {
  render() {
    return (
      <div className="flex center">
        <div className="board">
          {
            this.props.board.map((boxValue, i) => {
              const displayValue = Number.isInteger(boxValue) ? null : boxValue;
              return <div onClick={()=>{this.props.handleClick(i)}}><p>{displayValue}</p></div>
            })
          }
        </div>
      </div>
    );
  }
}

export default Board;
