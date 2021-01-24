import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    centerBox: {
        margin: "auto",
        textAlign: "center",
    },
});

const CenterBox: FunctionComponent<{ className?: string }> = ({
    children,
    className,
}) => {
    const classes = useStyles();

    return (
        <div className={`${classes.centerBox} ${className}`}>{children}</div>
    );
};

export default CenterBox;
