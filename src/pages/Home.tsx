import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "../components/AppBar";
import AddBoxIcon from "@material-ui/icons/AddBox";
import axios from "axios";
import CentralBox from "../components/CentralBox";
import Container from "../components/Container";

const useStyles = makeStyles({
    centerBox: {
        margin: "auto",
        textAlign: "center",
    },
    iconButton: {
        height: "100px",
        width: "100px",
    },
    icon: {
        height: "60px",
        width: "60px",
    },
});

const Home: FunctionComponent<{}> = () => {
    const classes = useStyles();

    const onSetupNewGame = async () => {
        try {
            const { data } = await axios.post("/games");
            location.replace(`/game/${data[0].uid}/`);
        } catch (error) {
            // TODO: add error handling
            // onError(error);
        }
    };

    return (
        <>
            <AppBar />
            <Container>
                <CentralBox>
                    <Box className={classes.centerBox}>
                        <Typography variant="h6">
                            Start a new Zettelchen game
                        </Typography>
                        <IconButton
                            className={classes.iconButton}
                            onClick={onSetupNewGame}
                        >
                            <AddBoxIcon className={classes.icon} />
                        </IconButton>
                    </Box>
                </CentralBox>
            </Container>
        </>
    );
};

export default Home;
