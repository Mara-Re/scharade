import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import AppBarMui from "@material-ui/core/AppBar";
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Timer from "./Timer";
import StartGame from "./StartGame";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        minHeight: 100,
        alignItems: 'flex-start',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        alignSelf: 'center',
    },
}));

const AppBar = (props) => {
    const {showTimer, countdown, gameStatus, onStartGame} = props;
    const classes = useStyles();

    return (
        <>
            <AppBarMui position="static">
                <Toolbar className={classes.toolbar}>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Zettelchen
                    </Typography>
                    { showTimer &&
                    <Timer>{countdown}</Timer>}
                    {gameStatus === "setup" && onStartGame &&
                    <StartGame onStartGame={onStartGame}>StartGame</StartGame>
                    }
                </Toolbar>
            </AppBarMui>
        </>
    );
}

export default AppBar;