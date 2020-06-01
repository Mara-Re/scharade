import React from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TimerIcon from '@material-ui/icons/Timer';

const Timer = (props) => {
    const {
        children,
    } = props;

    return (
        <Box display='flex' alignSelf="center">
            <Typography variant="h4">
                {children}
            </Typography>
            <Box alignSelf="center">
                <TimerIcon fontSize="large"/>
            </Box>
        </Box>

    );
}

export default Timer;