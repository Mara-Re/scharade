const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL ||'postgres:postgres:postgres@localhost:5433/scharade');

module.exports.getRandomWord = function getRandomWord(gameId) {
    return db.query(
        `SELECT * FROM words
        WHERE status = 'pile' AND game_id = $1
        ORDER BY RANDOM()
        LIMIT 1`,
        [gameId]
    );
};

module.exports.getGameStatus = function getGameStatus(gameId) {
    return db.query(
        `SELECT * FROM games
        WHERE id = $1`
        ,
        [gameId]
    );
};

module.exports.setGameStatus = function getGameStatus(gameId, status) {
    return db.query(
        `UPDATE games
            SET status = $2
            WHERE id = $1`,
        [gameId, status]
    );
};

//also set id_player_explaining to null
module.exports.startNewGame=function startNewGame(gameId) {
    return db.query(
        `UPDATE games
            SET status = 'setup'
            WHERE id = $1`,
        [gameId]
    );
};

module.exports.startGame = function startGame(gameId) {
    return db.query(
        `UPDATE games
            SET status = 'start'
            WHERE id = $1`,
        [gameId]
    );
};

module.exports.setTimerId=function setTimerId(gameId, timerId) {
    return db.query(
        `UPDATE games
            SET timer_id = $2
            WHERE id = $1`,
        [gameId, timerId]
    );
};

module.exports.getTimerId = function getTimerId(gameId) {
    return db.query(
        `SELECT timer_id FROM games
        WHERE id = $1`
        ,
        [gameId]
    );
};

module.exports.resetWords = function resetWords(gameId) {
    return db.query(
        `UPDATE words
            SET status = 'pile'
            WHERE game_id = $1`,
        [gameId]
    );
};

module.exports.deleteWords = function deleteWords(gameId) {
    return db.query(
        `DELETE FROM words
            WHERE game_id = $1`,
        [gameId]
    );
};

module.exports.resetDiscardedWords = function resetDiscardedWords(gameId) {
    return db.query(
        `UPDATE words
            SET status = 'pile'
            WHERE game_id = $1 AND status = 'discarded'`,
        [gameId]
    );
};


module.exports.setWordStatus = function setWordStatus(id, status) {
    return db.query(
        `UPDATE words
            SET status = $2
            WHERE id = $1`,
        [id, status]
    );
};

// module.exports.setPlayerExplaining = function setPlayerExplaining(gameId, playerExplaining) {
//     return db.query(
//         `UPDATE games
//             SET player_explaining=$2
//             WHERE id=$1`,
//         [gameId, playerExplaining]
//     );
// };

// module.exports.getPlayerExplaining = function getPlayerExplaining(gameId) {
//     return db.query(
//         `SELECT id, player_explaining FROM games
//         WHERE id=$1
//         `,
//         [gameId]
//     );
// };


exports.addWord = function addWord(gameId, word) {
    return db.query(
        `INSERT INTO words (game_id, word, status) VALUES ($1, $2, $3) 
        RETURNING word, id`,
        [ gameId, word, 'pile' ]
    );
};