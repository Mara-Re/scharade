import React from "react";
import TeamEmoji from "./TeamEmoji";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
    finalScoresBox: {
        padding: "40px 0",
        margin: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
        position: "relative"
    },
    finalScoreColumn: {
        width: "50%"
    },
    winnerIndicator: {
        position: "absolute",
        width: "50%",
        fontSize: "130px",
        zIndex: "-1",
        marginTop: "42px"
    },
    winnerTeamEmoji: {
        fontSize: "50px",
        marginTop: "-20px"
    },
    score: {
        fontSize: "56px"
    }
});


const FinalTeamScores = (props) => {
    const {finalTeamScores} = props;

    const classes = useStyles();

    let winnerTeams = [];
    if (finalTeamScores[0].score === finalTeamScores[1].score ) {
        winnerTeams = [finalTeamScores[0].team_1_or_2 , finalTeamScores[1].team_1_or_2];
    } else if (finalTeamScores[0].score > finalTeamScores[1].score) {
        winnerTeams = [finalTeamScores[0].team_1_or_2]
    } else {
        winnerTeams = [finalTeamScores[1].team_1_or_2]
    }

    return (
        <Box justifyContent='center' alignItems="center" className={classes.finalScoresBox}>
            {(finalTeamScores || []).map((team, index) => (
                <div key={index} className={classes.finalScoreColumn}>
                    {winnerTeams.includes(team.team_1_or_2) && <div className={classes.winnerIndicator}>
                        <div>🌟</div>
                    </div>}
                    <h1 className={winnerTeams.includes(team.team_1_or_2) && classes.winnerTeamEmoji} ><TeamEmoji teamNumber={team.team_1_or_2}/></h1>
                    <h1 className={classes.score}>{team.score}</h1>
                </div>
            ))}
        </Box>
    );
}

export default FinalTeamScores;