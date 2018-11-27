import React, { Component } from 'react';
import './Game.scss';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Game extends Component {
  
  constructor(){
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    //to keep the board state
    this.board = this.makeEmptyBoard();
  }

  //to create cells, initialize it
  state = {
    cells:[],
  }

  //create an empty board by 2D array (invoke above)
  makeEmptyBoard(){
    let board = [];
    for(let y = 0; y < this.rows; y++){
      board[y] = [];//[[], [], [], ...]
      for(let x = 0; x < this.cols; x++){
        //switch to true if a cell is active
        board[y][x] = false;//[[f, f, f...], [f, f, f...], [f, f, f...], ...]
      }
    }
    console.log(board);
    return board;
  }

  //create cells
  makeCells(){
    let cells = [];
    for(let y = 0; y < this.rows; y++){
      cells[y] = [];
      for(let x = 0; x < this.cols; x++){
        if (this.board[y][x]){
          cells.push({x, y});
        }
      }
    }
    return cells;
  }

  render(){
    return(
      <div>
        <h1 className="Title">(-.-)...zzZ</h1>
        <div className="Board" style={{width: WIDTH, height: HEIGHT, 
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}></div>
      </div>
    );
  }
}

export default Game;