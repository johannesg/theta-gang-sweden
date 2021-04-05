import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useCompositeOptionsQuery } from '../apollo/hooks';
import { activeOption, ShoppingAction, addToShoppingCart } from '../apollo/vars';
import { useReactiveVar } from '@apollo/client';
import clsx from 'clsx';
import { green, red, yellow } from '@material-ui/core/colors';
import { OptionInfo } from '../apollo/types';
import { Button, ButtonGroup } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        minWidth: 650,

        '& th,td': {
            fontSize: "0.8rem",
            padding: "4px 16px 4px 16px"
        },
    },
    strike: {
        fontSize: "0.8rem",
        padding: "4px 16px 4px 16px",
        backgroundColor: "#e6f8d2"
    },
    mark: {
        borderTop: "2px solid red"
        // : red[500]
    },
    selected: {
        backgroundColor: yellow[500]
    },

    buttonGroup: {
    },
    buyButton: {
        padding: "2px 2px",
        lineHeight: 1,
        fontSize: "0.7rem",
        backgroundColor: green[500],
    },
    sellButton: {
        padding: "2px 2px",
        lineHeight: 1,
        fontSize: "0.7rem",
        backgroundColor: red[500],
    }
});

export function UnderlyingTable() {
    const classes = useStyles();

    const { loading, error, data } = useCompositeOptionsQuery();

    if (!data)
        return <div></div>

    const row = data?.options?.underlying;

    return <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Percent</TableCell>
                    <TableCell align="right">Last</TableCell>
                    <TableCell align="right">Buy</TableCell>
                    <TableCell align="right">Sell</TableCell>
                    <TableCell align="right">High</TableCell>
                    <TableCell align="right">Low</TableCell>
                    <TableCell align="right">Updated</TableCell>
                    <TableCell align="right">Volume</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell align="right">{row?.change}</TableCell>
                    <TableCell align="right">{row?.changePercent} %</TableCell>
                    <TableCell align="right">{row?.lastPrice ?? "-"}</TableCell>
                    <TableCell align="right">{row?.buyPrice ?? "-"}</TableCell>
                    <TableCell align="right">{row?.sellPrice ?? "-"}</TableCell>
                    <TableCell align="right">{row?.highestPrice ?? "-"}</TableCell>
                    <TableCell align="right">{row?.lowestPrice ?? "-"}</TableCell>
                    <TableCell align="right">{row?.updated}</TableCell>
                    <TableCell align="right">{row?.totalVolumeTraded}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
}

function BuySellButtons({ option }: { option: OptionInfo }) {
    const classes = useStyles();

    const buy = () =>
        addToShoppingCart(ShoppingAction.Buy, option);

    const sell = () =>
        addToShoppingCart(ShoppingAction.Sell, option);

    return <ButtonGroup className={classes.buttonGroup} size="small" variant="contained">
        <Button onClick={buy} className={classes.buyButton} color="primary">Buy</Button>
        <Button onClick={sell} className={classes.sellButton} color="secondary">Sell</Button>
    </ButtonGroup>
}

export function OptionMatrix() {
    const classes = useStyles();

    const { loading, error, data } = useCompositeOptionsQuery();
    const activeOptionVar = useReactiveVar(activeOption);

    if (!data)
        return <div></div>

    const rows = data?.options?.options ?? [];

    const price = data?.options?.underlying?.lastPrice ?? 0;

    function isActive(item: OptionInfo): boolean {
        return activeOptionVar === item;
    }

    function selectItem(item: OptionInfo) {
        if (item === activeOptionVar)
            activeOption(null);
        else
            activeOption(item);

        console.log(`Selected: ${activeOption()?.name}`)
    }

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
                {rows.map((row, i) => {
                    const call = row!.call!;
                    const put = row!.put!;
                    const strike = row!.strike!;

                    const prevStrike = (i == 0 ? row?.strike : rows[i - 1]?.strike) ?? 0;

                    const rowClass = clsx((price >= strike && price <= prevStrike) && classes.mark);
                    const cellClassCall = clsx(isActive(call) && classes.selected);
                    const cellClassPut = clsx(isActive(put) && classes.selected);

                    const callHandler = () => selectItem(call);
                    const putHandler = () => selectItem(put);

                    return <TableRow hover className={rowClass} key={call.name}>
                        <TableCell className={cellClassCall} onClick={callHandler}>
                            <BuySellButtons option={call}></BuySellButtons>
                        </TableCell>
                        <TableCell className={cellClassCall} align="right" onClick={callHandler}>{call.buyVolume}</TableCell>
                        <TableCell className={cellClassCall} align="right" onClick={callHandler}>{call.buy}</TableCell>
                        <TableCell className={cellClassCall} align="right" onClick={callHandler}>{call.sell}</TableCell>
                        <TableCell className={cellClassCall} align="right" onClick={callHandler}>{call.sellVolume}</TableCell>
                        <TableCell className={classes.strike} align="center">{strike}</TableCell>
                        <TableCell className={cellClassPut} align="right" onClick={putHandler} >{put.buyVolume}</TableCell>
                        <TableCell className={cellClassPut} align="right" onClick={putHandler}>{put.buy}</TableCell>
                        <TableCell className={cellClassPut} align="right" onClick={putHandler}>{put.sell}</TableCell>
                        <TableCell className={cellClassPut} align="right" onClick={putHandler}>{put.sellVolume}</TableCell>
                        <TableCell className={cellClassPut} >
                            <BuySellButtons option={put}></BuySellButtons>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}