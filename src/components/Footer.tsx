import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: "5px 20px",
        backgroundColor: "#eeeeee",
        justifyContent: "space-between"
    }
});

const Footer: FunctionComponent<{}> = ({children}) => {
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