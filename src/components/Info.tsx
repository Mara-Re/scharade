import React, { FunctionComponent, useMemo, useState } from "react";
import InfoIcon from "@material-ui/icons/Info";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { rounds, rules } from "./Rules";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    header: {
        color: "#fff",
        marginRight: "-12px"
    },
    list: {
        fontSize: "0.9rem",
        marginTop: "10px",
        paddingLeft: "20px"
    }
}));

const Info: FunctionComponent<{type: "header" | "footer"}> = ({type}) => {
    const [showInfo, setShowInfo] = useState(false);
    const classes = useStyles();

    const gameRules = useMemo(() => rules, [rules]);
    const gameRounds = useMemo(() => rounds, [rounds]);

    return (
        <>
            <Box display="flex" alignSelf="center">
                <Box alignSelf="center">
                    <IconButton
                        onClick={() => setShowInfo(true)}
                        className={type === "header" ? classes.header : ""}
                    >
                        <InfoIcon />
                    </IconButton>
                </Box>
            </Box>

            {showInfo && (
                <Dialog
                    open={showInfo}
                    onClose={() => setShowInfo(false)}
                    fullWidth={true}
                >
                    <DialogTitle>
                        Info
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => setShowInfo(false)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="body1" gutterBottom>
                                Zettelchen is played with a minimum of 4 players in 2 teams. Start a private game, send out the game link to all players and <strong>meet in a video call</strong>.
                            </Typography>
                            <Typography variant="h6">
                                Steps & Rules
                            </Typography>
                            <ul className={classes.list}>
                            {gameRules.map((rule) => (
                                <li>{rule}</li>
                                )
                            )}
                            </ul>
                            <Typography variant="h6">
                                The Rounds
                            </Typography>
                            <ol className={classes.list}>
                                {gameRounds.map((round) => (
                                    <li><span>Round: </span>{round}</li>
                                    )
                                )}
                                <li>Feel free to add any extra rounds if you like :-)</li>
                            </ol>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Info;
