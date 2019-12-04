/*
 * Boilerplate imports
 */
import './index.scss';
import 'material-design-lite';

import { channel } from './clientConnector';
import turnService from './turnService';
import whoIsTheWinner from './whoIsTheWinner';
import clickAndDrop from './clickAndDrop';
import dialogPolyfill from 'dialog-polyfill';
import resetBoard from './resetBoard';

const playerName = localStorage.getItem('username');
const playerGender = localStorage.getItem('gender');
let localBoard: string | null;
let remoteBoard: string | null;
let dialog: HTMLDialogElement;
let cols: NodeListOf<Element>;
let guestPlayerStatus: HTMLUnknownElement;
let hostPlayerAvatar: HTMLSpanElement;
let guestPlayerAvatar: HTMLSpanElement;
let hostPlayerName: HTMLElement;
export let hostPlayerRole: string;
let guestPlayerName: HTMLElement;
let startBtn: HTMLButtonElement;
let joinBtn: HTMLButtonElement;
let modalTitle : HTMLElement;
let yourTurn: boolean = false;
let gameState: 'running' | 'ready' | 'resumed' | 'ended';

const url = '/introduce.html';
playerName === null ? window.location.assign(url) : null;

/**
 * Function watching the DOM loaded state
 * @state readystatechange | complete
 */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    dialog = document.querySelector('dialog') as any;
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', () => {
      dialog.close();
    });
    dialog.querySelector('.reset').addEventListener('click', () => {
      resetBoard();
      gameState = 'ended';
      startGame();
      channel.send('Hola!');
      dialog.close();
    });
    hostPlayerName = document.getElementById('hostPlayerName');
    hostPlayerAvatar = document.getElementById('hostPlayerAvatar');
    hostPlayerName.textContent = playerName;
    hostPlayerAvatar.classList.add(playerGender);
    guestPlayerName = document.getElementById('guestPlayerName');
    guestPlayerStatus = document.getElementById('guestPlayerStatus');
    guestPlayerAvatar = document.getElementById('guestPlayerAvatar');
    startBtn = document.getElementById('start_btn') as HTMLButtonElement;
    joinBtn = document.getElementById('join_btn') as HTMLButtonElement;
    modalTitle = dialog.querySelector('h3');
    cols = document.querySelectorAll('div.board-col');

    // Game playground initializers and events
    joinBtn.addEventListener('click', joinGame);
    startBtn.addEventListener('click', startGame);

    // Attach a game logic to the UI
    cols.forEach((col, index) => col.addEventListener('click', (evt: any) => {
      const evtElement = evt.srcElement || evt.target;
      const tokens = col.querySelectorAll('span').length;
      if (yourTurn && tokens < 6 && gameState !== 'ended') {
        clickAndDrop(evtElement, hostPlayerRole, yourTurn);
        if (hostPlayerRole === turnService()) {
          hostPlayerAvatar.classList.add('their-turn');
          guestPlayerAvatar.classList.remove('their-turn');
        } else if (hostPlayerRole !== turnService()) {
          hostPlayerAvatar.classList.remove('their-turn');
          guestPlayerAvatar.classList.add('their-turn');
        }
        if (evtElement.classList.contains('board-col')) {
          whoIsTheWinner(hostPlayerRole, index);
        }
        channel.send({ index, player: hostPlayerRole, type: 'turn', state: gameState });
        turnCircling('theirs');
      }
    }));
  }
};

