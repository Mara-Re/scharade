const db = require('../database/db');

const addTurnScoreToTeamScore = async (gameUid) => {
    try {
        const {rows} = await db.getWordsList(gameUid);
        const {rows: rowsTeamExplaining} = await db.getTeamExplaining(gameUid);
        const teamExplaining = rowsTeamExplaining[0].team_explaining;

        const nrOrWordsGuessedThisTurn = rows.filter(word => word.status === "guessedThisTurn").length;
        const nrOrWordsDiscardedThisTurn = rows.filter(word => word.status === "discardedThisTurn").length;
        const score = nrOrWordsGuessedThisTurn - nrOrWordsDiscardedThisTurn;

        await db.addToTeamscore(gameUid, teamExplaining, score);
    } catch(error) {
        console.log('error in addTurnScoreToTeamScore: ', error);
    }
};

module.exports = addTurnScoreToTeamScore;