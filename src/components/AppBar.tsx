import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import AppBarMui from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Timer from "./Timer";
import StartGame from "./StartGame";
import { StatusContext } from "../contexts/StatusContext";
import { GameStatus } from "../pages/Game";
import Info from "./Info";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        minHeight: 100,
        alignItems: "flex-start",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        alignSelf: "center",
    }
}));

const AppBar: FunctionComponent<{ type: "home" | "game" }> = ({ type }) => {
    const { gameStatus, countdown, loadingGameStatus, onError, isGameHost } = useContext(
        StatusContext
    );
    const classes = useStyles();

    const showTimer =
        (!!countdown &&
            !loadingGameStatus &&
            (gameStatus === GameStatus.PLAYER_EXPLAINING ||
                gameStatus === GameStatus.END_OF_ROUND_REACHED)) ||
        gameStatus === GameStatus.TIME_OVER;

    return (
        <AppBarMui position="fixed">
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" noWrap>
                    Zettelchen
                </Typography>
                {type === "game" && showTimer && <Timer>{countdown}</Timer>}
                {type === "game" && gameStatus === GameStatus.SETUP && isGameHost && (
                    <StartGame>StartGame</StartGame>
                )}
                {type === "home" && <Info type="header"/>}
            </Toolbar>
        </AppBarMui>
    );
};

export default AppBar;
