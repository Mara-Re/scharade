const express = require('express');
const app = express();
const compression = require('compression');
const db = require('./database/db');
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });


const timeToExplain = 11;

//-------------------------MIDDLEWARE-------------------------

app.use(compression());

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());


//-------------------------ROUTES-------------------------

app.get('/words', async (req, res) => {
    try {
        const {rows} = await db.getWords();
        await res.json(rows);
    } catch(error) {
        console.log('error in /words: ', error);
    }

});

app.get('/random-word', async (req, res) => {
    try {
        const {rows} = await db.getRandomWord();
        await res.json(rows);
    } catch(error) {
        console.log('error in /random-word: ', error);
    }
});

app.get('/is-end-of-round-reached', async (req, res) => {
    try {
        const {rows} = await db.getRandomWord();
        console.log("rows in is end of round reached: ", rows);
        if (rows.length) {
            await res.json({endOfRoundReached: false});
        } else {
            await res.json({endOfRoundReached: true});
        }
    } catch(error) {
        console.log('error in /is-end-of-round-reached: ', error);
    }
});

app.post('/words', async (req, res) => {
    try {
        await db.setWordStatus(req.body.id, req.body.status);
        await res.json({ success: true});
    } catch(error) {
        console.log('error in /word-guessed: ', error);
    }
});

// app.post('/set-player-explaining', async (req, res) => {
//     try {
//         await db.setPlayerExplaining(req.body.gameId, req.body.playerExplaining);
//         await res.json({ success: true});
//     } catch(error) {
//         console.log('error in /set-player-explaining: ', error);
//     }
// });
//
// app.get('/get-player-explaining', async (req, res) => {
//     try {
//         const {rows} = await db.getPlayerExplaining(1);
//         await res.json(rows);
//     } catch(error) {
//         console.log('error in /word-guessed: ', error);
//     }
// });

app.get('/game-status', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(1); // hardcoded gameId
        await res.json(rows);
    } catch(error) {
        console.log('error in /get-game-status: ', error);
    }
});

app.post('/game-status', async (req, res) => {
    console.log("post /game-status: ", req.body.status);
    try {
        const {rows} = await db.getGameStatus(1); // hardcoded gameId
        if (rows[0].status === req.body.status) {
            throw Error;
        } else {
            await db.setGameStatus(1, req.body.status);  // hardcoded gameId
            await res.json({success: true});
        }
    } catch(error) {
        console.log('error in /get-game-status: ', error);
        await res.json({success: false});
    }
});


app.post('/reset-words-status', async (req, res) => {
    try {
        await db.resetWords();
        await res.json({success: true});
    } catch(error) {
        console.log('error in /reset-words-status: ', error);
    }
});

app.post('/reset-discarded-words', async (req, res) => {
    try {
        await db.resetDiscardedWords();
        await res.json({success: true});
    } catch(error) {
        console.log('error in /reset-discarded-words: ', error);
    }
});

app.post('/restart-game', async (req, res) => {
    console.log('restart-game route');
    try {
        await db.restartGame(1); //hardcoded gameId
        await db.resetWords();
        await res.json({success: true});
    } catch(error) {
        console.log('error in /restart-game: ', error);
    }
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, function() {
    console.log("I'm listening.");
});




//-------------------------SOCKET IO-------------------------
io.on('connection', function(socket) {
    // console.log(`socket with the id ${socket.id} is now connected`);

    // socket.on('disconnect', function() {
    //     console.log(`socket with the id ${socket.id} is now disconnected`);
    // });

    let timerId;
    let timerIdStartNewRound;
    let countdown = timeToExplain;

    socket.on('start-explaining', () => {
        socket.broadcast.emit("other-player-starts-explaining");
        timerId = setInterval(function() {
            io.sockets.emit('timer', { countdown, timerId});
            countdown--;
            if (countdown < 0) {
                io.sockets.emit('timer', { countdown: undefined });
                countdown = timeToExplain;
                db.setGameStatus(1, "timeOver"); // hardcoded gameId
                clearInterval(timerId);
                return;
            }
        }, 1000);
    });

    socket.on('end-of-round', async (x) => {
        clearInterval(timerId);
        clearInterval(timerIdStartNewRound);
        socket.broadcast.emit("end-of-round-reached");
    });

    socket.on('start-new-round', () => {
        socket.broadcast.emit("new-round-started");
        console.log("in start-new-round, countdown: ", countdown);
        if (countdown > 0) {
            timerIdStartNewRound = setInterval(function() {
                io.sockets.emit('timer', { countdown });
                countdown--;
                if (countdown < 0) {
                    io.sockets.emit('timer', { countdown: undefined });
                    db.setGameStatus(1, "timeOver");
                    countdown = timeToExplain;
                    clearInterval(timerIdStartNewRound);
                    return;
                }
            }, 1000);
        }
    });
});