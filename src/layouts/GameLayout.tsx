import React, { FunctionComponent, useContext } from "react";
import { StatusContext } from "../contexts/StatusContext";
import { GameStatus } from "../pages/Game";
import AppBar from "../components/AppBar";
import EndGame from "../components/EndGame";
import Footer from "../components/Footer";
import StartNewGame from "../components/StartNewGame";
import TeamIndicator from "../components/TeamIndicator";
import Container from "../components/Container";
import Info from "../components/Info";

export const GameLayout: FunctionComponent<{}> = ({ children }) => {
    const { gameStatus, playerMe, loadingGameStatus } = useContext(StatusContext);
    return (
        <>
            <AppBar type="game" />
            <Container>{children}</Container>
            <Footer>
                {
                    <>
                        <Info type="footer"/>
                        {!loadingGameStatus &&
                            gameStatus &&
                            gameStatus !== GameStatus.SETUP && (
                                <>
                                    {gameStatus !== GameStatus.END && (
                                        <EndGame />
                                    )}
                                    {gameStatus === GameStatus.END && (
                                        <StartNewGame />
                                    )}
                                    {playerMe?.teamAorB && (
                                        <TeamIndicator team={playerMe?.teamAorB} />
                                    )}
                                </>
                            )}
                    </>
                }
            </Footer>
        </>
    );
};
