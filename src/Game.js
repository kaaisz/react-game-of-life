import React, { Component } from 'react';
import './Game.scss';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Game extends Component {
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