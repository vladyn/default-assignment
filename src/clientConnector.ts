import { createClient } from '../lib/websocketConnector';

const client = createClient('localhost', 4000);
const connection = client.connect({
  name: localStorage.getItem('username'),
  gender: localStorage.getItem('gender')
});

export const channel = connection.join(`ch1`);
