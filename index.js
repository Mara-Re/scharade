const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./database/db");
const addTurnScoreToTeamScore = require("./helpers/addTurnScoreToTeam");
const switchTeams = require("./helpers/switchTeams");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const uidSafe = require("uid-safe");
const timeToExplain = require("./src/shared/time-to-explain");

//-------------------------MIDDLEWARE-------------------------

app.use(compression());

app.use(require("cookie-parser")());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

///////////////////////------ ROUTES------///////////////////////

//-------------------------GAMES ROUTES-------------------------

app.post("/games", async (req, res) => {
    try {
        const gameUid = await uidSafe(10);
        const random1Or2 = Math.floor(Math.random() * 2) + 1;
        const startingTeam = random1Or2 === 1 ? "A" : "B";
        const nrOfWordsPerPlayer = 5;
        const { rows } = await db.addNewGame(
            gameUid,
            startingTeam,
            nrOfWordsPerPlayer
        );
        res.cookie("gameSetup", "true");
        res.cookie("gameHost", "true");
        await res.json(rows);
    } catch (error) {
        console.log("error in /games post route: ", error);
    }
});

app.get("/games/:uid", async (req, res) => {
    try {
        const { rows } = await db.getGame(req.params.uid);
        await res.json({ ...rows });
    } catch (error) {
        console.log("error in /games/:uid/status get route: ", error);
    }
});

app.post("/games/:uid/status", async (req, res) => {
    try {
        const { rows } = await db.getGame(req.params.uid);

        if (rows[0].status === req.body.status) {
            throw new Error();
        } else {
            await db.setGameStatus(req.params.uid, req.body.status);
            await res.json({ success: true });
        }
    } catch (error) {
        console.log("error in /games/:uid/status post route: ", error);
        await res.json({ success: false });
    }
});

app.put("/games/:uid/nrOfWordsPerPlayer", async (req, res) => {
    try {
        await db.setNrOfWordsPerPlayer(req.params.uid, req.body.nrOfWordsPerPlayer);
        await db.deleteWordsExceedingNrOfWords(req.params.uid, req.body.nrOfWordsPerPlayer);
        await res.json({ success: true });

    } catch (error) {
        console.log("error in /games/:uid/nrOfWordsPerPlayer post route: ", error);
        await res.json({ success: false });
    }
});

app.post("/games/:uid/endGame", async (req, res) => {
    try {
        const { rows } = await db.getGame(req.params.uid);
        if (rows[0].status === "END") {
            throw new Error();
        } else {
            await addTurnScoreToTeamScore(req.params.uid);
            await db.setGameStatus(req.params.uid, "END");
            await res.json({ success: true });
        }
    } catch (error) {
        console.log("error in /games/:uid/endGame post route: ", error);
        await res.json({ success: false });
    }
});

//-------------------------WORDS ROUTES-------------------------

app.get("/games/:uid/getRandomWord/", async (req, res) => {
    try {
        const { rows } = await db.getRandomWord(req.params.uid);
        if (rows[0] && rows[0].id) {
            const currentDateTime = new Date();
            const reformattedDate =
                currentDateTime.toISOString().split("T")[0] +
                " " +
                currentDateTime.toTimeString().split(" ")[0];
            await db.setWordDrawn(rows[0].id, req.params.uid, reformattedDate);
        }
        await res.json(rows);
    } catch (error) {
        console.log("error in /games/:uid/getRandomWord/ get route: ", error);
    }
});

app.get("/games/:uid/words/thisTurn", async (req, res) => {
    // get words of this turn (guessedThisTurn, discardedThisTurn, notGuessedThisTurn)
    try {
        const { rows } = await db.getTurnWordsList(req.params.uid);
        await res.json(rows);
    } catch (error) {
        console.log("error in /games/:uid/words get route: ", error);
    }
});

app.get("/games/:uid/words", async (req, res) => {
    const player = req.cookies.player && JSON.parse(req.cookies.player);
    try {
        const { rows } = await db.getPlayerWords(player.id, req.params.uid);
        await res.json(rows);
    } catch (error) {
        console.log("error in /games/:uid/words get route: ", error);
    }
});

app.post("/games/:uid/words", async (req, res) => {
    const player = req.cookies.player && JSON.parse(req.cookies.player);
    let insertedOrDeleted = false;
    try {
        const { rows } = await db.getPlayerIndexWord(
            player.id,
            req.body.playerWordIndex,
            req.params.uid
        );
        // TODO: make sure only the last call is used to delete/update!
        // if word with player index exists
        if (rows[0]) {
            if (!req.body.word) {
                // delete
                await db.deleteWord(rows[0].id, req.params.uid);
                insertedOrDeleted = true;
            } else {
                // update
                await db.updateWord(rows[0].id, req.body.word);
            }
        } else if (req.body.word) {
            //insert
            await db.addWord(
                req.body.word,
                player.id,
                req.body.playerWordIndex,
                req.params.uid
            );
            insertedOrDeleted = true;
        }
        await res.json({ insertedOrDeleted });
    } catch (error) {
        console.log("error in /games/:uid/words post route: ", error);
    }
});

