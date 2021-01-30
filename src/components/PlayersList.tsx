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

const useStyles = makeStyles({
    spacing: {
        margin: "0 0 30px",
    },
    columnWidth: {
        width: "33.3%",
    },
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
                        <TableCell align="right">Words</TableCell>
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
                                align="right"
                                className={classes.columnWidth}
                            >
                                {player.nrOfWords}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PlayersList;
