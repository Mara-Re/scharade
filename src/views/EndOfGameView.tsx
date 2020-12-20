import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import CentralBox from "../components/CentralBox";
import FinalTeamScores from "../components/FinalTeamScores";
import axios from "axios";
import { socket } from "../pages/App";
import { GameStatus, StatusContext, Team } from "../contexts/StatusContext";
import StartNewGameDialog from "../components/StartNewGameDialog";

export interface TeamScore {
    team_a_or_b: Team;
    score: number;
}

const EndOfGameView: FunctionComponent<{}> = () => {
    const { gameUid, gameStatus } = useContext(StatusContext);

    const [finalTeamScores, setFinalTeamScores] = useState<TeamScore[]>();
    const [newGameId, setNewGameId] = useState<string>();

    useEffect(() => {
        socket.on("new-game-started", (data: {gameId: string}) => {
            setNewGameId(data.gameId);
        });
    }, []);

    const getFinalTeamData = useCallback(async () => {
        const { data } = await axios.get(`/games/${gameUid}/teams/`);
        socket.emit("end-game");
        setFinalTeamScores(data);
    }, [gameUid]);

    useEffect(() => {
        if (gameStatus === GameStatus.END) {
            getFinalTeamData();
        }
    }, [gameStatus, getFinalTeamData]);

    return (
        <>
            <StartNewGameDialog
                setNewGameId={setNewGameId}
                newGameId={newGameId}
            />
            <CentralBox>
                {finalTeamScores && (
                    <FinalTeamScores finalTeamScores={finalTeamScores} />
                )}
            </CentralBox>
        </>
    );
};

export default EndOfGameView;