import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    footer: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        padding: "5px 10px",
        backgroundColor: "#eeeeee",
    },
    maxWidth: {
        margin: "auto",
        maxWidth: "600px",
        justifyContent: "space-between",
    },
});

const Footer: FunctionComponent<{}> = ({children}) => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.footer} >
                <Box className={classes.maxWidth} display='flex' alignSelf="center">                {children}
                </Box>
            </div>
        </>
    );
}

export default Footer;