import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    centerBox: {
        minHeight: "30vh",
        padding: "8vh 0 30px",
        position: "relative"
    },
    contentContainer: {
        padding: "20px",
    },
}));

const CentralBox: FunctionComponent<{}> = ({children}) => {

    const classes = useStyles();

    return(
        <>
            <Box className={classes.contentContainer}>
                <Box
                    alignSelf="center"
                    justifyContent="center"
                    className={classes.centerBox}
                >
                    {children}
                </Box>
            </Box>
        </>
    )
}

export default CentralBox;