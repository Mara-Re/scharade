import React, { FunctionComponent, useContext } from "react";
import { StatusContext } from "../contexts/StatusContext";
import Snackbar from "@material-ui/core/Snackbar";


export const ErrorHandling: FunctionComponent<{}> = ({children}) => {

    const {error} = useContext(StatusContext);
    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            open={error}
            autoHideDuration={2000}
            message="Something went wrong..."
        />
    )
}

export default ErrorHandling;