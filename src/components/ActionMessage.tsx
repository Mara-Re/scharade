import React, { FunctionComponent, ReactNode } from "react";
import Box from "@material-ui/core/Box";
import BorderedIconButton from "./IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    actionText: {
        maxWidth: '60vw'
    },
    actionButton: {
        marginLeft: 30
    }
});

interface ActionMessageProps {
    children: ReactNode;
    onAction?: () => void;
    actionIcon?: ReactNode;
}


const ActionMessage: FunctionComponent<ActionMessageProps> = (props) => {
    const {
        children,
        onAction = () => {},
        actionIcon
    } = props;

    const classes = useStyles();
    return (
        <Box display="flex" justifyContent='center' alignItems="center">
            <Typography variant="h6" className={classes.actionText}>
                {children}
            </Typography>
            {actionIcon &&
            <BorderedIconButton onClick={onAction} color='primary' className={classes.actionButton}>
                {actionIcon}
            </BorderedIconButton>}
        </Box >

    );
}

export default ActionMessage;