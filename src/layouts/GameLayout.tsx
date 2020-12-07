import React, { FunctionComponent, useContext } from "react";
import { GameStatus, StatusContext } from "../contexts/StatusContext";
import AppBar from "../components/AppBar";
import EndGame from "../components/EndGame";
import Footer from "../components/Footer";
import { makeStyles } from "@material-ui/core/styles";
import StartNewGame from "../components/StartNewGame";
import TeamIndicator from "../components/TeamIndicator";

const useStyles = makeStyles(() => ({
    container: {
        marginTop: "130px"
    },
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
}));

export const GameLayout: FunctionComponent<{}> = ({children}) => {

    const {gameStatus, team} = useContext(StatusContext);
    const classes = useStyles();
    return (
        <>
            <AppBar />
            <div className={classes.container}>
                {children}
            </div>
            <Footer>
                {gameStatus && gameStatus !== GameStatus.SETUP && (
                <>
                    {gameStatus !== GameStatus.END && <EndGame />}
                    {gameStatus === GameStatus.END  && <StartNewGame />}
                    {team !== undefined && <TeamIndicator team={team} />}
                </>
                )}

            </Footer>
        </>
    )
}