import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "../components/AppBar";
import AddBoxIcon from '@material-ui/icons/AddBox';
import axios from 'axios';

const useStyles = makeStyles({
    centerBox: {
        minHeight: "40vh",
        padding: '30px 0',
        margin: 'auto',
        textAlign: 'center'
    },
    pageContainer: {
        position: "relative",
        minHeight: "100vh"
    },
    contentContainer: {
        padding: "0 20px"
    },
    iconButton: {
        height: '60px',
        width: '60px'
    },
    icon: {
        height: '60px',
        width: '60px'
    }
});

const Home = () => {
    const classes = useStyles();

    const onSetupNewGame = async() => {
        try {
            const {data} = await axios.post('/setup-new-game');
            location.replace(`/game/${data[0].uid}/`);
        } catch (error) {
            // onError(error);
            console.log("error in onSetupNewGame: ", error);
        }
    }

    return (
        <>
            <AppBar />
            <Box className={classes.contentContainer}>
                <Box alignSelf="center" justifyContent="center" className={classes.centerBox} >
                    <>
                        <Typography variant="h6" className={classes.title}>
                            Start a new Zettelchen game
                        </Typography>
                        <IconButton className={classes.iconButton} onClick={onSetupNewGame}>
                            <AddBoxIcon className={classes.icon}/>
                        </IconButton>
                    </>
                </Box>
            </Box>
        </>
    );
}

export default Home;