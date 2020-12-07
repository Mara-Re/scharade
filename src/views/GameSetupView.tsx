import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import ChooseTeam from "../components/ChooseTeam";
import EnterWords from "../components/EnterWords";
import CentralBox from "../components/CentralBox";
import GameLinkDialog from "../components/GameLinkDialog";
import axios from "axios";
import { StatusContext } from "../contexts/StatusContext";

const GameSetupView: FunctionComponent<{}> = () => {
    const {onError = () => {}} = useContext(StatusContext);
    const [showGameLinkDialog, setShowGameLinkDialog] = useState(false);


    useEffect(() => {
        const getShowGameLinkDialogInfo = async () => {
            try {
                const { data } = await axios.get("/game-link-dialog-cookie");
                setShowGameLinkDialog(data.showGameLinkDialog);
            } catch (error) {
                onError(error);
            }
        }
        getShowGameLinkDialogInfo();
    }, [onError]);

    return (
        <CentralBox>
            <GameLinkDialog
                open={showGameLinkDialog}
                setShowGameLinkDialog={setShowGameLinkDialog}
            />
            <ChooseTeam />
            <EnterWords />
        </CentralBox>
    )
}

export default GameSetupView;