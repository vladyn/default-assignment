/*
 * Boilerplate imports
 */
import './index.scss';
import 'material-design-lite';

/*
* Demo of Websocket connector
* (should be removed as part of the submission)
*/
// 1) import the client connector
// -------------------------
import { createClient } from '../lib/websocketConnector';

/*
* Game playground imports
 */

import turnService from './turn-service';
import whoIsTheWinner from './whoIsTheWinner';
import clickNDrop from './click-n-drop';

// 2) Create a client object
// -------------------------
// This will not create a WS connection, but will only
// return an object that controls the opening and closing
// of the connection.
const client = createClient('localhost', 4000);
const playerName = localStorage.getItem('username');
const playerGender = localStorage.getItem('gender');
let cols: NodeListOf<Element>;
let guestPlayerStatus: HTMLUnknownElement;
let hostPlayerAvatar: HTMLSpanElement;
let guestPlayerAvatar: HTMLSpanElement;
let hostPlayerName: HTMLElement;
let hostPlayerRole: string;
let guestPlayerName: HTMLElement;
let startBtn: HTMLButtonElement;
let joinBtn: HTMLButtonElement = document.getElementById('join_btn') as HTMLButtonElement;
let gameState: boolean = false;

/**
 * Function watching the DOM loaded state
 * @state readystatechange | complete
 */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
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
    // TODO: you can use observable here and subscription to the gameState
    cols.forEach((col, index) => col.addEventListener('click', (evt: any) => {
      const evtElement = evt.srcElement || evt.target;
      if (gameState) {
        clickNDrop(evtElement, hostPlayerRole, gameState);
        console.log(hostPlayerRole);
        if (evtElement.classList.contains('board-col')) {
          whoIsTheWinner(hostPlayerRole, index);
        }
        channel.send({ index, player: hostPlayerRole, type: 'turn' });
        gameState = false;
      }
    }));
  }
};

// 3) At a later point in the implementation we can use the
// -------------------------
// client object to open a connection.
// I.e we now have an active Websocket open
// You can pass in an optional meta object that will be attached to all messages,
// a possible use case is an object identifying the user on the connection.

const connection = client.connect({
  name: localStorage.getItem('username'),
  gender: localStorage.getItem('gender')
});

// 4) Join a channel (ch1) and subscribe to downstream messages.
// -------------------------
// If a channel does not exist one will be created.
// The `downstream` object is of type <Observable>
const channel = connection.join(`ch1`);
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
      channel.send('amigo!');
    }
    if (data.message === 'amigo!') {
      guestPlayerName.textContent = data.meta.name;
      guestPlayerAvatar.classList.add('player-one');
      guestPlayerAvatar.classList.add(data.meta.gender);
      guestPlayerStatus.textContent = '(Online)';
    }
    if (data.message === 'Venga!') {
      startBtn.classList.add('mdl-button--disabled');
      hostPlayerRole = hostPlayerAvatar.classList.contains('player-one')
        ? 'player-one'
        : 'player-two';
      gameState = true;
    }
    if (data.message.type === 'turn') {
      const index = data.message.index;
      const evtElement = cols[index];
      const player = data.message.player;
      clickNDrop(evtElement, player, gameState);
      if (evtElement.classList.contains('board-col')) {
        whoIsTheWinner(player, index);
      }
      gameState = true;
    }
  },
  error: err => console.error('# Something went wrong', err),
  complete: () => console.info('# Complete')
});

function joinGame() {
  channel.send('Hola!');
  hostPlayerAvatar.classList.replace('player-one', 'player-two');
  joinBtn.classList.add('mdl-button--disabled');
  joinBtn.disabled = true;
}

function startGame() {
  hostPlayerRole = hostPlayerAvatar.classList.contains('player-one') ? 'player-one' : 'player-two';
  channel.send('Venga!');
  gameState = hostPlayerRole === turnService();
  startBtn.classList.toggle('mdl-button--disabled');
  startBtn.disabled = startBtn.disabled !== startBtn.disabled;
}
