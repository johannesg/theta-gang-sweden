import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Grid } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import { blue, green, red, yellow } from '@material-ui/core/colors';
import { NetworkStatus, useReactiveVar } from '@apollo/client';
import clsx from 'clsx';

import { useCompositeOptionsQuery } from '../apollo/hooks';
import { activeOption, ShoppingAction, addToShoppingCart, isInShoppingCart, shoppingCart } from '../apollo/vars';
import { InstrumentDetails, OptionDetails, OptionMatrixItem, OptionsWithExpiry } from '../apollo/types';
import { OptionGreeksCall, OptionGreeksPut } from './OptionGreeks';
import numeral from '../utils/numeral';
import { getDaysFromNow } from "../utils/date";

const useStyles = makeStyles({
    table: {
        minWidth: 650,

        '& th,td': {
            fontSize: "0.7rem",
            padding: "2px 10px 2px 10px"
        },
    },
    strike: {
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

export function UnderlyingTable({ underlying }: { underlying: InstrumentDetails | undefined }) {
    const classes = useStyles();

    if (!underlying)
        return <div></div>

    const row = underlying;

    return <div>

        <TableContainer component={Paper}>
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
                        <TableCell align="right">{numeral(row?.change).format("#0.00")}</TableCell>
                        <TableCell align="right">{numeral(row?.changePercent).format("%0.00")} %</TableCell>
                        <TableCell align="right">{numeral(row?.lastPrice).format("#0.00") ?? "-"}</TableCell>
                        <TableCell align="right">{numeral(row?.buyPrice).format("#0.00") ?? "-"}</TableCell>
                        <TableCell align="right">{numeral(row?.sellPrice).format("#0.00") ?? "-"}</TableCell>
                        <TableCell align="right">{numeral(row?.highestPrice).format("#0.00") ?? "-"}</TableCell>
                        <TableCell align="right">{numeral(row?.lowestPrice).format("#0.00") ?? "-"}</TableCell>
                        <TableCell align="right">{row?.updated}</TableCell>
                        <TableCell align="right">{numeral(row?.totalVolumeTraded).format()}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
}

function BuySellButtons({ option }: { option: OptionDetails }) {
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

function MatrixTableRow({ row, prevRow, price }: { row: OptionMatrixItem, prevRow: OptionMatrixItem | undefined, price: number }) {
    const classes = useStyles();
    const activeOptionVar = useReactiveVar(activeOption);
    const shoppingCartVar = useReactiveVar(shoppingCart);

    function isActive(item: OptionDetails): boolean {
        return activeOptionVar === item;
    }

    function getShoppingCartStatusClass(info: OptionDetails): string | undefined {
        switch (isInShoppingCart(shoppingCartVar, info)) {
            case ShoppingAction.Buy: return classes.markAsBuy;
            case ShoppingAction.Sell: return classes.markAsSell;
            default: return undefined;
        }
    }

    const call = row!.call!;
    const put = row!.put!;
    const strike = row!.strike!;

    const prevStrike = prevRow?.strike ?? 0;

    const rowClass = clsx((price <= strike && price >= prevStrike) && classes.mark);

    const cellClassCall = isActive(call) ? classes.selected : getShoppingCartStatusClass(call);
    const cellClassPut = isActive(put) ? classes.selected : getShoppingCartStatusClass(put);

    // const callHandler = () => selectItem(call);
    // const putHandler = () => selectItem(put);
    const callHandler = () => { };
    const putHandler = () => { };

    return <TableRow hover className={rowClass} key={call.name}>
        {/* <TableCell className={cellClassCall} onClick={callHandler}>
                            <BuySellButtons option={call}></BuySellButtons>
                        </TableCell> */}
        <OptionGreeksCall option={call}></OptionGreeksCall>
        <TableCell className={clsx(cellClassCall, classes.bid)} align="right" onClick={callHandler}>{numeral(call.bid).format("#0.00")}</TableCell>
        <TableCell className={clsx(cellClassCall, classes.ask)} align="right" onClick={callHandler}>{numeral(call.ask).format("#0.00")}</TableCell>
        <TableCell className={classes.strike} align="center">{strike}</TableCell>
        <TableCell className={clsx(cellClassPut, classes.bid)} align="right" onClick={putHandler}>{numeral(put.bid).format("#0.00")}</TableCell>
        <TableCell className={clsx(cellClassPut, classes.ask)} align="right" onClick={putHandler}>{numeral(put.ask).format("#0.00")}</TableCell>
        <OptionGreeksPut option={put}></OptionGreeksPut>
        {/* <TableCell className={cellClassPut} >
                            <BuySellButtons option={put}></BuySellButtons>
                        </TableCell> */}
    </TableRow>

}


export function OptionMatrix({ matrix, underlying }: { matrix: OptionsWithExpiry[], underlying: InstrumentDetails }) {
    if (!matrix || !matrix.length)
        return <div></div>

    const classes = useStyles();

    const activeOptionVar = useReactiveVar(activeOption);
    const shoppingCartVar = useReactiveVar(shoppingCart);


    const price = underlying?.lastPrice ?? 0;
    console.log(`Price: ${price}`);

    function selectItem(item: OptionDetails) {
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
                    <TableCell align="right">Updated</TableCell>
                    <TableCell align="right">Vega</TableCell>
                    <TableCell align="right">Theta</TableCell>
                    <TableCell align="right">Gamma</TableCell>
                    <TableCell align="right">Delta</TableCell>
                    <TableCell align="right">IV</TableCell>
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
                    <TableCell align="right">IV</TableCell>
                    <TableCell align="right">Delta</TableCell>
                    <TableCell align="right">Gamma</TableCell>
                    <TableCell align="right">Theta</TableCell>
                    <TableCell align="right">Vega</TableCell>
                    <TableCell align="right">Updated</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    matrix.map(m => {

                        const rows = m.options;
                        return <React.Fragment>
                            <TableRow>
                                <TableCell colSpan={9} align="center"><strong>CALLS</strong></TableCell>
                                <TableCell colSpan={5} align="center"><strong>EXP: { m.expires }  DTE: {getDaysFromNow(m.expires)}</strong></TableCell>
                                <TableCell colSpan={9} align="center"><strong>PUTS</strong></TableCell>
                            </TableRow>
                            {
                                rows.map((row: OptionMatrixItem, i) => {
                                    const prevRow = i == 0 ? undefined : rows[i - 1];
                                    return <MatrixTableRow row={row} prevRow={prevRow} price={price} />
                                })
                            }
                        </React.Fragment>
                    })
                }
            </TableBody>
        </Table>
    </TableContainer>
}

export function OptionsContainer() {
    const { loading, error, data, networkStatus } = useCompositeOptionsQuery();
    const progress = loading || networkStatus === NetworkStatus.refetch;

    const underlying = data?.matrix?.underlying as InstrumentDetails;
    const matrix = data?.matrix?.matrix as OptionsWithExpiry[] ?? [];

    return <React.Fragment>
        <Grid item xs={12}>
            {progress ? <LinearProgress></LinearProgress> : <div></div>}
            <UnderlyingTable underlying={underlying} ></UnderlyingTable>
        </Grid>
        <Grid item xs={12}>
            <OptionMatrix matrix={matrix} underlying={underlying}></OptionMatrix>
        </Grid>
    </React.Fragment>
}
