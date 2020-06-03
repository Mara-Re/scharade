import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import Home from './pages/Home';
import CssBaseline from "@material-ui/core/CssBaseline";

let page = <Home />;

if (location.pathname != '/') {
    page = <App/>;
}


ReactDOM.render(
    <>
        <CssBaseline />
        {page}
    </>,
    document.querySelector('main')
);


