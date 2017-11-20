import React, { Component } from 'react';
import Board from './Board';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [0,1,2,3,4,5,6,7,8],
      player: "X",
      winner: false,
      tie: false,
      level: 'intermediate'
    };
    this.handleClick = this.handleClick.bind(this)
    // function for user click event on each square
    this.nextMove = this.nextMove.bind(this)
    // function to pick AI move
    this.checkWinner = this.checkWinner.bind(this)
    // function to check winner
    this.minimax = this.minimax.bind(this)
    // function for advanced move (minimax)
    this.setLevel = this.setLevel.bind(this)
    // function to set level to intermediate or advanced
  }


  nextMove(){
    const winner = this.checkWinner

    let array = this.state.board.filter((box) => Number.isInteger(box));
    // Filters the array for vacant spots ( any box that does not have an integer,
   //ie X or O), in order to loop through a new array of vacant spots

    let move

    // calls the function for intermediate or advanced levels, depending on what the user
    // had choosen during the click event.
    if (this.state.level === 'intermediate') {
      move = this.intermediateMove(this.state.board, "O")
    } else {
      move = this.minimax(this.state.board, "O")
    }
    let board = this.state.board
    board[move.index] = "O"
    this.setState({board: board})
    // Each function returns a "move" for the AI to make, the move is inserted
    // into the board as "O" in place of the integer, and the state is set with the new board
    // to keep track of it's new state with the O.


// if there's a winner for X or O, change the state of winner, else
// if there are no possible moves to make (ie the length of the array is 0)
// & there is no winner, then change the state of tie to 'true'.
    let gameWinner
    ["X", "O"].forEach((player) => {
      if(winner(this.state.board, player)) {
        gameWinner = player
      }
    })
    if(gameWinner) {
      this.setState({winner: gameWinner})
      return undefined
    } else if (array.length === 0) {
      this.setState({tie: true})
      return undefined
    }
  }

  // My own logic/algorithm for intermediate game play

  intermediateMove(board, player) {
    let array = board.filter((box) => Number.isInteger(box));
    // create a vacant spots array
    let move = {}
    const corners = [0, 2, 6, 8]
    // list of all the corner spots on the board


    if (array.length === 8 && array.includes(4)) {
      move = {index: 4}
      return move
      // On the first user move, if the middle spot is not taken, that is the AI move

    } else if (array.length === 8 && !array.includes(4)) {
      let num = corners[Math.floor(Math.random() * 4)]
      move = {index: num}
      return move
      // if the middle spot is taken (the vacant spots array does not include 4)
      // then the AI picks a random number from the "corners" array for a corner spot,
      // which is the best move to make after the user's first move.
    } else if (array.length !== 8){
      let oMove
      for (var i=0; i< array.length; i++) {
        let nBoard = board.slice()
        nBoard[array[i]] = 'O'
        if (this.checkWinner(nBoard, 'O')) {
          oMove = array[i]
          // loop through the vacant spots and check to see if O/AI can win by next move
          // set that integer to the 'move' if so.
        }
      }
      let xMove
      for (var i = 0; i < array.length; i++) {
        let nBoard = board.slice()
        nBoard[array[i]] = 'X'
        if (this.checkWinner(nBoard, 'X')) {
          xMove = array[i]
          // loop through vacant spots and check to see if X can win on next move, if so
          // then AI picks that spot to block X
        }
      }
      let cornerMove
      for (var i=0; i< array.length; i++) {
        if(corners.includes(array[i])){
          cornerMove = array[i]
          // pick a corner move
        }
      }
      // Choose the move, if any of the above conditionals are met
      // if not, choose a random number from the leftover vacant spots (edges)
      if(Number.isInteger(oMove)){
        move = {index: oMove}
      } else if (Number.isInteger(xMove)) {

        move = {index: xMove}
      } else if(Number.isInteger(cornerMove)) {

        move = {index: cornerMove}
      } else {
        let index = array[Math.floor(Math.random() * array.length)];
        move = {index: index}
      }
    }
    return move

  }

  // The Minimax algorithm I refactored for React (unbeatable A.I.)
  minimax(board, player){

    // filter board for vacant spots
    let array = board.filter((box) => Number.isInteger(box))

    // When this function is recursively called each time, this is the terminal state
    // to end the recursion.
    // if there is a winner for 'X' the score is the minimum (-10) and maximum (10)
    // for the AI, this checks to see if the AI or the Human won and returns the
    // corresponding score (or 0 if there is no vacant spots for a tie)
    if (this.checkWinner(board, "X")) {
      return {
        score: -10
      };
    } else if (this.checkWinner(board, "O")) {
      return {
        score: 10
      };
    } else if (array.length === 0) {
      return {
        score: 0
      };
    }

// moves array to keep track of scores
    var moves = [];

    // iterates through each vacant spot
    for (var i = 0; i < array.length; i++) {
      var move = {};
      move.index = array[i];
      board[array[i]] = player;
      // Inserts either an X or O into the 'virtual board', depending on
      // the player, the move's index equals the integer that corresponds to the spots on board//

      if (player == "O") {
        var nextMove = this.minimax(board, "X");
        move.score = nextMove.score;
        // if current player is AI, minimax function is recursively called on
        // on X (to see what the best move for the human would be, after the AI's move).
        // The Ai is predicting the best winning strategy for the human so it can counteract. This process
        // keeps repeating and alternating between X and O until a terminal state is reached,
        // for each iteration on the vacants spots array.
      } else {
        var nextMove = this.minimax(board, "O");
        move.score = nextMove.score;
        // if the current player is X, then minimax is called on the AI.
      }
      board[array[i]] = move.index;
      moves.push(move);
      // push the score (10, -10 or 0 into the moves array)
    }

// iterate through the moves array.
// The AI wants to 'maximum' the score (ie gain a win), so if any score is better than -infinity
// then that is the best score (i.e 10). If a play will result in a high score, that
// is the best move, and the index of the move corresponds to the square where
// O should insert itself.
    var bestMove;
    if (player === "O") {
      var bestScore = -Infinity;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // the Human's goal is to minimize. If any score is less than Infinity (ie -10)
      // then that is the best score for the human's best predicted move.
      var bestScore = Infinity;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
    // return the bestMove
  }

  // Logic to check winner (8 ways to win: 3 Horizontal, 3 Vertical, 2 diagonal.)
  // If any of those boxes equal XXX or OOO when added together, that means there
  // is a winner.
  checkWinner(squares, player){
    var winningPlayer = player + player + player
    if (
      (squares[0] + squares[1] + squares[2] === winningPlayer) ||
      (squares[3] + squares[4] + squares[5] === winningPlayer) ||
      (squares[6] + squares[7] + squares[8] === winningPlayer) ||
      (squares[0] + squares[3] + squares[6] === winningPlayer) ||
      (squares[1] + squares[4] + squares[7] === winningPlayer) ||
      (squares[2] + squares[5] + squares[8] === winningPlayer) ||
      (squares[2] + squares[4] + squares[6] === winningPlayer) ||
      (squares[0] + squares[4] + squares[8] === winningPlayer)
    ) {
      return true
    } else {
      return false
    }
  }
  // Function for Each DIV click
  handleClick(i) {
    let board = this.state.board

    // if the square value is a number (ie not X or O) then X is inserted into
    // the board array at that spot and the state is updated to reflect the new
    // board, the "next move" method is called for the AI move. This prevents the
    // user from clicking on the same spot twice, otherwise the functions are not called.
    if(Number.isInteger(board[i])) {
      board[i] = this.state.player
      this.setState({board})
      this.nextMove()
    }
  }
  // This function changes the level to either Intermediate or Advanced by changing
  // the state
  setLevel(level) {
    this.setState({level})
  }


  render() {
    let winner = this.state.winner;
    let level = this.state.level;

    let modal
    if (winner) {
      modal = (
        <div className="modal">
          <h1>We have a winner: {winner}</h1>
          <button className="btn focused" onClick={()=> {this.setState({winner: false, board: [0,1,2,3,4,5,6,7,8]})}}>New Game!</button>
        </div>
      )
    } else if (this.state.tie) {
      modal = (
        <div className="modal">
          <h1>There's a tie</h1>
          <button className="btn focused" onClick={()=> {this.setState({tie: false, board: [0,1,2,3,4,5,6,7,8]})}}>New Game!</button>
        </div>
      )
    }

    return (
      <div className="App">
        {modal}
        <h3>Tic Tac Toe</h3>
        <button onClick={()=>{this.setLevel('intermediate')}} className={level === 'intermediate' ? "btn focused" : "btn"}>intermediate</button>
        <button onClick={()=>{this.setLevel('advanced')}} className={level === 'advanced' ? "btn focused" : "btn"}>advanced</button>
        <Board board={this.state.board} handleClick={this.handleClick}/>
      </div>
    );


  }
}

export default App;