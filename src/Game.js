import React, { Component } from 'react';
import './Game.scss';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Cell extends Component {
  render() {
    const { x, y } = this.props;
    return (
      <div className="Cell" style={{
        left: `${CELL_SIZE * x + 1}px`,
        top: `${CELL_SIZE * y + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }} />
    );
  }
}

class Game extends Component {

  //to calculate position of the board element
  getElementOffset(){
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    //return as object
    return{
      x : (rect.left + window.pageXOffset) - doc.clientLeft,
      y : (rect.top + window.pageYOffset) - doc.clientTop,
    };
  }

  /*
    to retrieve the click position 
    -> convert it to relative position
    -> calculate the cols and rows of the cell being clicked
    -> cell state is reverted
  */
  handleClick = (event) => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if(x >= 0 && x <= this.cols && y >= 0 && y <= this.rows){
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.makeCells() });
  }
  
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
      for(let x = 0; x < this.cols; x++){
        if (this.board[y][x]){
          cells.push({x, y});
        }
      }
    }
    return cells;
  }

  render(){
    const { cells } = this.state;
    return(
      <div>
        <h1 className="Title">(-.-)...zzZ</h1>
        <div className="Board" style={{width: WIDTH, height: HEIGHT, 
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}} 
          // Add eventHandler
          onClick={this.handleClick}
          ref={(n) => { this.boardRef = n; }}>
          
          {/* by mapping cells */}
          {cells.map(cell => (
            <Cell x={cell.x} y={cell.y} key={`${cell.x}, ${cell.y}`}/>
          ))}

        </div>
      </div>
    );
  }
}

export default Game;