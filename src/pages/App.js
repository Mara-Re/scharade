import React, {useState, useEffect} from 'react';
import Box from "@material-ui/core/Box";
import AppBar from "../components/AppBar";
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import WordCard from "../components/WordCard";
import WordsList from "../components/WordsList";
import ActionMessage from "../components/ActionMessage";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import StartNewGame from "../components/StartNewGame";
import EnterWords from "../components/EnterWords";
import GameLinkDialog from "../components/GameLinkDialog";

import * as io from 'socket.io-client';
import { getGameUid } from "../helper/getGameUid";
export const socket = io.connect();

const timeToExplain = 11;

// DONE
// the state of discarded/guessed Words in WordsList can be changed

// TODO s teams and score tracking
// players can join a team in the setup phase of the game
// players can change team during the game
// teams explain in alternating order
// players see which team is explaining
// scores are tracked per team
// players can click on 'finish game'/'show (final) score' to see their team's score


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
        minHeight: "40vh",
        paddingBottom: '30px'
    },

    pageContainer: {
        position: "relative",
        minHeight: "100vh"
    },
    wordsListBox: {
        paddingBottom: "50px"
    },
    contentContainer: {
        padding: "0 20px"
    }
}));

const App = () => {
    const classes = useStyles();
    const [wordToExplain, setWordToExplain] = useState({});
    const [wordsList, setWordsList] = useState([]);           //  {id: number | string, word: string, status: "guessed" | "discarded" | "notGuessed", game_uid: string }
    const [countdown, setCountdown] = useState();
    const [playerExplaining, setPlayerExplaining] = useState(); // undefined, "self", "other"
    const [gameStatus, setGameStatus] = useState(""); // "start", "playerExplaining", "timeOver", "endOfRoundReached"
    const [score, setScore] = useState();
    const [showGameLinkDialog, setShowGameLinkDialog] = useState();
    const [error, setError] = useState();
    const gameUid = getGameUid();


    useEffect(() => {
        getGameStatus();
    }, []);

    const getGameStatus = async () => {
        try {
            const {data} = await axios.get(`/games/${gameUid}/status`);
            setShowGameLinkDialog(data.showGameLinkDialog);
            setGameStatus(data[0].status);
        } catch (error) {
            onError(error);
        }
    }

    const onError = (e) => {
        setError(true);
        setTimeout(() => {setError(undefined)}, 2000);
    }

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
        socket.on("new-round-started", () => {
            setGameStatus("playerExplaining");
            if (playerExplaining === "self") {
                getRandomWord();
            }
        });
    }, [playerExplaining]);

    //^^^^^^^^SOCKET EVENT LISTENERS^^^^^^^^^^--------

    useEffect(() => {
        if (countdown === undefined && gameStatus && gameStatus !== "start" && gameStatus !== "setup" && gameStatus !== "timeOver") {
            onTimerOver();
        }
    }, [countdown, gameStatus]);

    useEffect(() => {
        if (playerExplaining === "self" && !wordToExplain) {
            onEndOfRoundReached();
        }
    }, [wordToExplain, playerExplaining]);


    const onEndOfRoundReached = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {status: "endOfRoundReached"});
            socket.emit("end-of-round");
            setGameStatus("endOfRoundReached");
        } catch (error) {
            onError(error);
        }

    }

    const onTimerOver = async () => {
        setGameStatus("timeOver");
        if (playerExplaining === "self" && wordToExplain) {
            setWordsList([...wordsList, {...wordToExplain, status: "notGuessed"}]);
        }
    }

    useEffect(() => {
        if (!wordsList) return;
        const score = (wordsList|| []).reduce((scoreAccumulator, word) => {
            const points = (word.status === "guessed" && 1) || (word.status === "discarded" && -1) || 0;
            return scoreAccumulator + points;
        }, 0);
        setScore(score);
    }, [wordsList]);

    const onOtherPlayerStartsExplaining = () => {
        setPlayerExplaining("other");
        updateStatus("playerExplaining");
        setScore(undefined);
    };

    const onStartExplaining = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {status: 'playerExplaining'});
            await axios.post(`/games/${gameUid}/resetWordsStatus`, {
                status: "pile",
                previousStatus: "discarded"
            });
            await getRandomWord();
            setCountdown(timeToExplain);
            setPlayerExplaining("self");
            setWordsList([]);
            setGameStatus("playerExplaining");
            socket.emit("start-explaining");
        } catch(e) {
            onError(error);
        }
    }

    const onStartNewRound = async () => {
        try {
            await axios.post(`/games/${gameUid}/resetWordsStatus`, {
                status: "pile"
            });
            await axios.post(`/games/${gameUid}/status`, {status: "playerExplaining"});
            setGameStatus("playerExplaining");
            socket.emit("start-new-round", {countdown});
            if (playerExplaining === "self") {
                getRandomWord();
            }
        } catch (error) {
            onError(error);
        }

    }
    const onStartGame = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {status: "start"});
            socket.emit("start-game");
            updateStatus("start");
        } catch (error) {
            onError(error);
        }
    }

    const onStartNewGame = async () => {
        try {
            await axios.post(`/games/${gameUid}/status`, {status: "setup"});
            await axios.delete(`/games/${gameUid}/words`);
            socket.emit("start-new-game");
            updateStatus("setup");
        } catch (error) {
            onError(error);
        }
    }

    const updateStatus = (status) => {
        setGameStatus(status);
        setWordsList([]);
        setWordToExplain({});
    }

    const getRandomWord = async () => {
        try {
            const {data} = await axios.get(`/games/${gameUid}/getRandomWord`);
            const randomWord = data[0];
            setWordToExplain(randomWord);
        } catch (error) {
            onError(error);
        }
    }

    const onWordGuessed = async () => {
        try {
            await axios.post(`/games/${gameUid}/words/${wordToExplain.id}/status`, {status: "guessed"});
            setWordsList([...wordsList, {...wordToExplain, status: "guessed"}]);
            await getRandomWord();
        } catch (error) {
            onError(error);
        }
    }

    const onWordDiscarded = async () => {
        try {
            await axios.post(`/games/${gameUid}/words/${wordToExplain.id}/status`, {status: "discarded"});
            setWordsList([...wordsList, {...wordToExplain, status: "discarded"}]);
            await getRandomWord();

        } catch (error) {
            onError(error);
        }
    }

    const showTimer = !!countdown && (gameStatus === "playerExplaining" || gameStatus === "endOfRoundReached") || gameStatus === "timeOver";
    const showStartExplaining = gameStatus === "start" || gameStatus === "timeOver" && playerExplaining !== "self";
    const showWordCard = gameStatus === "playerExplaining" && wordToExplain && playerExplaining === "self";
    const showOtherPlayerExplaining = gameStatus === "playerExplaining" && playerExplaining === "other";
    const showWordsList =(gameStatus === "playerExplaining" || gameStatus === "timeOver" || gameStatus === "endOfRoundReached") && !!wordsList.length && playerExplaining === "self";
    const showScore = gameStatus === "timeOver" && playerExplaining === "self" && score !== undefined;
    const showEndOfRoundReached = gameStatus === "endOfRoundReached";

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
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={error}
                autoHideDuration={6000}
                message="Something went wrong..."
            />
            <Box className={classes.contentContainer}>
                <Box display="flex" alignSelf="center" justifyContent="center" className={classes.centerBox} >
                    {gameStatus === "setup" &&
                    <EnterWords
                        onError={onError}
                        onStartGame={onStartGame}
                    />
                    }
                    {showStartExplaining &&
                    <ActionMessage
                        onAction={onStartExplaining}
                        actionIcon={<PlayArrowIcon fontSize="large"/>}
                    >
                       Is it your turn? Start explaining.
                    </ActionMessage>}


                    {showWordCard &&
                    <WordCard
                        onWordGuessed={onWordGuessed}
                        onWordDiscarded={onWordDiscarded}
                    >
                        {wordToExplain.word}
                    </WordCard>}

                    {showEndOfRoundReached &&
                    <ActionMessage
                        onAction={onStartNewRound}
                        actionIcon={<ReplayIcon fontSize="large"/>}
                    >
                        The pile of words is empty. Do you want to start a new round now?
                    </ActionMessage>}
                    {showOtherPlayerExplaining &&
                    <ActionMessage
                    >
                        Somebody else is explaining...
                    </ActionMessage>}

                    {showScore &&
                    <ActionMessage
                    >
                        You scored {score} points in this round!
                    </ActionMessage>}
                </Box>
                <Box className={classes.wordsListBox}>
                    {showWordsList &&
                    <WordsList title="Words" setWordsList={setWordsList}>{wordsList}</WordsList>
                    }
                </Box>
            </Box>
            {gameStatus && gameStatus !== "setup" &&
            <StartNewGame
                onStartNewGame={onStartNewGame}
            />}
        </div>
    );
}

export default App;