import React from "react";

import { makeStyles } from "@material-ui/core/styles";

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

const TeamEmoji = ({ teamNumber }) => {
    const classes = useStyles();


    if (teamNumber == 1) return <span className={classes.noOpacity}>🥦</span>;
    if (teamNumber == 2) return <span className={classes.noOpacity}>🌶</span>;
    return null;

}

export default TeamEmoji;