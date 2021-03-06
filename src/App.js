import React, { Component } from 'react';
import Board from './Board';
import './App.css';
import TypeWriter from 'react-typewriter';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [0,1,2,3,4,5,6,7,8],
      player: "X",
      winner: false,
      tie: false,
      level: 'intermediate',
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
    this.winningCombinations =  [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
    [1,4,7], [2,5,8],[2,4,6],[0,4,8]]
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

      let oppositeXCorner
        if (board[0] === 'X' && array.includes(8)) {
          oppositeXCorner = 8;
        } else if (board[2] === 'X' && array.includes(6)) {
          oppositeXCorner = 6;
        } else if (board[6] === 'X' && array.includes(2)) {
          oppositeXCorner = 2;
        } else if (board[8] === 'X' && array.includes(0)) {
          oppositeXCorner = 0;
      }  else {
          oppositeXCorner = null;
      } // pick a corner opposite from X's corner for next best move play


      let cornerMove
      let vacantCorners = [];
      for (var i=0; i< array.length; i++) {
        if (corners.includes(array[i])){
          vacantCorners.push(array[i])
        }
        if (vacantCorners.length > 0){
          cornerMove = vacantCorners[Math.floor(Math.random() * vacantCorners.length)]
        } // pick a random corner move, if vacant
      }

      // Choose the move, if any of the above conditionals are met
      // if not, choose a random number from the leftover vacant spots (edges)
      if(Number.isInteger(oMove)){
        move = {index: oMove}

      } else if (Number.isInteger(xMove)) {
        move = {index: xMove}

      } else if (Number.isInteger(oppositeXCorner)) {
        move = {index: oppositeXCorner}


      } else if(Number.isInteger(cornerMove)) {
        move = {index: cornerMove}

      } else {
        let edgeIndex = array[Math.floor(Math.random() * array.length)];
        move = {index: edgeIndex}

      }
    }
    return move

  }

  // A Minimax algorithm I refactored for React (unbeatable A.I.)
  minimax(board, player, depth=0){


    // filter board for vacant spots
    let vacantArray = board.filter((box) => Number.isInteger(box))

    // When this function is recursively called each time, this is the terminal state
    // to end the recursion.
    // if there is a winner for 'X' the score is the minimum (ie -100, -98 etc...) and maximum (ie 100, 99 98 etc...)
    // for the AI, this checks to see if the AI or the Human won and returns the
    // corresponding score (or 0 if there is no vacant spots for a tie)

    // depth = # of moves it takes to reach terminal state.
    if (this.checkWinner(board, "X")) {
      return {
        score: -100 + depth
      };
    } else if (this.checkWinner(board, "O")) {
      return {
        score: 100 - depth
      };
    } else if (vacantArray.length === 0) {
      return {
        score: 0
      };
    }



    // moves array to keep track of scores
    var allMoves = [];


    // iterates through each vacant spot
    vacantArray.forEach((position) => {
      var possibleMove = {};
      possibleMove.index = position;
      board[position] = player;
      // Inserts either an X or O into the 'virtual board', depending on
      // the player, the move's index equals the integer that corresponds to the spots on board//


      player === "O"? (
          possibleMove.score = this.minimax(board, "X", depth+1).score
        ) : (
          possibleMove.score = this.minimax(board, "O", depth+1).score
        );
        // if current player is AI, minimax function is recursively called on
        // on X (to see what the best move for the human would be, after the AI's move).
        // The Ai is predicting the best winning strategy for the human so it can counteract. This process
        // keeps repeating and alternating between X and O until a terminal state is reached,
        // for each iteration on the vacants spots array. If the current player is X,
        // then minimax is called on AI.

        board[position] = possibleMove.index;
        allMoves.push(possibleMove);
        // push the 'possible move' object with index and scores (100, -100 or 0) into the 'all moves' array.
    });

// iterate through the moves array.
// The AI wants to 'maximum' the score (ie gain a win), so if any score is better than -infinity
// then that is the best score (i.e 100). If a play will result in a high score, that
// is the best move, and the index of the move corresponds to the square where
// O should insert itself.
    var bestMove;
    var bestScore = player == "O"? -Infinity : Infinity;

    for (var i = 0; i < allMoves.length; i++) {
      if ((player == "O" && allMoves[i].score > bestScore) ||
        (player == "X" && allMoves[i].score < bestScore)) {
        bestScore = allMoves[i].score;
        bestMove = i;
      }
    }

    return allMoves[bestMove];
    // return the bestMove
  }

  // Logic to check winner (8 ways to win: 3 Horizontal, 3 Vertical, 2 diagonal.)
  // If any of those boxes equal XXX or OOO when added together, that means there
  // is a winner.
  checkWinner(squares, player){
    let winningPlayer = player + player + player

    for (var i = 0; i< this.winningCombinations.length; i++) {
      var win = this.winningCombinations[i]
      if (squares[win[0]] + squares[win[1]] + squares[win[2]] === winningPlayer) {
        return true;
      }
    }
    return false;
  }

  // Function for Each DIV click
  handleClick(i) {
    let board = this.state.board

    // if the square value is a number (ie not X or O) then X is inserted into
    // the board array at that spot and the state is updated to reflect the new
    // board.This prevents the user from clicking on the same spot twice,
    // otherwise the functions are not called.
    if(Number.isInteger(board[i]) && this.state.winner === false) {
      board[i] = this.state.player
      this.setState({board})

      // check to see if X wins, if X wins, do not call the AI's next move.
      if (this.checkWinner(this.state.board,'X')) {
      this.setState({winner:'X'})
      return
      } else {
        // the "next move" method is called for the AI move, after 1/2 second delay.
        setTimeout(()=>this.nextMove(), 500);
      }
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

    let winnerSentence = winner === 'O'? "As a surprise to nobody, I won!" : "You won! This must be a computer-enhanced hallucination.";

    let tieSentence = ["Stalemate! Sometimes the only winning move against me is not to play.", "Stalemate! How about a nice game of chess?",
    "Stalemate! This is a boring game. There's always a tie."][[Math.floor(Math.random() * 3)]];



    let modal
    if (winner) {
      modal = (
        <div className="modal">
        <TypeWriter typing={1}><h1>{winnerSentence}</h1></TypeWriter>
          <button className="btn focused" onClick={()=> {this.setState({winner: false, board: [0,1,2,3,4,5,6,7,8]})}}>New Game!</button>
        </div>
      )
    } else if (this.state.tie) {
      modal = (
        <div className="modal">
        <TypeWriter typing={1}><h1>{tieSentence}</h1></TypeWriter>
          <button className="btn focused" onClick={()=> {this.setState({tie: false, board: [0,1,2,3,4,5,6,7,8]})}}>New Game!</button>
        </div>
      )
    }

    return (
      <div className="App">
        {modal}
        <h1>Tic Tac Toe</h1>
        <button onClick={()=>{this.setLevel('intermediate')}} className={level === 'intermediate' ? "btn focused" : "btn"}>Average Human</button>
        <button onClick={()=>{this.setLevel('advanced')}} className={level === 'advanced' ? "btn focused" : "btn"}>Evil Genius</button>
        <Board board={this.state.board} handleClick={this.handleClick}/>
      </div>
    );


  }
}

export default App;



