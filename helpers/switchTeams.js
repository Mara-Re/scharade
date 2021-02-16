const db = require('../database/db');

const switchTeams = async (gameUid) => {
    try {
        const {rows} = await db.getGame(gameUid);
        const prevTeamAorB = rows[0].teamExplaining;

        const newTeamExplaining = prevTeamAorB === "A" ? "B" : "A";
        console.log('prevTeamAorB: ', prevTeamAorB);
        console.log('newTeamExplaining: ', newTeamExplaining);

        await db.updateTeamExplaining(gameUid, newTeamExplaining);
    } catch(error) {
        console.log('error in switchTeams: ', error);
    }
};

module.exports = switchTeams;