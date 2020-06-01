import React from 'react';
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles({
    green: {
        color: green
    },
    red: {
        color: red
    },
    wordsListBox: {
        paddingBottom: "20px"
    }
});


const WordsList = (props) => {
    const {
        children,
        title
    } = props;

    const classes = useStyles();
    return (
        <Box display='flex' justifyContent='center' alignSelf="center" className={classes.wordsListBox}>

            <TableContainer >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{title}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {children.map(word => (
                            <TableRow key={word.id}>
                                <TableCell color={green} className="green">
                                    {word.word}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    );
}

export default WordsList;