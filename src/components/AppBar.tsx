import React, { FunctionComponent, useCallback, useContext } from "react";
import AppBarMui from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Timer from "./Timer";
import StartGame from "./StartGame";
import { GameStatus, StatusContext } from "../contexts/StatusContext";
import axios from "axios";
import { socket } from "../pages/App";

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

const AppBar: FunctionComponent<{}> = () => {
    const { gameStatus, countdown } = useContext(StatusContext);
    const classes = useStyles();

    const showTimer =
        (!!countdown &&
            (gameStatus === GameStatus.PLAYER_EXPLAINING ||
                gameStatus === GameStatus.END_OF_ROUND_REACHED)) ||
        gameStatus === GameStatus.TIME_OVER;

    return (
        <AppBarMui position="fixed">
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" noWrap>
                    Zettelchen
                </Typography>
                { showTimer &&
                <Timer>{countdown}</Timer>}
                {gameStatus === GameStatus.SETUP &&
                <StartGame >StartGame</StartGame>
                }
            </Toolbar>
        </AppBarMui>
    );
}

export default AppBar;