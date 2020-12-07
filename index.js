const express = require('express');
const app = express();
const compression = require('compression');
const db = require('./database/db');
const addTurnScoreToTeamScore = require('./helpers/addTurnScoreToTeam');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uidSafe = require('uid-safe');

const timeToExplain = process.env.NODE_ENV != 'production' ? 11 : 60;

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


///////////////////////------ ROUTES------///////////////////////

//-------------------------GAMES ROUTES-------------------------

app.post('/games', async (req, res) => {
    try {
        const gameUid = await uidSafe(10);
        const {rows} = await db.addNewGame(gameUid);
        res.cookie("gameSetup", true);
        await res.json(rows);
    } catch(error) {
        console.log('error in /games post route: ', error);
    }
});

app.get('/games/:uid/status', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(req.params.uid);
        await res.json({...rows });
    } catch(error) {
        console.log('error in /games/:uid/status get route: ', error);
    }
});

app.post('/games/:uid/status', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(req.params.uid);

        if (rows[0].status === req.body.status) {
            throw new Error;
        } else {
            await db.setGameStatus(req.params.uid, req.body.status);
            await res.json({success: true});
        }
    } catch(error) {
        console.log('error in /games/:uid/status post route: ', error);
        await res.json({success: false});
    }
});

app.post('/games/:uid/startExplaining', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(req.params.uid);
        if (rows[0].status === "PLAYER_EXPLAINING") {
            throw new Error;
        } else {
            await addTurnScoreToTeamScore(req.params.uid);
            await db.startExplaining(req.params.uid, req.cookies.team);
            await db.resetWords(req.params.uid, "pile", "notGuessedThisTurn");
            await db.resetWords(req.params.uid, "pile", "discardedThisTurn");
            await db.resetWords(req.params.uid, "guessed", "guessedThisTurn");
            await res.json({success: true});
        }
    } catch(error) {
        console.log('error in /games/:uid/startExplaining post route: ', error);
        await res.json({success: false});
    }
});

app.post('/games/:uid/startNewRound', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(req.params.uid);
        if (rows[0].status === "PLAYER_EXPLAINING") {
            throw new Error;
        } else {
            await addTurnScoreToTeamScore(req.params.uid);
            await db.setGameStatus(req.params.uid, "PLAYER_EXPLAINING");
            await db.resetWords(req.params.uid, "pile");
            await res.json({success: true});
        }
    } catch(error) {
        console.log('error in /games/:uid/startNewRound post route: ', error);
        await res.json({success: false});
    }
});

app.post('/games/:uid/endGame', async (req, res) => {
    try {
        const {rows} = await db.getGameStatus(req.params.uid);
        if (rows[0].status === "END") {
            throw new Error;
        } else {
            await addTurnScoreToTeamScore(req.params.uid);
            await db.setGameStatus(req.params.uid, "END");
            await res.json({success: true});
        }
    } catch(error) {
        console.log('error in /games/:uid/endGame post route: ', error);
        await res.json({success: false});
    }
});

//-------------------------WORDS ROUTES-------------------------

app.get('/games/:uid/getRandomWord/', async (req, res) => {
    try {
        const {rows} = await db.getRandomWord(req.params.uid);
        if (rows[0] && rows[0].id) {
            const currentDateTime = new Date();
            const reformattedDate = currentDateTime.toISOString().split('T')[0]+' '+ currentDateTime.toTimeString().split(' ')[0];
            await db.setWordDrawn(rows[0].id, req.params.uid, reformattedDate);
        }
        await res.json(rows);
    } catch(error) {
        console.log('error in /games/:uid/getRandomWord/ get route: ', error);
    }
});

app.get('/games/:uid/words/', async (req, res) => {
    try {
        const {rows} = await db.getWordsList(req.params.uid);
        await res.json(rows);
    } catch(error) {
        console.log('error in /games/:uid/words get route: ', error);
    }
});

app.post('/games/:uid/words', async (req, res) => {
    try {
        const {rows} = await db.addWord(req.body.word);
        await res.json(rows);
    } catch(error) {
        console.log('error in /games/:uid/words post route: ', error);
    }
});

app.post('/games/:uid/words/:id/status', async (req, res) => {
    try {
        await db.setWordStatus(req.params.id, req.body.status, req.params.uid);
        await res.json({ success: true});
    } catch(error) {
        console.log('error in /games/:uid/words/:id/status post route: ', error);
    }
});

