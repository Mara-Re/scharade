import React, { FunctionComponent } from "react";
import CentralBox from "../components/CentralBox";
import EndOfRoundReached from "../containers/EndOfRoundReached";

const EndOfRoundReachedView: FunctionComponent<{}> = () => {

    return (
        <CentralBox>
            <EndOfRoundReached/>
        </CentralBox>
    )
}

export default EndOfRoundReachedView;