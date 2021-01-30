import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useState,
} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { StatusContext } from "../contexts/StatusContext";
import { socket, Team } from "../pages/Game";
import TeamToggleButton from "./TeamToggleButton";
import TextField from "@material-ui/core/TextField";
import { Box, Typography } from "@material-ui/core";
import CenterBox from "./CenterBox";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles({
    spacingBottom: {
        marginBottom: "20px",
    },
});

const PlayerJoinGameDialog: FunctionComponent<{}> = (props) => {
    const {
        gameUid,
        reloadPlayerMe = () => {},
        reloadPlayersList = () => {},
        onError = () => {},
    } = useContext(StatusContext);

    const classes = useStyles();

    const [name, setName] = useState("");
    const [team, setTeam] = useState<Team>();

    const onJoinGame = useCallback(async () => {
        if (!name || !team) return;
        try {
            await axios.post(`/games/${gameUid}/player`, {
                player: {
                    gameUid,
                    team,
                    name,
                },
            });
            socket.emit("new-player-joins");
            reloadPlayerMe();
            reloadPlayersList();
        } catch (error) {
            onError(error);
        }
    }, [name, team, gameUid, onError, reloadPlayerMe]);

    const onEnter = async (event: any) => {
        if (event.key === "Enter") {
            await onJoinGame();
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogContentText>
                    <CenterBox>
                        <Box className={classes.spacingBottom}>
                            <Typography variant="h6" gutterBottom>
                                Choose a team
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Split the group into two teams.
                            </Typography>

                            <TeamToggleButton
                                team={team}
                                onTeamChoice={(
                                    _: any,
                                    newTeamChoice: Team | undefined
                                ) => {
                                    setTeam(newTeamChoice);
                                }}
                            />
                        </Box>
                        <Box >
                            <TextField
                                variant="outlined"
                                onChange={(event: any) =>
                                    setName(event.target.value)
                                }
                                label="Your name"
                                value={name}
                                onKeyDown={onEnter}
                            />
                        </Box>
                    </CenterBox>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onJoinGame()}
                    color="primary"
                    variant="contained"
                    disabled={!team || !name}
                >
                    Join Game
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PlayerJoinGameDialog;
