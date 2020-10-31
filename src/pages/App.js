import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@material-ui/core/Box";
import AppBar from "../components/AppBar";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import WordCard from "../components/WordCard";
import WordsList from "../components/WordsList";
import ActionMessage from "../components/ActionMessage";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ReplayIcon from "@material-ui/icons/Replay";
import StartNewGame from "../components/StartNewGame";
import EndGame from "../components/EndGame";
import Footer from "../components/Footer";
import ChooseTeam from "../components/ChooseTeam";
import TeamIndicator from "../components/TeamIndicator";
import EnterWords from "../components/EnterWords";
import GameLinkDialog from "../components/GameLinkDialog";
import FinalTeamScores from "../components/FinalTeamScores";

import * as io from "socket.io-client";
import { getGameUid } from "../helper/getGameUid";
export const socket = io.connect();

const timeToExplain = 60;

///// Allow socket reconnects on mobile devices without page reload////
let isConnected = false;
let socketTimeoutId;
const RETRY_INTERVAL = 2000;

socket.on('connected', function() {
    isConnected = true;
    clearTimeout(socketTimeoutId);
});

socket.on('disconnected', function() {
    isConnected = false;
    retryConnectOnFailure(RETRY_INTERVAL);
});

const retryConnectOnFailure = (retryInMilliseconds) => {
    setTimeout(function() {
        if (!isConnected) {
            $.get('/ping', () => {
                isConnected = true;
                window.location.href = unescape(window.location.pathname);
            });
            retryConnectOnFailure(retryInMilliseconds);
        }
    }, retryInMilliseconds);
}
retryConnectOnFailure(RETRY_INTERVAL);
//////////////////////////////////////////////////

// DONE
// the state of discarded/guessed Words in WordsList can be changed
// players can join a team in the setup phase of the game
// scores are tracked per team
// players can change team during the game
// players can click on 'end game' to see their team's final score

// TODO s rounds
// 5 rounds: - 1. explaining, 2. pantomime, 3. one-word explanation, 4. finger pantomime, 5. make a sound
// add round column to games table and add get and post request to set the round
// game ends when player clicks on end game, show final scores or after 5 rounds

// TODO s onboarding
// Explain game
// Explain enter words
// Explain explanation rounds
// Explain necessary setup steps: enter 5 words, form 2 teams, note scores for each player,
// Explain the different rounds - 1. explaining, 2. pantomime, 3. one-word explanation, 4. finger pantomime, 5. make a sound

// TODO s teams alternating order
// teams explain in alternating order
// players see which team is explaining

// TODO s players
// enable players to enter their names
// show which players are currently in the game
// show which player is currently explaining
// show live with socket, which players are in the game and which have left

// TODO handle exceptions / fix bugs / error handling
// handle case if reloading game and status is end of round reached
// make sure that only one person can be explaining at a time
// add error handling to <Home />
// remove hardcoded timeToExplain from App.js -> retrieve via get request instead
// fix team score calculation if team is changed while (gameStatus === "playerExplaining" || gameStatus === "timerOver" || gameStatus === "endOfRoundReached") && playerExplaining="self" or while
// fix bug in WordsList -> changeWordStatus: handle case if the same word is in list more than once because new round was started. (Fix in db update AND calc of newWordsList)

// TODO ideas
// ? add two restart choices: restart game with same words, restart game with new words

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    centerBox: {
        minHeight: "30vh",
        padding: "8vh 0 30px",
        position: "relative"
    },

    pageContainer: {
        position: "relative",
        minHeight: "100vh",
    },
    wordsListBox: {
        paddingBottom: "50px",
    },
    contentContainer: {
        padding: "20px",
    },
}));

