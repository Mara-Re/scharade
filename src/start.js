import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import * as io from 'socket.io-client';


export const socket = io.connect();

ReactDOM.render(
    <App />,
    document.querySelector('main')
);


