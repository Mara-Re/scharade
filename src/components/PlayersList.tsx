import React, { FunctionComponent, useContext } from "react";
import { StatusContext } from "../contexts/StatusContext";
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
} from "@material-ui/core";
import TeamEmoji from "./TeamEmoji";
import { makeStyles } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles({
    spacing: {
        margin: "0 0 50px",
    },
    columnWidth: {
        width: "33.3%",
    },
    green: {
        color: "green"
    }
});

const PlayersList: FunctionComponent<{}> = (props) => {
    const { playersList } = useContext(StatusContext);

    const classes = useStyles();

    if (!playersList) return null;

    return (
        <TableContainer className={classes.spacing}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Players</TableCell>
                        <TableCell align="center">Team</TableCell>
                        <TableCell align="center">Words</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {playersList.map((player, index) => (
                        <TableRow key={index}>
                            <TableCell className={classes.columnWidth}>
                                {player.name}
                            </TableCell>
                            <TableCell
                                align="center"
                                className={classes.columnWidth}
                            >
                                <TeamEmoji team={player.teamAorB} />
                            </TableCell>
                            <TableCell
                                align="center"
                                className={classes.columnWidth}
                            >
                                {player.nrOfWords}
                            </TableCell>
                            <TableCell
                                align="right"
                                className={classes.columnWidth}
                            >
                                {player.enterWordsCompleted && <CheckIcon className={classes.green}/>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PlayersList;
