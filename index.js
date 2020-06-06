const express = require('express');
const app = express();
const compression = require('compression');
const db = require('./database/db');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uidSafe = require('uid-safe');


const timeToExplain = 11;

//-------------------------MIDDLEWARE-------------------------

app.use(compression());

app.use(require('cookie-parser')());

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

app.post('/setup-new-game', async (req, res) => {
    console.log('/setup-new-game route');
    try {
        const gameUid = await uidSafe(10);
        console.log("gameUuid: ", gameUid);
        const {rows} = await db.addNewGame(gameUid);
        res.cookie("gameSetup", "true");
        await res.json(rows);
    } catch(error) {
        console.log('error in /setup-new-game: ', error);
    }
});

app.get('/random-word/:uid', async (req, res) => {
    console.log('route /random-word');

    try {
        const {rows} = await db.getRandomWord(req.params.uid);
        await res.json(rows);
    } catch(error) {
        console.log('error in /random-word: ', error);
    }
});

app.post('/words-status/:uid', async (req, res) => {
    try {
        await db.setWordStatus(req.body.id, req.body.status, req.params.uid);
        await res.json({ success: true});
    } catch(error) {
        console.log('error in /words-status: ', error);
    }
});


app.post('/words/:uid', async (req, res) => {
    try {
        const {rows} = await db.addWord(req.params.uid, req.body.word);
        await res.json(rows);
    } catch(error) {
        console.log('error in /words: ', error);
    }
});

app.get('/game-status/:uid', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(req.params.uid);
        await res.json({...rows, showGameLinkDialog: req.cookies.gameSetup === "true" });
    } catch(error) {
        console.log('error in /get-game-status: ', error);
    }
});

app.post('/game-status/:uid', async (req, res) => {
    console.log("post /game-status: ", req.body.status);
    try {
        const {rows} = await db.getGameStatus(req.params.uid);
        if (rows[0].status === req.body.status) {
            throw Error;
        } else {
            await db.setGameStatus(req.params.uid, req.body.status);
            await res.json({success: true});
        }
    } catch(error) {
        console.log('error in /get-game-status: ', error);
        await res.json({success: false});
    }
});


app.post('/reset-game-setup-cookie', async (req, res) => {
    console.log("post /reset-game-setup-cookie req.cookies", req.cookies);
    try {
        res.cookie("gameSetup", null);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /get-game-status: ', error);
        await res.json({success: false});
    }
});


app.post('/reset-words-status/:uid', async (req, res) => {
    try {
        await db.resetWords(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /reset-words-status: ', error);
    }
});

app.post('/reset-discarded-words/:uid', async (req, res) => {
    try {
        await db.resetDiscardedWords(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /reset-discarded-words: ', error);
    }
});

app.post('/start-game/:uid', async (req, res) => {
    console.log('start-game route');
    try {
        await db.startGame(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /start-game: ', error);
    }
});


app.post('/start-new-game/:uid', async (req, res) => {
    console.log('start-new-game route');
    try {
        await db.startNewGame(req.params.uid);
        await db.deleteWords(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /start-new-game: ', error);
    }
});


app.get('/game/:uid', async (req, res) => {
    try {
        const {rows} = await db.getGame(req.params.uid);
        if (!rows[0]) {
            res.redirect('/');  // if game with uui does not exist -> redirect to home
        }
        res.sendFile(__dirname + '/index.html');
    } catch(error) {
        console.log('error in /start-new-game: ', error);
    }
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on port 8080.");
});




//-------------------------SOCKET IO-------------------------
io.on('connection', function(socket) {
    const url = socket.handshake.headers.referer;
    console.log("socket connection!, url: ", url);
    const gameUid = url.split("/game/")[1] && url.split("/game/")[1].replace(/\//g, "");
    console.log("gameUid: ", gameUid);
    if (gameUid){
        socket.join(gameUid);
    }
    let timerId;
    let timerIdStartNewRound;
    let countdown = timeToExplain;

    socket.on('start-game', () => {
        socket.to(gameUid).emit("game-started");
    });

    socket.on('start-new-game', () => {
        socket.to(gameUid).emit("new-game-started");
    });

    socket.on('start-explaining', () => {
        socket.to(gameUid).emit("other-player-starts-explaining");
        timerId = setInterval(function() {
            io.in(gameUid).emit('timer', { countdown, timerId});
            countdown--;
            if (countdown < 0) {
                io.in(gameUid).emit('timer', { countdown: undefined });
                countdown = timeToExplain;
                db.setGameStatus(gameUid, "timeOver");
                clearInterval(timerId);
                return;
            }
        }, 1000);
    });

    socket.on('end-of-round', async () => {
        clearInterval(timerId);
        clearInterval(timerIdStartNewRound);
        socket.to(gameUid).emit("end-of-round-reached");
    });

    socket.on('start-new-round', (data) => {
        countdown = data.countdown;
        socket.to(gameUid).emit("new-round-started");
        console.log("in start-new-round, countdown: ", countdown);
        if (countdown > 0) {
            timerIdStartNewRound = setInterval(function() {
                io.in(gameUid).emit('timer', { countdown });
                countdown--;
                if (countdown < 0) {
                    io.in(gameUid).emit('timer', { countdown: undefined });
                    db.setGameStatus(gameUid, "timeOver");
                    countdown = timeToExplain;
                    clearInterval(timerIdStartNewRound);
                    return;
                }
            }, 1000);
        }
    });
});