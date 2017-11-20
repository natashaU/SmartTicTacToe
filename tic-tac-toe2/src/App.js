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
    this.nextMove = this.nextMove.bind(this)
    this.checkWinner = this.checkWinner.bind(this)
    this.minimax = this.minimax.bind(this)
    this.setLevel = this.setLevel.bind(this)
  }


  nextMove(){
    const winner = this.checkWinner

    let array = this.state.board.filter((box) => Number.isInteger(box));
    // Filters the array for vacant spots (any box that does not have an integer,
   //ie X or 0, so that we can loop through the new array of vacant spots

    let move
    // calls the function for intermediate or advanced, depending on what the user
    // chooses.
    if (this.state.level === 'intermediate') {
      move = this.intermediateMove(this.state.board, "O")
    } else {
      move = this.minimax(this.state.board, "O")
    }
    let board = this.state.board
    board[move.index] = "O"
    this.setState({board: board})
    // Each function returns a "move" for the AI to make, the move is inserted
    // into the board, and the state is set with the new board (which places an 'O'
    //in place of the integer)

// if there's a winner for X or 0, change the state of winner, else
// if there are no possible moves to make ie the length of the array is 0,
// & there is no winner, then change the state of tie to true.
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

  intermediateMove(board, player) {
    let array = board.filter((box) => Number.isInteger(box));
    // create a vacant spots array
    let move = {}
    const corners = [0, 2, 6, 8]
    // this list all the corner spots on the board


    if (array.length === 8 && array.includes(4)) {
      move = {index: 4}
      return move
      // on the first user move, if the middle spot is not taken, that is the AI move

    } else if (array.length === 8 && !array.includes(4)) {
      let num = corners[Math.floor(Math.random() * 4)]
      move = {index: num}
      return move
      // if the middle spot is taken (the vacant spots array does not include 4)
      // then the AI picks a random number from the "corners" array for a corner spot,
      //which is the best move that it can make.
    } else if (array.length !== 8){
      let oMove
      for (var i=0; i< array.length; i++) {
        let nBoard = board.slice()
        nBoard[array[i]] = 'O'
        if (this.checkWinner(nBoard, 'O')) {
          oMove = array[i]
          // loop through the vacant spots and check to see if 0/AI can win by next move
        }
      }
      let xMove
      for (var i = 0; i < array.length; i++) {
        let nBoard = board.slice()
        nBoard[array[i]] = 'X'
        if (this.checkWinner(nBoard, 'X')) {
          xMove = array[i]
          // loop through vacant spots and check to see if X can win, if so
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
      if(Number.isInteger(oMove)){
        move = {index: oMove}
      } else if (Number.isInteger(xMove)) {
        console.log("x")
        move = {index: xMove}
      } else if(Number.isInteger(cornerMove)) {
        console.log("cor")
        move = {index: cornerMove}
      } else {
        let index = array[Math.floor(Math.random() * array.length)];
        move = {index: index}
      }
    }
    return move
    //return {index: 3}
  }
  minimax(board, player){
    let array = board.filter((box) => Number.isInteger(box))
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

    var moves = [];
    for (var i = 0; i < array.length; i++) {
      var move = {};
      move.index = array[i];
      board[array[i]] = player;

      if (player == "O") {
        var gMove = this.minimax(board, "X");
        move.score = gMove.score;
      } else {
        var gMove = this.minimax(board, "O");
        move.score = gMove.score;
      }
      board[array[i]] = move.index;
      moves.push(move);
    }

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
      var bestScore = Infinity;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
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
  handleClick(i) {
    let board = this.state.board
    if(Number.isInteger(board[i])) {
      board[i] = this.state.player
      this.setState({board})
      this.nextMove()
    }
  }
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
