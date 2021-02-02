import React, {
    FunctionComponent,
    useCallback,
    useContext,
} from "react";
import EnterWords from "../components/EnterWords";
import CentralBox from "../components/CentralBox";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";
import { Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import PlayersList from "../components/PlayersList";
import StartGame from "../components/StartGame";

const useStyles = makeStyles((theme) => ({
    gameHost: {
        fontSize: "0.8rem",
    },
    center: {
        margin: "auto",
        textAlign: "center",
    },
    spacingBottom: {
        marginBottom: "20px"
    }
}));

const GameSetupView: FunctionComponent<{}> = () => {
    const {
        onError = () => {},
        reloadGameHost = () => {},
        isGameHost,
        loadingGameStatus,
    } = useContext(StatusContext);

    const classes = useStyles();

    const makeMeGameHost = useCallback(async () => {
        try {
            await axios.post("/set-game-host-cookie");
            reloadGameHost();
        } catch (error) {
            onError(error);
        }
    }, [onError]);

    return (
        <CentralBox flex={true}>
            <Box flex={true}>
                <EnterWords />
            </Box>
            <PlayersList />
            <Box
                justifyContent="center"
                alignItems="center"
                className={classes.center}
            >
                <Typography variant="h6" gutterBottom>
                    Start the game
                </Typography>
                {!isGameHost && (
                    <Typography variant="body1">
                        When all players have entered their words the game host
                        can start the game.{" "}
                        <Link
                            onClick={() => makeMeGameHost()}
                            className={classes.gameHost}
                        >
                            Make me game host
                        </Link>
                    </Typography>
                )}
                {isGameHost && (
                    <Typography variant="body1" gutterBottom className={classes.spacingBottom}>
                        When all players have entered their words you can start
                        the game.
                    </Typography>
                )}

                {isGameHost && !loadingGameStatus && <StartGame />}
            </Box>
        </CentralBox>
    );
};

export default GameSetupView;
