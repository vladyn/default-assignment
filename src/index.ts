/*
 * Boilerplate imports
 */
import './index.scss';
import 'material-design-lite';

import { channel } from './clientConnector';
import turnService from './turn-service';
import whoIsTheWinner from './whoIsTheWinner';
import clickNDrop from './click-n-drop';
import dialogPolyfill from 'dialog-polyfill';
import resetBoard from './resetBoard';

const playerName = localStorage.getItem('username');
const playerGender = localStorage.getItem('gender');
let dialog: HTMLDialogElement;
let cols: NodeListOf<Element>;
let guestPlayerStatus: HTMLUnknownElement;
let hostPlayerAvatar: HTMLSpanElement;
let guestPlayerAvatar: HTMLSpanElement;
let hostPlayerName: HTMLElement;
let hostPlayerRole: string;
let guestPlayerName: HTMLElement;
let startBtn: HTMLButtonElement;
let joinBtn: HTMLButtonElement = document.getElementById('join_btn') as HTMLButtonElement;
let yourTurn: boolean = false;
let gameState: string;

playerName === null ? window.location.href = '/introduce.html' : null;

/**
 * Function watching the DOM loaded state
 * @state readystatechange | complete
 */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    dialog = document.querySelector('dialog') as any;
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', () => {
      dialog.close();
    });
    dialog.querySelector('.reset').addEventListener('click', () => {
      resetBoard();
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
    cols = document.querySelectorAll('div.board-col');

    // Game playground initializers and events
    joinBtn.addEventListener('click', joinGame);
    startBtn.addEventListener('click', startGame);

    // Attach a game logic to the UI
    cols.forEach((col, index) => col.addEventListener('click', (evt: any) => {
      const evtElement = evt.srcElement || evt.target;
      const tokens = col.querySelectorAll('span').length;
      if (yourTurn && tokens < 6 && gameState !== 'ended') {
        clickNDrop(evtElement, hostPlayerRole, yourTurn);
        if (evtElement.classList.contains('board-col')) {
          whoIsTheWinner(hostPlayerRole, index);
        }
        channel.send({ index, player: hostPlayerRole, type: 'turn' });
        yourTurn = false;
      }
    }));
  }
};

channel.downstream.subscribe({
  next: ({ data }) => {
    if (data.channel.size > 2) {
      console.warn(`Game is limited to two players only.
      You have ${data.channel.size} players connected`);
    }
    if (data.error) {
      console.error('# Something went wrong', data.error);
      return;
    }
    if (data.message === 'Hola!') {
      startBtn.classList.toggle('mdl-button--disabled');
      startBtn.disabled = startBtn.disabled !== startBtn.disabled;
      joinBtn.classList.add('mdl-button--disabled');
      joinBtn.disabled = true;
      guestPlayerAvatar.classList.add('player-two');
      guestPlayerAvatar.classList.add(data.meta.gender);
      guestPlayerName.textContent = data.meta.name;
      guestPlayerStatus.textContent = '(Online)';
      gameState = 'ready';
      channel.send('amigo!');
    }
    if (data.message === 'amigo!') {
      guestPlayerAvatar.classList.add('player-one');
      guestPlayerAvatar.classList.add(data.meta.gender);
      guestPlayerName.textContent = data.meta.name;
      guestPlayerStatus.textContent = '(Online)';
      gameState = 'ready';
    }
    if (data.message === 'Venga!') {
      startBtn.classList.add('mdl-button--disabled');
      hostPlayerRole = hostPlayerAvatar.classList.contains('player-one')
        ? 'player-one'
        : 'player-two';
      yourTurn = true;
      gameState = 'running';
    }
    if (data.message.type === 'turn') {
      const { index, player } = data.message;
      const evtElement = cols[index];
      clickNDrop(evtElement, player, yourTurn);
      if (evtElement.classList.contains('board-col')) {
        whoIsTheWinner(player, index);
      }
      yourTurn = true;
    }
    if (data.message === 'winner!') {
      dialog.showModal();
      gameState = 'ended';
    }
  },
  error: err => console.error('# An error was spawned:', err),
  complete: () => console.info('# Complete')
});

function joinGame() {
  hostPlayerAvatar.classList.replace('player-one', 'player-two');
  joinBtn.classList.add('mdl-button--disabled');
  joinBtn.disabled = true;
  gameState = 'ready';
  channel.send('Hola!');
}

function startGame() {
  if (gameState !== 'ready') return;
  hostPlayerRole = hostPlayerAvatar.classList.contains('player-one') ? 'player-one' : 'player-two';
  yourTurn = hostPlayerRole === turnService();
  startBtn.classList.toggle('mdl-button--disabled');
  startBtn.disabled = startBtn.disabled !== startBtn.disabled;
  gameState = 'running';
  channel.send('Venga!');
}