channel.downstream.subscribe({
  next: ({ data }) => {
    console.log(data); // TODO: Remove
    localBoard = localStorage.getItem('board');
    remoteBoard = data.meta.board;
    if (data.channel.size > 2) {
      console.warn(`Game is limited to two players only.
      You have ${data.channel.size} players connected`);
      window.location.assign('/403');
    }

    if (data.error) {
      console.error('# Something went wrong', data.error);
      return;
    }

    if (data.message.type === 'JOIN_CHANNEL') {
      // TODO: inspect this
      document.onreadystatechange = (event: any) => {
        event.target.readyState === 'interactive' ? joinBtn.disabled = false : null;
      };
      joinBtn.classList.remove('mdl-button--disabled');
      joinBtn.disabled = false;
      guestPlayerStatus.textContent = `(${data.channel.size - 1} Player(s) ready to join)`;
    }

    if (data.message.type === 'LEAVE_CHANNEL') {
      channel.leave();
      // TODO: inspect this
      document.onreadystatechange = (event: any) => {
        event.target.readyState === 'interactive' ? joinBtn.disabled = true : null;
      };
      guestPlayerStatus.textContent = '(Offline)';
      joinBtn.classList.add('mdl-button--disabled');
      joinBtn.disabled = true;
    }

    if (data.message === 'Hola!') {
      startBtn.classList.toggle('mdl-button--disabled');
      startBtn.disabled = startBtn.disabled !== startBtn.disabled;
      joinBtn.classList.add('mdl-button--disabled');
      joinBtn.disabled = true;
      guestPlayerAvatar.classList.add(data.meta.gender);
      guestPlayerName.textContent = data.meta.name;
      toggleAvatar();
      guestPlayerStatus.textContent = '(Online)';
      if (dialog.open) {
        resetBoard();
        dialog.close();
      }
      gameState = compareBoards(localBoard, remoteBoard);
      channel.send('amigo!');
    }

    if (data.message === 'amigo!') {
      guestPlayerAvatar.classList.add(data.meta.gender);
      guestPlayerName.textContent = data.meta.name;
      toggleAvatar();
      guestPlayerStatus.textContent = '(Online)';
      gameState = compareBoards(localBoard, remoteBoard);
    }

    if (data.message === 'Venga!') {
      startBtn.classList.add('mdl-button--disabled');
      startBtn.disabled = true;
      joinBtn.classList.add('mdl-button--disabled');
      joinBtn.disabled = true;
      hostPlayerRole = hostPlayerAvatar.classList.contains('player-one')
        ? 'player-one'
        : 'player-two';
      turnCircling('theirs');
      gameState = 'running';
    }

    if (data.message.type === 'turn') {
      const { index, player } = data.message;
      const evtElement = cols[index];
      clickAndDrop(evtElement, player, yourTurn);
      if (evtElement.classList.contains('board-col')) {
        whoIsTheWinner(player, index);
      }
      turnCircling('yours');
    }
    if (data.message === 'winner!') {
      setTimeout(() => dialog.showModal(), 3000);
      gameState = 'ended';
      turnCircling('ends');
      localStorage.removeItem('board');
      localStorage.removeItem('player');
    }
    if (data.message === 'draw!') {
      modalTitle.textContent = 'The GAME is DRAW!';
      dialog.showModal();
      gameState = 'ended';
      turnCircling('ends');
      localStorage.removeItem('board');
      localStorage.removeItem('player');
    }
  },
  error: err => console.error('# An error was spawned:', err),
  complete: () => {
    channel.leave();
    console.info('# Complete');
    // TODO: Yoo can use this block here for handling the left opponent
  }
});

function joinGame() {
  hostPlayerAvatar.classList.replace('player-one', 'player-two');
  joinBtn.classList.add('mdl-button--disabled');
  joinBtn.disabled = true;
  startBtn.classList.add('mdl-button--disabled');
  startBtn.disabled = true;
  gameState = 'ready';
  channel.send('Hola!');
}

function startGame() {
  if (gameState !== 'resumed') resetBoard();
  if (gameState === 'ready' || gameState === 'resumed') {
    // tslint:disable-next-line:max-line-length
    hostPlayerRole = hostPlayerAvatar.classList.contains('player-one') ? 'player-one' : 'player-two';
    turnCircling('yours');
    startBtn.classList.add('mdl-button--disabled');
    startBtn.disabled = true;
    gameState = 'running';
    channel.send('Venga!');
  } else {
    return;
  }
}

function restoreBoard(board): void {
  const player = localStorage.getItem('player') === 'player-two' ? 'player-one' : 'player-two';
  const turn = hostPlayerRole === player ? 'yours' : 'theirs';
  const boardCols = Object.entries(board);
  for (const col of boardCols) {
    const index = Number(col.toString().substring(3, 4));
    const colTokens: [] = col[1] as [];
    for (const el of colTokens) {
      clickAndDrop(cols[index], el, yourTurn);
    }
  }
  gameState = 'resumed';
  turnCircling(turn);
}

function toggleAvatar(): void {
  hostPlayerAvatar.classList.contains('player-two')
    ?
    guestPlayerAvatar.classList.add('player-one')
    :
    guestPlayerAvatar.classList.add('player-two');
}

function compareBoards(local, remote):'resumed' | 'ready' {
  let state: 'resumed' | 'ready';
  if (local !== null && local === remote) {
    restoreBoard(JSON.parse(localBoard));
    state = 'resumed';
  } else {
    resetBoard();
    localStorage.removeItem('board');
    state = 'ready';
  }
  return state;
}

export function turnCircling(turn: 'yours' | 'theirs' | 'ends'): void {
  const tokens = 'their-turn';
  switch (turn) {
    case 'yours':
      hostPlayerAvatar.classList.add(tokens);
      guestPlayerAvatar.classList.remove(tokens);
      yourTurn = true;
      break;
    case 'theirs':
      guestPlayerAvatar.classList.add(tokens);
      hostPlayerAvatar.classList.remove(tokens);
      yourTurn = false;
      break;
    case 'ends':
      guestPlayerAvatar.classList.remove(tokens);
      hostPlayerAvatar.classList.remove(tokens);
      break;
  }
}
