const express = require('express');
const app = express();
const compression = require('compression');
const db = require('./database/db');
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
        await res.json({...rows, showGameLinkDialog: req.cookies.gameSetup === "true" });
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
        console.log('error in /games/:uid/status get route: ', error);
        await res.json({success: false});
    }
});

//-------------------------WORDS ROUTES-------------------------

app.get('/games/:uid/getRandomWord/', async (req, res) => {
    try {
        const {rows} = await db.getRandomWord(req.params.uid);
        await res.json(rows);
    } catch(error) {
        console.log('error in /games/:uid/words/random get route: ', error);
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

app.post('/games/:uid/resetWordsStatus', async (req, res) => {
    try {
        await db.resetWords(req.params.uid, req.body.status, req.body.previousStatus);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /games/:uid/words/resetStatus post route: ', error);
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
    }
});

app.post('/games/:uid/createTeams', async (req, res) => {
    try {
        await db.addTeams(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('error in /games/:uid/words post route: ', error);
        await res.json({success: false});
    }
});

//-------------------------TEAMS SCORE ROUTES-------------------------
app.get('/games/:uid/teams', async (req, res) => {
    try {
        const {rows} = await db.getTeams(req.params.uid);
        await res.json(rows);
    } catch(error) {
        console.log('/games/:uid/teams/getTeamData get route: ', error);
        await res.json({success: false});
    }
});


app.post('/games/:uid/teams/addToScore', async (req, res) => {
    try {
        await db.addToTeamscore(req.params.uid, req.cookies.team, req.body.addPoints);
        await res.json({success: true});
    } catch(error) {
        console.log('/games/:uid/words post route: ', error);
        await res.json({success: false});
    }
});

app.delete('/games/:uid/teams/', async (req, res) => {
    try {
        await db.deleteTeams(req.params.uid);
        await res.json({success: true});
    } catch(error) {
        console.log('/games/:uid/words post route: ', error);
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
    const team = req.body.team || req.cookies.team || Math.floor(Math.random() * 2) + 1;
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
        await res.json({team: req.cookies.team});
    } catch(error) {
        console.log('error in /team-cookie route ', error);
        await res.json({success: false});
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
    const url = socket.handshake.headers.referer;
    const gameUid = url.split("/game/")[1] && url.split("/game/")[1].replace(/\//g, "");

    // join SOCKET ROOM for gameUid
    if (gameUid){
        socket.join(gameUid);
    }
    let timerId;
    let timerIdStartNewRound;
    let countdown = timeToExplain;

    socket.on('start-game', () => {
        timerId && clearInterval(timerId);
        timerIdStartNewRound && clearInterval(timerIdStartNewRound);
        socket.to(gameUid).emit("game-started");
    });

    socket.on('start-new-game', () => {
        timerId && clearInterval(timerId);
        timerIdStartNewRound && clearInterval(timerIdStartNewRound);
        socket.to(gameUid).emit("new-game-started");
    });

    socket.on('end-game', () => {
        timerId && clearInterval(timerId);
        timerIdStartNewRound && clearInterval(timerIdStartNewRound);
        socket.to(gameUid).emit("game-ended");
    });

    socket.on('start-explaining', () => {
        socket.to(gameUid).emit("other-player-starts-explaining");
        timerId = setInterval(function() {
            io.in(gameUid).emit('timer', { countdown, timerId});
            countdown--;
            if (countdown < 0) {
                io.in(gameUid).emit('timer', { countdown: undefined });
                io.in(gameUid).emit('timeOver');
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
        if (countdown > 0) {
            timerIdStartNewRound = setInterval(function() {
                io.in(gameUid).emit('timer', { countdown });
                countdown--;
                if (countdown < 0) {
                    io.in(gameUid).emit('timer', { countdown: undefined });
                    io.in(gameUid).emit('timeOver');
                    db.setGameStatus(gameUid, "timeOver");
                    countdown = timeToExplain;
                    clearInterval(timerIdStartNewRound);
                    return;
                }
            }, 1000);
        }
    });
});