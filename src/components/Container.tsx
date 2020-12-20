import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    container: {
        marginTop: "130px",
        marginBottom: "60px"
    },
}));

const Container: FunctionComponent<{}> = ({ children }) => {
    const classes = useStyles();
    return <div className={classes.container}>{children}</div>;
};

export default Container;
