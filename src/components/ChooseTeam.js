import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { getTeamEmoji } from "../helper/getTeamEmoji";

const useStyles = makeStyles({
    chooseTeamBox: {
        padding: "40px 0",
        margin: "auto",
        textAlign: "center"
    },
    noOpacity: {
        color: "rgba(0, 0, 0, 1)",
        // increase specificity to override Mui opacity:
        '&:selected': {
            color: "rgba(0, 0, 0, 1)"
        },
        '&:hover': {
            color: "rgba(0, 0, 0, 1)"
        },
        '&:not(:focus)': {
            color: "rgba(0, 0, 0, 1)"
        },
        '&:focus': {
            color: "rgba(0, 0, 0, 1)"
        },

    },
});

const ChooseTeam = (props) => {
    const {team, setTeam} = props;
    // const team = "carrot";
    const classes = useStyles();



    const handleTeamChoice = (event, newTeamChoice) => {
        if (!newTeamChoice) return;
        console.log("handleTeamChoice runs e.target.value:", newTeamChoice);
        setTeam(newTeamChoice);
    }

    return (
        <Box justifyContent='center' alignItems="center" className={classes.chooseTeamBox}>
            <Typography variant="h6" gutterBottom>
                Choose a Team
            </Typography>
            <ToggleButtonGroup
                value={team}
                exclusive
                onChange={handleTeamChoice}
            >
                <ToggleButton value="1" className={classes.noOpacity}>
                    <Typography variant={team === "1" ? "h3" : "h6"}>
                        {getTeamEmoji(1)}
                    </Typography>
                </ToggleButton>
                <ToggleButton value="2" className={classes.noOpacity}>
                    <Typography variant={team === "2" ? "h3" : "h6"}>
                        {getTeamEmoji(2)}
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>

    );
}

export default ChooseTeam;