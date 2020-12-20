import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TimerIcon from '@material-ui/icons/Timer';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    timeOver: {
        maxWidth: "50px"
    }
});

const Timer: FunctionComponent<{}> = (props) => {
    const {
        children,
    } = props;

    const classes = useStyles();

    return (
        <Box display="flex" alignSelf="center">
            {children && <Typography variant="h4">
                {children}
            </Typography>}
            {!children &&
            <>
            <Typography variant="h6" className={classes.timeOver}>
                Time over!
            </Typography>
            </>}
            <Box alignSelf="center">
                <TimerIcon fontSize="large"/>
            </Box>
        </Box>

    );
}

export default Timer;