import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    centerBox: {
        margin: "auto",
        textAlign: "center",
    },
    marginBottom: {
        marginBottom: "2rem"
    }
});

const CenterBox: FunctionComponent<{ className?: string, marginBottom?: boolean }> = ({
    children,
    className,
    marginBottom
}) => {
    const classes = useStyles();

    return (
        <div className={`${classes.centerBox} ${classes.marginBottom} ${className}`}>{children}</div>
    );
};

export default CenterBox;
