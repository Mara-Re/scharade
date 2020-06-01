import React from 'react';
import Box from "@material-ui/core/Box";
import BorderedIconButton from "./IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles({
    guessed: {
        color: '#4caf50',
        marginBottom: 10
    },
    discard: {
        color: '#f44336'
    },
    buttonBox: {
        marginLeft: 30
    }
});


const WordCard = (props) => {
    const {
        children,
        onWordGuessed,
        onWordDiscarded
    } = props;

    const classes = useStyles();
    return (
        <Box display='flex' justifyContent='center' alignSelf="center">
            <Box display="flex" justifyContent='space-between'>
                <Box alignSelf="center">
                    <Typography variant="h4">
                        {children}
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignSelf="center" className={classes.buttonBox}>
                    <BorderedIconButton onClick={onWordGuessed} className={classes.guessed}>
                        <CheckIcon fontSize="large"/>
                    </BorderedIconButton>
                    <BorderedIconButton onClick={onWordDiscarded} className={classes.discard}>
                        <ClearIcon fontSize="large"/>
                    </BorderedIconButton>
                </Box>
            </Box>
        </Box>

    );
}

export default WordCard;