app.post("/games/:uid/words/:id/status", async (req, res) => {
    try {
        await db.setWordStatus(req.params.id, req.body.status, req.params.uid);
        await res.json({ success: true });
    } catch (error) {
        console.log(
            "error in /games/:uid/words/:id/status post route: ",
            error
        );
    }
});

//-------------------------TEAMS ROUTES-------------------------

app.get("/games/:uid/teams", async (req, res) => {
    try {
        const { rows } = await db.getTeams(req.params.uid);
        await res.json(rows);
    } catch (error) {
        console.log("error in /games/:uid/teams get route: ", error);
        await res.json({ success: false });
    }
});

app.post("/games/:uid/createTeams", async (req, res) => {
    try {
        await db.addTeams(req.params.uid);
        await res.json({ success: true });
    } catch (error) {
        console.log("error in /games/:uid/createTeams post route: ", error);
        await res.json({ success: false });
    }
});

//-------------------------PLAYERS ROUTES-------------------------
app.get("/games/:uid/player/:player_id", async (req, res) => {
    try {
        const { rows } = await db.getPlayer(
            req.params.uid,
            req.params.player_id
        );
        await res.json(rows);
    } catch (error) {
        console.log(
            "error in /games/:uid/player/:player_id get route: ",
            error
        );
        await res.json({ success: false });
    }
});

app.get("/games/:uid/players", async (req, res) => {
    try {
        const { rows } = await db.getPlayers(req.params.uid);
        await res.json(rows);
    } catch (error) {
        console.log("error in /games/:uid/players get route: ", error);
        await res.json({ success: false });
    }
});

app.get("/games/:uid/playerMe", async (req, res) => {
    try {
        const player = req.cookies.player && JSON.parse(req.cookies.player);
        if (!player || player.gameUid !== req.params.uid || !player.id) {
            await res.json();
        } else {
            const { rows } = await db.getPlayer(req.params.uid, player.id);
            await res.json(rows);
        }
    } catch (error) {
        console.log("error in /games/:uid/playerMe get route: ", error);
        await res.json({ success: false });
    }
});

app.post("/games/:uid/player", async (req, res) => {
    try {
        const { rows } = await db.addPlayer(req.body.player);
        res.cookie(
            `player`,
            JSON.stringify({ id: rows[0].id, gameUid: req.params.uid })
        );
        res.cookie("playerName", req.body.player.name);
        await res.json({ success: true });
    } catch (error) {
        console.log("error in /games/:uid/player post route: ", error);
        await res.json({ success: false });
    }
});

app.put("/games/:uid/playerMe", async (req, res) => {
    try {
        const player = JSON.parse(req.cookies.player);
        await db.updatePlayerTeam(req.params.uid, player.id, req.body.team);
        await res.json({ success: true });
    } catch (error) {
        console.log("error in /games/:uid/playerMe put route: ", error);
        await res.json({ success: false });
    }
});

app.put("/games/:uid/playerMe/enterWordsCompleted", async (req, res) => {
    try {
        const player = JSON.parse(req.cookies.player);
        await db.updatePlayerEnterWordsCompleted(req.params.uid, player.id);
        await res.json({ success: true });
    } catch (error) {
        console.log("error in /games/:uid/playerMe put route: ", error);
        await res.json({ success: false });
    }
});

//-------------------------Cookie ROUTES -------------------------

app.post("/reset-game-setup-cookie", async (req, res) => {
    try {
        res.cookie("gameSetup", null);
        await res.json({ success: true });
    } catch (error) {
        console.log("error in /reset-game-setup-cookie: ", error);
        await res.json({ success: false });
    }
});

app.get("/game-cookies", async (req, res) => {
    try {
        await res.json({
            showGameLinkDialog: req.cookies.gameSetup === "true",
            isGameHost: req.cookies.gameHost === "true",
        });
    } catch (error) {
        console.log("error in /game-cookies get route: ", error);
    }
});

app.post("/set-game-host-cookie", async (req, res) => {
    try {
        await res.cookie("gameHost", true);
        await res.json({
            isGameHost: true,
        });
    } catch (error) {
        console.log("error in /set-game-host-cookie post route: ", error);
    }
});