app.delete('/games/:uid/words', async (req, res) => {
    try {
        await db.deleteWords(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /games/:uid/words delete route: ', error);
    }
});

//-------------------------TEAMS ROUTES-------------------------

app.get('/games/:uid/teams', async (req, res) => {
    try {
        const {rows} = await db.getTeams(req.params.uid);
        await res.json(rows);
    } catch(error) {
        console.log('error in /games/:uid/teams get route: ', error);
        await res.json({success: false});
    }
});

app.post('/games/:uid/createTeams', async (req, res) => {
    try {
        await db.addTeams(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /games/:uid/createTeams post route: ', error);
        await res.json({success: false});
    }
});

app.delete('/games/:uid/teams/', async (req, res) => {
    try {
        await db.deleteTeams(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /games/:uid/teams/ delete route: ', error);
        await res.json({success: false});
    }
});

//-------------------------Cookie ROUTES -------------------------

app.post('/reset-game-setup-cookie', async (req, res) => {
    try {
        res.cookie("gameSetup", null);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /reset-game-setup-cookie: ', error);
        await res.json({success: false});
    }
});

app.post('/set-team-cookie', async (req, res) => {
    const randomTeamAorB = Math.floor(Math.random() * 2) + 1 === 1 ? "A" : "B";
    const team = req.body.team || req.cookies.team || randomTeamAorB;
    try {
        res.cookie("team", team);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /set-team-cookie ', error);
        await res.json({success: false});
    }
});

app.get('/team-cookie', async (req, res) => {
    // TODO: reset team cookie at some point?
    try {
        await res.json({team: req.cookies.team || null});
    } catch(error) {
        console.log('error in /team-cookie route ', error);
        await res.json({success: false});
    }
});

app.get('/game-link-dialog-cookie', async (req, res) => {
    try {
        await res.json({showGameLinkDialog: req.cookies.gameSetup === "true" });
    } catch(error) {
        console.log('error in /game-link-dialog-cookie get route: ', error);
    }
});


//-------------------------SEND FILE ROUTES: game app (/game/:uid) and home (*) -------------------------
app.get('/game/:uid', async (req, res) => {
    try {
        const {rows} = await db.getGame(req.params.uid);
        if (!rows[0]) {
            res.redirect('/');  // if game with uui does not exist -> redirect to home
        }
        res.sendFile(__dirname + '/index.html');
    } catch(error) {
        console.log('error in /game/:uid get route: ', error);
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
    socket.emit("connected");

    socket.on('disconnect', function() {
        socket.emit("disconnected");
    });


    const url = socket.handshake.headers.referer;
    const gameUid = url.split("/game/")[1] && url.split("/game/")[1].replace(/\//g, "");

    // join SOCKET ROOM for gameUid
    if (gameUid){
        socket.join(gameUid);
    }
    let timerId;
    let countdown = timeToExplain;

    const clearAllTimers = () => {
        timerId && clearInterval(timerId);
        timerId = undefined;
    };

    const setCountdownInterval = () => setInterval(function() {
        io.in(gameUid).emit('timer', { countdown, timerId});
        countdown--;
        if (countdown < 0) {
            io.in(gameUid).emit('timer', { countdown: undefined });
            io.in(gameUid).emit('timeOver');
            countdown = timeToExplain;
            const adjustGameStatus = async () => {
                // ignore onTimerOver when game is currently not ongoing:
                const gameStatus = await db.getGameStatus(gameUid);
                if (gameStatus === "END" || gameStatus === "START" ) {
                    return gameStatus;
                }
                await db.setGameStatus(gameUid, "TIME_OVER");
            };
            adjustGameStatus();
            clearInterval(timerId);
            timerId = undefined;
            return;
        }
    }, 1000);

    socket.on('start-game', () => {
        clearAllTimers();
        socket.to(gameUid).emit("game-started");
    });

    socket.on('start-new-game', () => {
        clearAllTimers();
        socket.to(gameUid).emit("new-game-started");
    });

    socket.on('end-game', () => {
        clearAllTimers();
        socket.to(gameUid).emit("game-ended");
    });

    socket.on('start-explaining', () => {
        socket.to(gameUid).emit("other-player-starts-explaining");
        if (timerId) return;
        timerId = setCountdownInterval();
    });

    socket.on('end-of-round', async () => {
        clearAllTimers();
        socket.to(gameUid).emit("end-of-round-reached");
    });

    socket.on('start-new-round', (data) => {
        countdown = data.countdown;
        socket.to(gameUid).emit("new-round-started");
        if (timerId) return;
        if (countdown > 0) {
            timerId = setCountdownInterval();
        }
    });
});