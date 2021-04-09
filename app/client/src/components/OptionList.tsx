import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import { blue, green, red, yellow } from '@material-ui/core/colors';
import { useReactiveVar } from '@apollo/client';
import clsx from 'clsx';

import { useCompositeOptionsQuery } from '../apollo/hooks';
import { activeOption, ShoppingAction, addToShoppingCart, isInShoppingCart, shoppingCart } from '../apollo/vars';
import { OptionInfo } from '../apollo/types';
import { OptionGreeksCall, OptionGreeksPut } from './OptionGreeks';
import numeral from 'numeral';

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
        // boxSizing: "border-box",
        // border: "2px solid yellow",
        backgroundColor: yellow[500]
    },
    markAsBuy: {
        backgroundColor: green[500]
    },
    markAsSell: {
        backgroundColor: red[500]
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
    },
    bid: {
        color: blue[500],
    },
    ask: {
        color: red[500],
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
    const shoppingCartVar = useReactiveVar(shoppingCart);

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

    function getShoppingCartStatusClass(info: OptionInfo) : string | undefined {
        switch (isInShoppingCart(shoppingCartVar, info)) {
            case ShoppingAction.Buy: return classes.markAsBuy;
            case ShoppingAction.Sell: return classes.markAsSell;
            default: return undefined;
        }
    }

    return <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    {/* <TableCell>Call</TableCell> */}
                    <TableCell align="right">Updated</TableCell>
                    <TableCell align="right">IV</TableCell>
                    <TableCell align="right">Vega</TableCell>
                    <TableCell align="right">Theta</TableCell>
                    <TableCell align="right">Gamma</TableCell>
                    <TableCell align="right">Delta</TableCell>
                    <TableCell align="right">Vol</TableCell>
                    <TableCell align="right">Spread</TableCell>
                    <TableCell align="right">Last</TableCell>
                    <TableCell align="right">Bid</TableCell>
                    <TableCell align="right">Ask</TableCell>
                    <TableCell align="center">Strike</TableCell>
                    <TableCell align="right">Bid</TableCell>
                    <TableCell align="right">Ask</TableCell>
                    <TableCell align="right">Last</TableCell>
                    <TableCell align="right">Spread</TableCell>
                    <TableCell align="right">Vol</TableCell>
                    <TableCell align="right">Delta</TableCell>
                    <TableCell align="right">Gamma</TableCell>
                    <TableCell align="right">Theta</TableCell>
                    <TableCell align="right">Vega</TableCell>
                    <TableCell align="right">IV</TableCell>
                    <TableCell align="right">Updated</TableCell>
                    {/* <TableCell>Put</TableCell> */}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, i) => {
                    const call = row!.call!;
                    const put = row!.put!;
                    const strike = row!.strike!;

                    const prevStrike = (i == 0 ? row?.strike : rows[i - 1]?.strike) ?? 0;

                    const rowClass = clsx((price >= strike && price <= prevStrike) && classes.mark);
                    const cellClassCall = isActive(call) ? classes.selected : getShoppingCartStatusClass(call);
                    const cellClassPut = isActive(put) ? classes.selected : getShoppingCartStatusClass(put);

                    // const callHandler = () => selectItem(call);
                    // const putHandler = () => selectItem(put);
                    const callHandler = () => {};
                    const putHandler = () => {};

                    return <TableRow hover className={rowClass} key={call.name}>
                        {/* <TableCell className={cellClassCall} onClick={callHandler}>
                            <BuySellButtons option={call}></BuySellButtons>
                        </TableCell> */}
                        <OptionGreeksCall option={call}></OptionGreeksCall>
                        <TableCell className={clsx(cellClassCall, classes.bid)} align="right" onClick={callHandler}>{numeral(call.buy).format("#0.00")}</TableCell>
                        <TableCell className={clsx(cellClassCall, classes.ask)} align="right" onClick={callHandler}>{numeral(call.sell).format("#0.00")}</TableCell>
                        <TableCell className={classes.strike} align="center">{strike}</TableCell>
                        <TableCell className={clsx(cellClassPut, classes.bid)} align="right" onClick={putHandler}>{numeral(put.buy).format("#0.00")}</TableCell>
                        <TableCell className={clsx(cellClassPut, classes.ask)} align="right" onClick={putHandler}>{numeral(put.sell).format("#0.00")}</TableCell>
                        <OptionGreeksPut option={put}></OptionGreeksPut>
                        {/* <TableCell className={cellClassPut} >
                            <BuySellButtons option={put}></BuySellButtons>
                        </TableCell> */}
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}