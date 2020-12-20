const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5555/scharade');

exports.addNewGame = function addNewGame(gameUid) {
    return db.query(
        `INSERT INTO games (uid, status) VALUES ($1, $2) 
        RETURNING *`,
        [ gameUid, 'SETUP' ]
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

module.exports.getGameStatus = function getGameStatus(gameUid) {
    return db.query(
        `SELECT * FROM games
        WHERE uid = $1`
        ,
        [gameUid]
    );
};

module.exports.getGame = function getGame(gameUid) {
    return db.query(
        `SELECT * FROM games
        WHERE uid = $1`
        ,
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

module.exports.startGame = function startGame(gameUid) {
    return db.query(
        `UPDATE games
            SET status = 'START'
            WHERE uid = $1`,
        [gameUid]
    );
};

module.exports.startExplaining = function startExplaining(gameUid, teamAorB) {
    return db.query(
        `UPDATE games
            SET status = $3, team_explaining = $2
            WHERE uid = $1`,
        [gameUid, teamAorB, "PLAYER_EXPLAINING"]
    );
};

module.exports.getTeamExplaining = function getTeamExplaining(gameUid) {
    return db.query(
        `SELECT team_explaining FROM games
        WHERE uid = $1`
        ,
        [gameUid]
    );
};

module.exports.getTimerId = function getTimerId(gameUid) {
    return db.query(
        `SELECT timer_id FROM games
        WHERE uid = $1`
        ,
        [gameUid]
    );
};

module.exports.resetWords = function resetWords(gameUid, status, previousStatus) {
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
            WHERE id = $1 AND game_uid = $3` ,
        [id, status, gameUid]
    );
};

module.exports.setWordDrawn = function setWordDrawn(id, gameUid, date) {
    return db.query(
        `
        UPDATE words
            SET status = $2, drawn_at = $4
            WHERE id = $1 AND game_uid = $3` ,
        [id, "notGuessedThisTurn", gameUid, date]
    );
};

// module.exports.getCurrDateTime = function getCurrDateTime() {
//     return db.query(
//         `
//         SELECT GETDATE();`
//     );
// };

module.exports.addWord = function addWord(word) {
    return db.query(
        `INSERT INTO words (game_uid, word, status) VALUES ($1, $2, $3) 
        RETURNING word, id`,
        [ word.gameUid, word.word, word.status ]
    );
};

module.exports.getTeams = function getTeams(gameUid) {
    return db.query(
        `SELECT * FROM teams
        WHERE game_uid = $1`
        ,
        [gameUid]
    );
};

module.exports.addTeams = function addTeams(gameUid) {
    return db.query(
        `INSERT INTO teams (game_uid, team_a_or_b) VALUES ($1, 'A'), ($1, 'B')`,
        [ gameUid ]
    );
};

module.exports.getTeams = function getTeamscore(gameUid) {
    return db.query(
        `SELECT * FROM teams
            WHERE game_uid = $1` ,
        [gameUid]
    );
};

module.exports.addToTeamscore = function addToTeamscore(gameUid, teamAorB, addPoints) {
    return db.query(
        `UPDATE teams
            SET score = score + $3
            WHERE game_uid = $1 AND team_a_or_b = $2` ,
        [gameUid, teamAorB, addPoints]
    );
};
