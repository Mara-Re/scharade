import React, { FunctionComponent } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    centerBox: {
        minHeight: "30vh",
        padding: "2vh 0 30px",
        position: "relative"
    },
    contentContainer: {
        padding: "20px",
    },
    flex : {
        display: "flex",
        justifyContent: "center"
    }
}));

const CentralBox: FunctionComponent<{flex?: boolean}> = ({children, flex}) => {

    const classes = useStyles();

    return(
        <>
            <Box className={`${classes.contentContainer} ${flex ? classes.flex : ""}`}>
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