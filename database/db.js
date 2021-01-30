const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5555/scharade"
);

exports.addNewGame = function addNewGame(gameUid, team) {
    return db.query(
        `INSERT INTO games (uid, status, team_explaining) VALUES ($1, $2, $3) 
        RETURNING *`,
        [gameUid, "SETUP", team]
    );
};

module.exports.getRandomWord = function getRandomWord(gameUid) {
    return db.query(
        `SELECT * FROM words
        WHERE status = 'pile' AND game_uid = $1
        ORDER BY RANDOM()
        LIMIT 1`,
        [gameUid]
    );
};

module.exports.getWordsList = function getWordsList(gameUid) {
    return db.query(
        `SELECT * FROM words
        WHERE (status = 'guessedThisTurn' OR status = 'discardedThisTurn' OR status = 'notGuessedThisTurn') AND game_uid = $1
        ORDER BY drawn_at`,
        [gameUid]
    );
};

module.exports.getGame = function getGame(gameUid) {
    return db.query(
        `SELECT * FROM games
        WHERE uid = $1`,
        [gameUid]
    );
};

module.exports.updateTeamExplaining = function updateTeamExplaining(
    gameUid,
    team
) {
    return db.query(
        `UPDATE games
            SET team_explaining = $2
            WHERE uid = $1`,
        [gameUid, team]
    );
};

module.exports.getGame = function getGame(gameUid) {
    return db.query(
        `SELECT * FROM games
        WHERE uid = $1`,
        [gameUid]
    );
};

module.exports.setGameStatus = function setGameStatus(gameUid, status) {
    return db.query(
        `UPDATE games
            SET status = $2
            WHERE uid = $1`,
        [gameUid, status]
    );
};

module.exports.startExplaining = function startExplaining(gameUid, playerId) {
    return db.query(
        `UPDATE games
            SET status = $2, player_explaining_id = $3
            WHERE uid = $1`,
        [gameUid, "PLAYER_EXPLAINING", playerId]
    );
};

module.exports.getTeamExplaining = function getTeamExplaining(gameUid) {
    return db.query(
        `SELECT team_explaining FROM games
        WHERE uid = $1`,
        [gameUid]
    );
};

module.exports.getTimerId = function getTimerId(gameUid) {
    return db.query(
        `SELECT timer_id FROM games
        WHERE uid = $1`,
        [gameUid]
    );
};

module.exports.resetWords = function resetWords(
    gameUid,
    status,
    previousStatus
) {
    if (previousStatus) {
        return db.query(
            `UPDATE words
            SET status = $2
            WHERE game_uid = $1 AND status = $3`,
            [gameUid, status, previousStatus]
        );
    }
    return db.query(
        `UPDATE words
            SET status = $2
            WHERE game_uid = $1`,
        [gameUid, status]
    );
};

module.exports.setWordStatus = function setWordStatus(id, status, gameUid) {
    return db.query(
        `UPDATE words
            SET status = $2
            WHERE id = $1 AND game_uid = $3`,
        [id, status, gameUid]
    );
};

module.exports.setWordDrawn = function setWordDrawn(id, gameUid, date) {
    return db.query(
        `
        UPDATE words
            SET status = $2, drawn_at = $4
            WHERE id = $1 AND game_uid = $3`,
        [id, "notGuessedThisTurn", gameUid, date]
    );
};

module.exports.addWord = function addWord(word, playerId) {
    return db.query(
        `INSERT INTO words (game_uid, word, status, player_id) VALUES ($1, $2, $3, $4) 
        RETURNING word, id`,
        [word.gameUid, word.word, word.status, playerId]
    );
};

module.exports.addPlayer = function addPlayer(player) {
    return db.query(
        `INSERT INTO players (game_uid, name, team_a_or_b) VALUES ($1, $2, $3) 
        RETURNING *`,
        [player.gameUid, player.name, player.team]
    );
};

module.exports.getPlayer = function getPlayer(gameUid, playerId) {
    return db.query(
        `SELECT id, name, team_a_or_b as "teamAorB", game_uid as "gameUid" FROM players
        WHERE game_uid = $1 AND id = $2`,
        [gameUid, playerId]
    );
};

module.exports.getPlayers = function getPlayers(gameUid) {
    return db.query(
        `SELECT name, team_a_or_b AS "teamAorB", COUNT(words.id) AS "nrOfWords"
        FROM players
        LEFT JOIN words
        ON words.player_id = players.id
        WHERE players.game_uid = $1
        GROUP BY players.id
        `,
        [gameUid]
    );
};

module.exports.getNrOfWordsForPlayer = function getNrOfWordsForPlayer(gameUid, playerId) {
    return db.query(
        `SELECT COUNT(id) FROM words
        WHERE game_uid = $1 AND player_id = $2`,
        [gameUid, playerId]
    );
};

module.exports.updatePlayerTeam = function updatePlayerTeam(gameUid, playerId, teamAorB) {
    return db.query(
        `UPDATE players
            SET team_a_or_b = $3
            WHERE game_uid = $1 AND id = $2`,
        [gameUid, playerId, teamAorB]
    );
};

module.exports.getTeams = function getTeams(gameUid) {
    return db.query(
        `SELECT * FROM teams
        WHERE game_uid = $1`,
        [gameUid]
    );
};

module.exports.addTeams = function addTeams(gameUid) {
    return db.query(
        `INSERT INTO teams (game_uid, team_a_or_b) VALUES ($1, 'A'), ($1, 'B')`,
        [gameUid]
    );
};

module.exports.addToTeamscore = function addToTeamscore(
    gameUid,
    teamAorB,
    addPoints
) {
    return db.query(
        `UPDATE teams
            SET score = score + $3
            WHERE game_uid = $1 AND team_a_or_b = $2`,
        [gameUid, teamAorB, addPoints]
    );
};
