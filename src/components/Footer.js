import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles({
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        // height: "2.8rem",
        padding: "5px 20px",
        backgroundColor: "#eeeeee",
        justifyContent: "space-between"
    }
});

const Footer = ({children}) => {
    const classes = useStyles();


    return (
        <>
            <Box className={classes.footer} display='flex' alignSelf="center">
                {children}
            </Box>
        </>
    );
}

export default Footer;