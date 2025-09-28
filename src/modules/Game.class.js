// src/modules/Game.class.js
'use strict';

export default class Game {
  constructor(size = 4) {
    this.size = size;
    this.score = 0;
    this.status = 'idle';
    this.board = this.createBoard();
  }

  createBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  start() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  getBoard() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let row = this.board[r].filter((n) => n !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
        }
      }

      row = row.filter((n) => n !== 0);

      while (row.length < this.size) {
        row.push(0);
      }

      if (!moved && row.some((val, idx) => val !== this.board[r][idx])) {
        moved = true;
      }

      this.board[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkStatus();
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  addRandomTile() {
    const empty = [];

    for (let rIndex = 0; rIndex < this.size; rIndex++) {
      for (let cIndex = 0; cIndex < this.size; cIndex++) {
        if (this.board[rIndex][cIndex] === 0) {
          empty.push({ r: rIndex, c: cIndex });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  canMove() {
    for (let rIndex = 0; rIndex < this.size; rIndex++) {
      for (let cIndex = 0; cIndex < this.size; cIndex++) {
        if (this.board[rIndex][cIndex] === 0) {
          return true;
        }

        if (
          cIndex < this.size - 1 &&
          this.board[rIndex][cIndex] === this.board[rIndex][cIndex + 1]
        ) {
          return true;
        }

        if (
          rIndex < this.size - 1 &&
          this.board[rIndex][cIndex] === this.board[rIndex + 1][cIndex]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
