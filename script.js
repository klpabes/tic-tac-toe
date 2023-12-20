"use strict";

const gameBoard = (() => {
  let gameArray = ["", "", "", "", "", "", "", "", ""];
  const container = document.querySelector(".box-container");

  let currentPlayer = 0;
  const playerText = document.querySelector(".turn");

  const btnRestart = document.querySelector(".btn-restart");
  btnRestart.addEventListener("click", (e) => {
    restart();
  });

  const restart = () => {
    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = "";
    }
    currentPlayer = 0;
    game.reset();
    players.length = 0;
    form.classList.remove("hidden");
    overlay.classList.remove("hidden");
    // gameBoard.render();
  };

  const render = () => {
    playerText.innerHTML = `${players[currentPlayer].name}'s turn. Marker: <span style="background-color:${players[currentPlayer].color}">${players[currentPlayer].mark}<span>`;
    container.innerHTML = "";
    gameArray.forEach((square, index) => {
      container.insertAdjacentHTML(
        "beforeend",
        `<div style="background-color:${
          square.color
        }" class='cell num-${index}'>${square.mark ? square.mark : ""}</div>` //put properties from object
      );
    });

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        game.putMark(+e.target.classList[1].split("-")[1], currentPlayer);
      });
    });
  };
  const changePlayer = () => (currentPlayer = currentPlayer == 0 ? 1 : 0);
  const getGameArray = () => gameArray;
  const getPlayerText = () => playerText;
  return { getPlayerText, render, changePlayer, getGameArray };
})();

const game = (() => {
  const main = document.querySelector("body");
  let playing = true;
  const winCond = [
    [0, 1, 2],
    [0, 3, 6],
    [3, 4, 5],
    [6, 7, 8],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
    [1, 4, 7],
  ];

  const reset = () => {
    playing = true;
    main.style.backgroundColor = "#ffffff";
  };

  const putMark = (index, playerIndex) => {
    if (playing) {
      if (gameBoard.getGameArray()[index] !== "") {
        return;
      }
      gameBoard.getGameArray()[index] = players[playerIndex]; // put array
      gameBoard.changePlayer();
      gameBoard.render();

      for (let i = 0; i < winCond.length; i++) {
        //check if win
        const [a, b, c] = winCond[i];
        if (
          gameBoard.getGameArray()[a] &&
          gameBoard.getGameArray()[a] == gameBoard.getGameArray()[b] &&
          gameBoard.getGameArray()[b] == gameBoard.getGameArray()[c]
        ) {
          playing = false;
          gameBoard.getPlayerText().textContent = `${players[playerIndex].name} Won`;
          main.style.backgroundColor = players[playerIndex].color; // change backgroundColor to player
          return;
        }
      }

      //check tie
      if (
        gameBoard.getGameArray().every(function (el) {
          return typeof el === "object";
        })
      ) {
        gameBoard.getPlayerText().textContent = `IT'S A TIE`;
        return;
      }
    }
    return;
  };
  return { reset, putMark };
})();

const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");

const players = [];

function createPlayers(name, mark, color) {
  return { name, mark, color };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const player1Name = document.querySelector("#player-1").value;
  const player2Name = document.querySelector("#player-2").value;
  form.classList.toggle("hidden");
  overlay.classList.toggle("hidden");

  players.push(
    createPlayers(`${player1Name ? player1Name : "Player 1"}`, "O", "#FFA9A9")
  );
  players.push(
    createPlayers(`${player2Name ? player2Name : "Player 2"}`, "X", "#BFD4DB")
  );
  form.reset();
  gameBoard.render();
});
