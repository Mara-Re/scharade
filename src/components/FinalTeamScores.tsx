import React, { FunctionComponent } from "react";
import TeamEmoji from "./TeamEmoji";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Team } from "../pages/Game";
import { TeamScore } from "../views/EndOfGameView";

const useStyles = makeStyles({
    finalScoresBox: {
        padding: "40px 0",
        margin: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
        position: "relative",
    },
    finalScoreColumn: {
        width: "50%",
    },
    winnerIndicator: {
        position: "absolute",
        width: "50%",
        fontSize: "130px",
        // @ts-ignore
        zIndex: "-1",
        marginTop: "42px",
    },
    winnerTeamEmoji: {
        fontSize: "50px",
        marginTop: "-20px",
    },
    score: {
        fontSize: "56px",
    },
    test: {
        position: "relative",
        height: "80px",
        width: "50px",
        // margin: "auto"

    },
    testScore: {
        position: "absolute",
        textAlign: "center",
        fontSize: "45px"
    },
    testWinnerIndicator: {
        position: "absolute",
        textAlign: "center",
        fontSize: "80px"
    },
});

interface FinalTeamScoresProps {
    finalTeamScores: TeamScore[];
}

const FinalTeamScores: FunctionComponent<FinalTeamScoresProps> = (props) => {
    const { finalTeamScores } = props;

    const classes = useStyles();

    let winnerTeams: Team[] = [];
    if (finalTeamScores[0].score === finalTeamScores[1].score) {
        winnerTeams = [
            finalTeamScores[0].team_a_or_b,
            finalTeamScores[1].team_a_or_b,
        ];
    } else if (finalTeamScores[0].score > finalTeamScores[1].score) {
        winnerTeams = [finalTeamScores[0].team_a_or_b];
    } else {
        winnerTeams = [finalTeamScores[1].team_a_or_b];
    }

    return (
        <Box
            justifyContent="center"
            alignItems="center"
            className={classes.finalScoresBox}
        >
            {(finalTeamScores || []).map((team, index) => (
                <div key={index} className={classes.finalScoreColumn}>
                    {/*{winnerTeams.includes(team.team_a_or_b) && <div*/}
                    {/*    className={classes.winnerIndicator}*/}
                    {/*>*/}
                    {/*    <div>🌟</div>*/}
                    {/*</div>}*/}
                    <div className={classes.test}>
                        <div className={classes.testWinnerIndicator}> 🌟</div>
                        <div className={classes.testScore}>56</div>
                    </div>
                    {/*<h1*/}
                    {/*    className={winnerTeams.includes(team.team_a_or_b) ? classes.winnerTeamEmoji : undefined}*/}
                    {/*><TeamEmoji team={team.team_a_or_b}/></h1>*/}
                    {/*<h1*/}
                    {/*    className={classes.score}*/}
                    {/*>56</h1>*/}
                </div>
            ))}
        </Box>
    );
};

export default FinalTeamScores;
