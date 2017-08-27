import React from 'react';
import ReactDOM from 'react-dom';
import http from 'axios';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
var globalVar;
var timer;
var nextTurn = false;
var backendURL = 'https://4ca6da82.ngrok.io/'  // change this url to backend url
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      stepNumber: 0,
      winnerIsDeclared: false,
      over: false,
      lastUpdate: null
    }
  }
  componentDidMount() {
    this.pollingWrapper();
  }
  pollingWrapper() {
    timer = setInterval(()=>this.polling(), 3000);
  }
  polling() {
    var self = this;
    http.get(`${backendURL}tic-tac`)
    .then((res) => {
      var newArray = Array(9).fill(null);
      for(var i=0;i<res.data.length;i++) {
        var jsonData = JSON.parse(res.data[i]);
        newArray[jsonData.index] = jsonData.value;
      }
      if(newArray.indexOf('X') > -1 || newArray.indexOf('O') > -1)
        var lastUpdate = jsonData.value;
      // if(!this.state.winnerIsDeclared) {
        if(newArray.indexOf(globalVar) != this.state.squares[globalVar]) {
          newArray[globalVar] = this.state.squares[globalVar];
        }
      // }
        if(res.data.length == 0) {
          newArray = Array(9).fill(null);
        }
      nextTurn = true;
      self.setState({
        squares: newArray,
        lastUpdate: lastUpdate == undefined ? null : lastUpdate
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  deleteRedisKey() {
     http.post(`${backendURL}tic-tac-delete`)
      .then((res) => {
        console.log(res, 'deleted');
      })
      .catch((err) => {
        console.log(err)
      })
  }
  handleClick(i) {
    if(nextTurn)
      if(this.state.squares[i] == null) {
        // clearInterval(timer);
        this.state.squares[i] = this.state.lastUpdate == 'X' ? 'O' : 'X' ;
        nextTurn = false;
        globalVar = i;
        http.post(`${backendURL}tic-tac`, {index : i, value: this.state.squares[i]})
        .then((res) => {
          console.log('success');
        })
        .catch((err) => {
          console.log('err is ', err)
        })
         this.setState({
          squares: this.state.squares,
        })
      }
      else
        console.log('The grid is filled up')
    else
      console.log('Wait for other');
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState != this.state;
  }
  render(){
    const {squares, stepNumber, over, lastUpdate} = this.state;
    const winner = calculateWinner(squares);
    const matchDraw = calculateDraw(squares);
    let status;
    if (winner) {
      status = "Winner: " + winner + ". Please start a new match";
    }
    else if(!winner && matchDraw) {
      status = "Match drawn. Please start a new match"
    }
    else if(!winner && lastUpdate !== null && !matchDraw) {
      status = "Next player: " + (lastUpdate == 'O' ? "X" : "O");
    }

    else {
      status = "Game start with X"
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
        <div className="restart" onClick={()=>{this.deleteRedisKey(),this.setState({
            squares: Array(9).fill(null),
            winnerIsDeclared: false,
        })}}>Restart</div>
      </div>)
    }
  }

// ========================================

// ReactDOM.render(<Game />, document.getElementById("app"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function calculateDraw(squares) {
  if (squares.indexOf(null) == -1) {
    return true;
  }
  return false;
}
