import React, { FunctionComponent, useContext } from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import TeamEmoji from "./TeamEmoji";
import { StatusContext } from "../contexts/StatusContext";
import { Team } from "../pages/Game";

interface TeamToggleButtonProps {
    team?: Team;
    onTeamChoice?: (_: any, newTeamChoice: Team | undefined) => void;
}

const TeamToggleButton: FunctionComponent<TeamToggleButtonProps> = (props) => {

    const { onTeamChoice, team } = props;

    return (
        <ToggleButtonGroup value={team} exclusive onChange={onTeamChoice}>
            <ToggleButton value="A">
                <Typography variant={team === "A" ? "h3" : "h6"}>
                    <TeamEmoji team="A" />
                </Typography>
            </ToggleButton>
            <ToggleButton value="B">
                <Typography variant={team === "B" ? "h3" : "h6"}>
                    <TeamEmoji team="B" />
                </Typography>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default TeamToggleButton;
