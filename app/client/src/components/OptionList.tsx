import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import { useGetOptionsQuery } from '../apollo/types';
import { currentExpiry, currentInstrument, currentOptionType } from '../apollo/cache';
import { useReactiveVar } from '@apollo/client';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    td: {
        fontSize: "0.8rem",
        padding: "4px 16px 4px 16px"
    },
    strike: {
        fontSize: "0.8rem",
        padding: "4px 16px 4px 16px",
        backgroundColor: "#e6f8d2"
    }

});

export default function OptionTable() {
    const classes = useStyles();

    const instrument = useReactiveVar(currentInstrument);
    const optionType = useReactiveVar(currentOptionType);
    const expires = useReactiveVar(currentExpiry);

    const skip = !instrument;

    const { loading, error, data } = useGetOptionsQuery({ variables: { id: instrument, type: optionType, expires: expires }, skip });

    if (skip)
        return <div></div>

    const rows = data?.options?.options ?? [];

    return <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell>Call</TableCell>
                    <TableCell align="right">B. Vol</TableCell>
                    <TableCell align="right">Buy</TableCell>
                    <TableCell align="right">Sell</TableCell>
                    <TableCell align="right">S. Vol</TableCell>
                    <TableCell align="center">Strike</TableCell>
                    <TableCell align="right">B. Vol</TableCell>
                    <TableCell align="right">Buy</TableCell>
                    <TableCell align="right">Sell</TableCell>
                    <TableCell align="right">S. Vol</TableCell>
                    <TableCell>Put</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row?.call?.name}>
                        <TableCell className={classes.td}>{row?.call?.name}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.call?.buyVolume}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.call?.buy}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.call?.sell}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.call?.sellVolume}</TableCell>
                        <TableCell className={classes.strike} align="center">{row?.strike}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.put?.buyVolume}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.put?.buy}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.put?.sell}</TableCell>
                        <TableCell className={classes.td} align="right">{row?.put?.sellVolume}</TableCell>
                        <TableCell className={classes.td}>{row?.put?.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}