//-------------------------SEND FILE ROUTES: game app (/game/:uid) and home (*) -------------------------
app.get("/game/:uid", async (req, res) => {
    try {
        const { rows } = await db.getGame(req.params.uid);
        if (!rows[0]) {
            res.redirect("/"); // if game with uui does not exist -> redirect to home
        }
        res.sendFile(__dirname + "/index.html");
    } catch (error) {
        console.log("error in /game/:uid get route: ", error);
    }
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function () {
    console.log("I'm listening on port 8080.");
});

//-------------------------SOCKET IO-------------------------

io.on("connection", function (socket) {
    socket.emit("connected");

    socket.on("disconnect", function () {
        socket.emit("disconnected");
    });

    const url = socket.handshake.headers.referer;
    const gameUid =
        url.split("/game/")[1] && url.split("/game/")[1].replace(/\//g, "");

    // join SOCKET ROOM for gameUid
    if (gameUid) {
        socket.join(gameUid);
    }
    let timerId;
    let countdown = timeToExplain;

    const clearAllTimers = () => {
        timerId && clearInterval(timerId);
        timerId = undefined;
    };

    const setCountdownInterval = () =>
        setInterval(function () {
            io.in(gameUid).emit("timer", { countdown, timerId });
            countdown--;
            if (countdown < 0) {
                io.in(gameUid).emit("timer", { countdown: undefined });
                io.in(gameUid).emit("new-game-status");
                countdown = timeToExplain;
                const adjustGameStatus = async () => {
                    // ignore onTimerOver when game is currently not ongoing:
                    const { rows } = await db.getGame(gameUid);
                    if (rows[0].status === "END" || rows[0].status === "START") {
                        return;
                    }
                    await db.setGameStatus(gameUid, "TIME_OVER");
                };
                adjustGameStatus();
                clearInterval(timerId);
                timerId = undefined;
                return;
            }
        }, 1000);

    socket.on("start-game", () => {
        clearAllTimers();
        socket.to(gameUid).emit("new-game-status");
    });

    socket.on("start-new-game", ({ gameId }) => {
        clearAllTimers();
        socket.to(gameUid).emit("new-game-started", { gameId });
    });

    socket.on("end-game", () => {
        clearAllTimers();
        socket.to(gameUid).emit("new-game-status");
    });

    socket.on("new-game-config", () => {
        socket.to(gameUid).emit("new-players-and-game-status");
    });

    socket.on("new-player-joins", () => {
        socket.to(gameUid).emit("players-list-changed");
    });

    socket.on("new-word-submit", () => {
        socket.to(gameUid).emit("players-list-changed");
    });

    socket.on("new-player-status", () => {
        socket.to(gameUid).emit("players-list-changed");
    });

    socket.on("switch-team", () => {
        socket.to(gameUid).emit("players-list-changed");
    });

    socket.on("start-explaining", async ({ player }) => {
        try {
            const { rows } = await db.getGame(gameUid);
            const previousTeamExplaining = rows[0].team_explaining;
            if (
                rows[0].status === "PLAYER_EXPLAINING" ||
                previousTeamExplaining === player.teamAorB ||
                timerId
            ) {
                throw new Error();
            } else {
                await addTurnScoreToTeamScore(gameUid);
                await switchTeams(gameUid);
                await db.startExplaining(gameUid, player.id);
                await db.resetWords(gameUid, "pile", "notGuessedThisTurn");
                await db.resetWords(gameUid, "pile", "discardedThisTurn");
                await db.resetWords(gameUid, "guessed", "guessedThisTurn");
                // to all players
                io.in(gameUid).emit("new-game-status");
                if (timerId) return;
                timerId = setCountdownInterval();
            }
        } catch (error) {
            console.log("error in socket start-explaining: ", error);
        }
    });

    socket.on("guessed-word", (data) => {
        socket.to(gameUid).emit("word-was-guessed", data);
    });

    socket.on("discarded-word", () => {
        socket.to(gameUid).emit("word-was-discarded");
    });

    socket.on("end-of-round", async () => {
        clearAllTimers();
        socket.to(gameUid).emit("new-game-status");
    });

    socket.on("start-new-round", async (data) => {
        countdown = data.countdown || countdown;
        try {
            const { rows } = await db.getGame(gameUid);
            if (rows[0].status === "PLAYER_EXPLAINING" || timerId) {
                throw new Error();
            } else {
                await addTurnScoreToTeamScore(gameUid);
                await db.setGameStatus(gameUid, "PLAYER_EXPLAINING");
                await db.resetWords(gameUid, "pile");
                io.in(gameUid).emit("new-game-status");
                if (timerId) return;
                if (countdown > 0) {
                    timerId = setCountdownInterval();
                }
            }
        } catch (error) {
            console.log("error in socket on start-new-round: ", error);
        }
    });
});
