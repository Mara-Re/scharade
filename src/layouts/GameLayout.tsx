import React, { FunctionComponent, useContext } from "react";
import { GameStatus, StatusContext } from "../contexts/StatusContext";
import AppBar from "../components/AppBar";
import EndGame from "../components/EndGame";
import Footer from "../components/Footer";
import StartNewGame from "../components/StartNewGame";
import TeamIndicator from "../components/TeamIndicator";
import Container from "../components/Container";

export const GameLayout: FunctionComponent<{}> = ({ children }) => {
    const { gameStatus, team } = useContext(StatusContext);
    return (
        <>
            <AppBar />
            <Container>{children}</Container>
            <Footer>
                {gameStatus && gameStatus !== GameStatus.SETUP && (
                    <>
                        {gameStatus !== GameStatus.END && <EndGame />}
                        {gameStatus === GameStatus.END && <StartNewGame />}
                        {team !== undefined && <TeamIndicator team={team} />}
                    </>
                )}
            </Footer>
        </>
    );
};
