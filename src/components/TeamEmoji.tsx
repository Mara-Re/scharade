import React, { FunctionComponent } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Team } from "../pages/Game";

const useStyles = makeStyles({
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

interface TeamEmojiProps {
    team: Team | null;
}

const TeamEmoji: FunctionComponent<TeamEmojiProps> = ({ team }) => {
    const classes = useStyles();


    if (team == "A") return <span className={classes.noOpacity}>🥦</span>;
    if (team == "B") return <span className={classes.noOpacity}>🌶</span>;
    return null;

}

export default TeamEmoji;