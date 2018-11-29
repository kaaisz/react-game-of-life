import React, { Component } from 'react';
import './Game.scss';

const CELL_SIZE = 10;
const WIDTH = 700;
const HEIGHT = 500;

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

  //Add initial game controller by using state
  state = {
    cells: [],
    interval: 100,
    isRunning: false,
  }

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

  //Add setState to handle state which defined above
  //renderしたDOMの中のClickeventですでに関数の実行が定義されているのでこの書き方が可能
  runGame = () => {
    //when runGame has been turned on, setState change to true
    this.setState({isRunning: true});
    this.runIteration();
  }

  stopGame = () => {
    //when stopGame has been turned on, setState change to false
    this.setState({isRunning: false});
    if(this.timeoutHandler){
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    } 
  }

  handleIntervalChange = (event) => {
    this.setState({interval: event.target.value});
  }

  //to define iteration to iterate while game is running
  //関数の定義から入る
  runIteration(){
    console.log('running iteration');
    let newBoard = this.makeEmptyBoard();

    // Run Iteration Actually
    for (let y = 0; y < this.rows; y++){
      for (let x = 0; x < this.cols; x++){
        let neighbors = this.calculateNeighbors(this.board, x, y);
        if(this.board[y][x]){
          // 1. Any live cell with fewer than two live neighbors dies, as if caused by under population.
          if(neighbors === 2 || neighbors === 3){
            newBoard[y][x] = true;
          // 2. Any live cell with two or three live neighbors lives on to the next generation.
          }else{
            newBoard[y][x] = false;
          }
        }else{
          if(!this.board[y][x] && neighbors === 3){
          // 3. Any live cell with more than three live neighbors dies, as if by overpopulation.
            newBoard[y][x] = true;
          }
          // 4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
        }
      }
    }
    

    // Add logic for each iteration here
    this.board = newBoard;
    // (↓check: can we write inside method which has been already defined like this? - setStateって関数実行したタイミング以外でも書けるの？)
    this.setState({cells : this.makeCells()});

    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.state.interval);
  }


  calculateNeighbors(board, x, y){
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for(let i = 0; i < dirs.length; i++){
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if(x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]){
        neighbors++;
      }
    }
    return neighbors;
  }

  render(){
    const { cells, interval, isRunning } = this.state;
    return(
      <div>
        <h1 className="Title">{`(-.-)...zzZ`}<span className="title-blink">{`{ GAME OF LIFE )`}</span></h1>
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
        {/* Add controller */}
        <div className="controls">
          {/* input to add type */}
          Update every <input value={this.state.interval}onChange={this.handleIntervalChange} /> msec 
            {/* Button */}
            {
              isRunning 
              ? 
              <button className="button" onClick={this.stopGame}>Stop</button>
               : 
              <button className="button" onClick={this.runGame}>Run</button>
            }
        </div>
      </div>
    );
  }
}

export default Game;