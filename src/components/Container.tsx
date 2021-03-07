import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    container: {
        marginTop: "100px",
        marginBottom: "60px",
        width: "100%",
        maxWidth: "600px",
        margin: "auto"
    },
}));

const Container: FunctionComponent<{}> = ({ children }) => {
    const classes = useStyles();
    return <div className={classes.container}>{children}</div>;
};

export default Container;
