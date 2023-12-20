"use strict";

const players = [
  { num: 1, mark: "O", color: "#FFA9A9" }, // put colors
  { num: 2, mark: "X", color: "#BFD4DB" },
];
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
    gameBoard.render();
  };

  const render = () => {
    playerText.innerHTML = `Player ${players[currentPlayer].num}'s turn. Marker: <span style="background-color:${players[currentPlayer].color}">${players[currentPlayer].mark}<span>`;
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
          gameBoard.getPlayerText().textContent = `Player ${players[playerIndex].num} Won`;
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

gameBoard.render();
