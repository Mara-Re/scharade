import { Team } from "../pages/Game";

const getOppositeTeam = (team?: Team): Team | undefined => {
    if (team === "A") {
        return "B";
    }
    if (team === "B") {
        return "A";
    }
    return undefined;
}


export default getOppositeTeam;