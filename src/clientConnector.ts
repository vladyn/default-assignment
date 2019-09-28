import { createClient } from '../lib/websocketConnector';

const board = localStorage.getItem('board');

const client = createClient('localhost', 4000);
const connection = client.connect({
  board,
  name: localStorage.getItem('username'),
  gender: localStorage.getItem('gender')
});

export const channel = connection.join(`ch1`);
