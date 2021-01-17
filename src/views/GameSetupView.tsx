import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import ChooseTeam from "../components/ChooseTeam";
import EnterWords from "../components/EnterWords";
import CentralBox from "../components/CentralBox";
import GameLinkDialog from "../components/GameLinkDialog";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";
import { Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    gameHost: {
        fontSize: "0.8rem",
    },
    center: {
        margin: "auto",
        textAlign: "center",
    }
}));

const GameSetupView: FunctionComponent<{}> = () => {
    const {
        onError = () => {},
        reloadGameHost = () => {},
        isGameHost,
    } = useContext(StatusContext);
    const [showGameLinkDialog, setShowGameLinkDialog] = useState(false);

    const classes = useStyles();

    const makeMeGameHost = useCallback(async () => {
        try {
            await axios.post("/set-game-host-cookie");
            reloadGameHost();
        } catch (error) {
            onError(error);
        }
    }, [onError]);

    useEffect(() => {
        const getShowGameLinkDialogInfo = async () => {
            try {
                const { data } = await axios.get("/game-cookies");
                setShowGameLinkDialog(data.showGameLinkDialog);
            } catch (error) {
                onError(error);
            }
        };
        getShowGameLinkDialogInfo();
    }, [onError]);

    return (
        <CentralBox>
            <GameLinkDialog
                open={showGameLinkDialog}
                setShowGameLinkDialog={setShowGameLinkDialog}
            />
            <ChooseTeam />
            <EnterWords />
            <Box justifyContent="center" alignItems="center" className={classes.center}>
                <Typography variant="h6" gutterBottom>Start the game</Typography>
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
                    <Typography variant="body1">
                        When all players have entered their words you can start
                        the game.
                    </Typography>
                )}
            </Box>
        </CentralBox>
    );
};

export default GameSetupView;