const App = () => {
    const classes = useStyles();
    const [wordToExplain, setWordToExplain] = useState({});
    const [wordsList, setWordsList] = useState([]); //  {id: number | string, word: string, status: "guessed" | "discarded" | "notGuessed", game_uid: string }
    const [countdown, setCountdown] = useState();
    const [playerExplaining, setPlayerExplaining] = useState(); // undefined, "self", "other"
    const [gameStatus, setGameStatus] = useState(""); // "start", "playerExplaining", "timeOver", "endOfRoundReached", "end"
    const [playersScore, setPlayersScore] = useState();
        const [finalTeamScores, setFinalTeamScores] = useState(); // [{team1Or2: 1, score: 15}, {team1Or2: 2, score: 23}]
    const [showGameLinkDialog, setShowGameLinkDialog] = useState();
    const [error, setError] = useState();

    const [team, setTeam] = useState();  // undefined (waiting for async call) | null (no cookie set)| 1 | 2
    const gameUid = getGameUid();

    useEffect(() => {
        if (!team) {
            return;
        }
        setTeamCookie();
    }, [team]);

    useEffect(() => {
        getTeam();
    }, []);


    const getTeam = useCallback(async () => {
        try {
            const { data } = await axios.get(`/team-cookie`);
            setTeam(data.team);
        } catch (error) {
            onError(error);
        }
    }, []);

    const setTeamCookie = useCallback(async () => {
        try {
            const { data } = await axios.post(`/set-team-cookie`, {team});
        } catch (error) {
            onError(error);
        }
    }, [team]);

    useEffect(() => {
        getGameStatus();
    }, []);

    const getGameStatus = async () => {
        try {
            const { data } = await axios.get(`/games/${gameUid}/status`);
            setShowGameLinkDialog(data.showGameLinkDialog);
            setGameStatus(data[0].status);
        } catch (error) {
            onError(error);
        }
    };

    const onError = (e) => {
        setError(true);
        setTimeout(() => {
            setError(undefined);
        }, 2000);
    };

    //---------SOCKET EVENT LISTENERS-----------------------
    useEffect(() => {
        socket.on("game-started", () => {
            updateStatus("start");
        });
    }, []);
    useEffect(() => {
        socket.on("new-game-started", () => {
            updateStatus("setup");
        });
    }, []);

    useEffect(() => {
        socket.on("game-ended", () => {
            updateStatus("end");
        });
    }, []);

    useEffect(() => {
        socket.on("other-player-starts-explaining", () => {
            onOtherPlayerStartsExplaining();
        });
    }, []);

    useEffect(() => {
        socket.on("end-of-round-reached", () => {
            setGameStatus("endOfRoundReached");
        });
    }, []);

    useEffect(() => {
        socket.on("timer", (data) => {
            setCountdown(data.countdown);
        });
    }, []);

    useEffect(() => {
        socket.on("timeOver", () => {
            onTimerOver();
        });
    }, []);

    useEffect(() => {
        socket.on("new-round-started", () => {
            setGameStatus("playerExplaining");
            if (playerExplaining === "self") {
                getRandomWord();
            }
        });
    }, [playerExplaining]);

    //^^^^^^^^SOCKET EVENT LISTENERS^^^^^^^^^^--------

    useEffect(() => {
        if (playerExplaining === "self" && !wordToExplain) {
            onEndOfRoundReached();
        }
    }, [wordToExplain, playerExplaining]);

    const getFinalTeamData = useCallback(async () => {
        const { data } = await axios.get(`/games/${gameUid}/teams/`);
        socket.emit("end-game");
        setFinalTeamScores(data);
    }, []);

    useEffect(() => {
        if (gameStatus === "end") {
            getFinalTeamData();
        }
    }, [gameStatus]);

    const onEndOfRoundReached = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {
                status: "endOfRoundReached",
            });
            socket.emit("end-of-round");
            setGameStatus("endOfRoundReached");
        } catch (error) {
            onError(error);
        }
    };

    const onTimerOver = useCallback(() => {
        setGameStatus((gameStatus) => {
            // ignore onTimerOver when game is currently not ongoing:
            if (gameStatus === "end" || gameStatus === "start" ) {
                return gameStatus;
            }
            return "timeOver";
        });
    }, [playerExplaining, wordToExplain, gameStatus]);

    useEffect(() => {
        if (
            gameStatus === "timeOver" &&
            playerExplaining === "self" &&
            wordToExplain
        ) {
            setWordsList([
                ...wordsList,
                { ...wordToExplain, status: "notGuessed" },
            ]);
        }
    }, [gameStatus, playerExplaining, wordToExplain]);

    const addScore = useCallback(async (newPlayersScore) => {
        if ((!newPlayersScore && newPlayersScore!== 0) && playersScore) {
            setPlayersScore(newPlayersScore);
        } else if (isNaN(playersScore)) {
            await axios.post(`/games/${gameUid}/teams/addToScore`, {
                addPoints: newPlayersScore
            });
            setPlayersScore(newPlayersScore);
        } else {
            await axios.post(`/games/${gameUid}/teams/addToScore`, {
                addPoints: newPlayersScore - playersScore,
            });
            setPlayersScore(newPlayersScore);
        }

    }, [playersScore]);

    useEffect(() => {
        if (!wordsList || !wordsList.length) return;
        const newPlayersScore = (wordsList || []).reduce((scoreAccumulator, word) => {
            const points =
                (word.status === "guessed" && 1) ||
                (word.status === "discarded" && -1) ||
                0;
            return scoreAccumulator + points;
        }, 0);
        addScore(newPlayersScore);
    }, [wordsList]);

    const onOtherPlayerStartsExplaining = () => {
        setPlayerExplaining("other");
        updateStatus("playerExplaining");
        setPlayersScore(undefined);
    };

    const onStartExplaining = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {
                status: "playerExplaining",
            });
            await axios.post(`/games/${gameUid}/resetWordsStatus`, {
                status: "pile",
                previousStatus: "discarded",
            });
            await getRandomWord();
            setCountdown(timeToExplain);
            setPlayerExplaining("self");
            setWordsList([]);
            setGameStatus("playerExplaining");
            socket.emit("start-explaining");
        } catch (e) {
            onError(error);
        }
    };

    const onStartNewRound = async () => {
        try {
            await axios.post(`/games/${gameUid}/resetWordsStatus`, {
                status: "pile",
            });
            await axios.post(`/games/${gameUid}/status`, {
                status: "playerExplaining",
            });
            setGameStatus("playerExplaining");
            socket.emit("start-new-round", { countdown });
            if (playerExplaining === "self") {
                getRandomWord();
            }
        } catch (error) {
            onError(error);
        }
    };
    const onStartGame = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, { status: "start" });
            await axios.post(`/games/${gameUid}/createTeams`);

            socket.emit("start-game");
            updateStatus("start");
        } catch (error) {
            onError(error);
        }
    };

    const onStartNewGame = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, { status: "setup" });
            await axios.delete(`/games/${gameUid}/words`);
            await axios.delete(`/games/${gameUid}/teams/`);
            socket.emit("start-new-game");
            updateStatus("setup");
        } catch (error) {
            onError(error);
        }
    };

    const updateStatus = (status) => {
        setGameStatus(status);
        setWordsList([]);
        setWordToExplain({});
    };

    const onEndGame = useCallback(async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, { status: "end" });
            socket.emit("end-game");
            updateStatus("end");
        } catch (error) {
            onError(error);
        }
    }, [updateStatus]);

    const getRandomWord = async () => {
        try {
            const { data } = await axios.get(`/games/${gameUid}/getRandomWord`);
            const randomWord = data[0];
            setWordToExplain(randomWord);
        } catch (error) {
            onError(error);
        }
    };

    const onWordGuessed = async () => {
        try {
            await axios.post(
                `/games/${gameUid}/words/${wordToExplain.id}/status`,
                { status: "guessed" }
            );
            setWordsList([
                ...wordsList,
                { ...wordToExplain, status: "guessed" },
            ]);
            await getRandomWord();
        } catch (error) {
            onError(error);
        }
    };

    const onWordDiscarded = async () => {
        try {
            await axios.post(
                `/games/${gameUid}/words/${wordToExplain.id}/status`,
                { status: "discarded" }
            );
            setWordsList([
                ...wordsList,
                { ...wordToExplain, status: "discarded" },
            ]);
            await getRandomWord();
        } catch (error) {
            onError(error);
        }
    };

    const showTimer =
        (!!countdown &&
            (gameStatus === "playerExplaining" ||
                gameStatus === "endOfRoundReached")) ||
        gameStatus === "timeOver";
    const showStartExplaining =
        gameStatus === "start" ||
        (gameStatus === "timeOver" && playerExplaining !== "self");
    const showWordCard =
        gameStatus === "playerExplaining" &&
        wordToExplain &&
        playerExplaining === "self";
    const showOtherPlayerExplaining =
        gameStatus === "playerExplaining" && playerExplaining === "other";
    const showWordsList =
        (gameStatus === "playerExplaining" ||
            gameStatus === "timeOver" ||
            gameStatus === "endOfRoundReached") &&
        !!wordsList.length &&
        playerExplaining === "self";
    const showScore =
        gameStatus === "timeOver" &&
        playerExplaining === "self" &&
        playersScore !== undefined;
    const showEndOfRoundReached = gameStatus === "endOfRoundReached";

    const showFinalTeamScores =  gameStatus === "end" && finalTeamScores;

    return (
        <div className={classes.pageContainer}>
            <AppBar
                showTimer={showTimer}
                gameStatus={gameStatus}
                countdown={countdown}
                onStartGame={onStartGame}
            />
            <GameLinkDialog
                open={showGameLinkDialog}
                setShowGameLinkDialog={setShowGameLinkDialog}
            />
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                open={error}
                autoHideDuration={6000}
                message="Something went wrong..."
            />
            <Box className={classes.contentContainer}>
                <Box
                    // display="flex"
                    alignSelf="center"
                    justifyContent="center"
                    className={classes.centerBox}
                >
                    {gameStatus === "setup" && (
                        <>
                            <ChooseTeam setTeam={setTeam} team={team}/>
                            <EnterWords
                                onError={onError}
                                onStartGame={onStartGame}
                            />
                        </>
                    )}
                    {showStartExplaining && (
                        <ActionMessage
                            onAction={onStartExplaining}
                            actionIcon={<PlayArrowIcon fontSize="large" />}
                        >
                            Is it your turn? Start explaining.
                        </ActionMessage>
                    )}

                    {showWordCard && (
                        <WordCard
                            onWordGuessed={onWordGuessed}
                            onWordDiscarded={onWordDiscarded}
                        >
                            {wordToExplain.word}
                        </WordCard>
                    )}

                    {showEndOfRoundReached && (
                        <ActionMessage
                            onAction={onStartNewRound}
                            actionIcon={<ReplayIcon fontSize="large" />}
                        >
                            The pile of words is empty. Do you want to start a
                            new round now?
                        </ActionMessage>
                    )}
                    {showOtherPlayerExplaining && (
                        <ActionMessage>
                            Somebody else is explaining...
                        </ActionMessage>
                    )}

                    {showScore && (
                        <ActionMessage>
                            You scored {playersScore} points in this round!
                        </ActionMessage>
                    )}

                    {showFinalTeamScores && (
                        <FinalTeamScores finalTeamScores={finalTeamScores}/>
                    )}
                </Box>
                <Box className={classes.wordsListBox}>
                    {showWordsList && (
                        <WordsList title="Words" setWordsList={setWordsList}>
                            {wordsList}
                        </WordsList>
                    )}
                </Box>
            </Box>
            <Footer>
                {gameStatus && gameStatus !== "setup" && (
                    <>
                        {gameStatus !== "end" && <EndGame onEndGame={onEndGame} />}
                        {gameStatus === "end" && <StartNewGame onStartNewGame={onStartNewGame} />}
                        <TeamIndicator team={team} setTeam={setTeam}/>
                    </>
                )}

            </Footer>
        </div>
    );
};

export default App;
