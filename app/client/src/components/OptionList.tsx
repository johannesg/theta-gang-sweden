import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useGetOptionsQuery } from '../apollo/types';
import { currentInstrument } from '../apollo/cache';
import { useReactiveVar } from '@apollo/client';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function OptionTable() {
    const classes = useStyles();

    const instrumentVar = useReactiveVar(currentInstrument);

    const { loading, error, data } = useGetOptionsQuery({ variables: { id: instrumentVar } });

    const rows = data?.options?.options ?? [];

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Call</TableCell>
                        <TableCell>B. Vol</TableCell>
                        <TableCell>Buy</TableCell>
                        <TableCell>Sell</TableCell>
                        <TableCell>S. Vol</TableCell>
                        <TableCell>Strike</TableCell>
                        <TableCell>B. Vol</TableCell>
                        <TableCell>Buy</TableCell>
                        <TableCell>Sell</TableCell>
                        <TableCell>S. Vol</TableCell>
                        <TableCell>Put</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row?.call?.name}>
                            <TableCell>{row?.call?.name}</TableCell>
                            <TableCell>{row?.call?.buyVolume}</TableCell>
                            <TableCell>{row?.call?.buy}</TableCell>
                            <TableCell>{row?.call?.sell}</TableCell>
                            <TableCell>{row?.call?.sellVolume}</TableCell>
                            <TableCell>{row?.strike}</TableCell>
                            <TableCell>{row?.put?.buyVolume}</TableCell>
                            <TableCell>{row?.put?.buy}</TableCell>
                            <TableCell>{row?.put?.sell}</TableCell>
                            <TableCell>{row?.put?.sellVolume}</TableCell>
                            <TableCell>{row?.put?.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}