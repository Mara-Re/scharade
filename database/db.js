const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL ||'postgres:postgres:postgres@localhost:5433/scharade');

exports.addNewGame = function addNewGame(gameUid) {
    return db.query(
        `INSERT INTO games (uid, status) VALUES ($1, $2) 
        RETURNING *`,
        [ gameUid, 'setup' ]
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
            SET status = 'start'
            WHERE uid = $1`,
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

module.exports.deleteWords = function deleteWords(gameUid) {
    return db.query(
        `DELETE FROM words
            WHERE game_uid = $1`,
        [gameUid]
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

exports.addWord = function addWord(word) {
    return db.query(
        `INSERT INTO words (game_uid, word, status) VALUES ($1, $2, $3) 
        RETURNING word, id`,
        [ word.gameUid, word.word, word.status ]
    );
};