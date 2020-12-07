import React, { FunctionComponent } from "react";
import CentralBox from "../components/CentralBox";
import ActionMessage from "../components/ActionMessage";

const OtherPlayerExplainingView: FunctionComponent<{}> = () => {
    return (
        <CentralBox>
            <ActionMessage>
                Somebody else is explaining...
            </ActionMessage>
        </CentralBox>
    )
}

export default OtherPlayerExplainingView;