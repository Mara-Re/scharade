import React from 'react';
import ReactDOM from 'react-dom';
import Game from './pages/Game';
import Home from './pages/Home';
import CssBaseline from "@material-ui/core/CssBaseline";

let page = <Home />;

if (location.pathname != '/') {
    page = <Game/>;
}


ReactDOM.render(
    <>
        <CssBaseline />
        {page}
    </>,
    document.querySelector('main')
);


