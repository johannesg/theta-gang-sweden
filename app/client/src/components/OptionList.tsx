import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Grid, Collapse, CardContent, CardHeader, Card, Box, Container } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import { NetworkStatus, useReactiveVar } from '@apollo/client';
import clsx from 'clsx';

import { useCompositeOptionsQuery } from '../apollo/hooks';
import { activeOption, ShoppingAction, addToShoppingCart, isInShoppingCart, shoppingCart } from '../apollo/vars';
import { InstrumentDetails, OptionDetails, OptionMatrixItem, OptionsWithExpiry } from '../apollo/types';
import { OptionGreeksCall, OptionGreeksPut } from './OptionGreeks';
import numeral from '../utils/numeral';
import { getDaysFromNow } from '@theta-gang/shared/src/date';
import { useStyles } from './styles'

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
                        <TableCell align="right">{numeral(row?.changePercent).format("%0.00")}</TableCell>
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

function MatrixTableRow({ row, prevRow, underlying }: { row: OptionMatrixItem, prevRow: OptionMatrixItem | undefined, underlying: InstrumentDetails }) {
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

    const price = underlying?.lastPrice ?? 0;
    const call = row!.call!;
    const put = row!.put!;
    const strike = row!.strike!;

    const prevStrike = prevRow?.strike ?? 0;

    const rowClass = clsx((price <= strike && price >= prevStrike) && classes.mark);

    function selectItem(item: OptionDetails) {
        if (item === activeOptionVar)
            activeOption(null);
        else
            activeOption(item);

        console.log(`Selected: ${activeOption()?.name}`)
    }

    return <TableRow hover className={rowClass} key={call.name}>
        {/* <TableCell className={cellClassCall} onClick={callHandler}>
                            <BuySellButtons option={call}></BuySellButtons>
                        </TableCell> */}
        <OptionGreeksCall underlying={underlying} option={call}></OptionGreeksCall>
        <TableCell className={classes.strike} align="center">{strike}</TableCell>
        <OptionGreeksPut underlying={underlying} option={put}></OptionGreeksPut>
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
        <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
            <TableHead >
                <TableRow className={classes.head} >
                    {/* <TableCell align="right">Updated</TableCell> */}
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
                    {/* <TableCell align="right">Updated</TableCell> */}
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    matrix.map(m => {

                        const rows = m.options;
                        return <React.Fragment key={m.expires}>
                            <TableRow>
                                <TableCell colSpan={9} align="center"><strong>CALLS</strong></TableCell>
                                <TableCell colSpan={5} align="center"><strong>EXP: {m.expires}  DTE: {getDaysFromNow(m.expires)}</strong></TableCell>
                                <TableCell colSpan={9} align="center"><strong>PUTS</strong></TableCell>
                            </TableRow>
                            {
                                rows.map((row: OptionMatrixItem, i) => {
                                    const prevRow = i == 0 ? undefined : rows[i - 1];
                                    return <MatrixTableRow key={row.call!.name! + row.put!.name!} row={row} prevRow={prevRow} underlying={underlying} />
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
    const classes = useStyles();
    const { loading, error, data, networkStatus } = useCompositeOptionsQuery();
    const progress = loading || networkStatus === NetworkStatus.refetch;

    const underlying = data?.matrix?.underlying as InstrumentDetails;
    const matrix = data?.matrix?.matrix as OptionsWithExpiry[] ?? [];

    const activeOptionVar = useReactiveVar(activeOption);

    return <React.Fragment>
        {/* <Box width={"100%"}>
<Container> */}
        <Grid item xs={12} className={classes.underlyingPanel}>
            {progress ? <LinearProgress></LinearProgress> : <div></div>}
            <UnderlyingTable underlying={underlying} ></UnderlyingTable>
        </Grid>
        <Grid item xs={12} className={classes.matrixPanel} >
            <OptionMatrix matrix={matrix} underlying={underlying}></OptionMatrix>
        </Grid>
        {activeOptionVar ? <Grid item xs={7} className={classes.detailsPanel}><OptionDetailsPanel underlying={underlying} option={activeOptionVar} /></Grid>
            : null
        }
        {/* </Container>
        </Box> */}
    </React.Fragment>
}

function NumberLabel({ value, format }: { value?: number, format?: string }) {
    return <span style={{ textAlign: "right", flexDirection: 'row-reverse' }}><strong>{value ? numeral(value).format(format ?? "#0.00") : ""}</strong></span>
}

function OptionDetailsPanel({ underlying, option }: { underlying: InstrumentDetails, option: OptionDetails }) {
    if (!option || !underlying)
        return <div></div>
    const title = `${option.type} @ ${option.strike} : ${option.name}`

    var intrinsicValue = option.type == "CALL"
        ? (underlying.lastPrice ?? 0) - (option.strike ?? 0)
        : (option.strike ?? 0) - (underlying.lastPrice ?? 0);

    if (intrinsicValue < 0)
        intrinsicValue = 0;

    const mid = ((option.ask ?? 0) + (option.bid ?? 0)) / 2;

    const extrinsicValueAsk = (option.ask ?? 0) - intrinsicValue;
    const extrinsicValueBid = (option.bid ?? 0) - intrinsicValue;
    const extrinsicValueMid = mid - intrinsicValue;

    return <Card>
        <CardHeader title={title}></CardHeader>
        <CardContent>
            <Grid container>
                <Grid container xs={4}>
                    <Grid item xs={6}>IV:</Grid>
                    <Grid item xs={6}><NumberLabel value={option.IV!} format="%0.00" /></Grid>
                    <Grid item xs={6}>Delta:</Grid>
                    <Grid item xs={6}><NumberLabel value={option.delta!} /></Grid>
                    <Grid item xs={6}>Gamma:</Grid>
                    <Grid item xs={6}><NumberLabel value={option.gamma!} /></Grid>
                    <Grid item xs={6}>Theta:</Grid>
                    <Grid item xs={6}><NumberLabel value={option.theta!} /></Grid>
                    <Grid item xs={6}>Vega:</Grid>
                    <Grid item xs={6}><NumberLabel value={option.vega!} /></Grid>
                </Grid>
                <Grid container xs={4}>
                    <Grid item xs={6}>Bid:</Grid>
                    <Grid item xs={6}><strong>{numeral(option.bid).format("#0.00")}</strong></Grid>
                    <Grid item xs={6}>Ask:</Grid>
                    <Grid item xs={6}><strong>{numeral(option.ask).format("#0.00")}</strong></Grid>
                    <Grid item xs={6}>Spread:</Grid>
                    <Grid item xs={6}><strong>{numeral(option.spread).format("%0.00")}</strong></Grid>
                    <Grid item xs={6}>Volume:</Grid>
                    <Grid item xs={6}><strong>{numeral(option.volume).format("#0")}</strong></Grid>
                </Grid>
                <Grid container xs={4}>
                    <Grid item xs={6}>Intrinsic Value:</Grid>
                    <Grid item xs={6}><strong>{numeral(intrinsicValue).format("#0.00")}</strong></Grid>
                    <Grid item xs={6}>Extrinsic Value (Bid):</Grid>
                    <Grid item xs={6}><strong>{numeral(extrinsicValueBid).format("#0.00")}</strong></Grid>
                    <Grid item xs={6}>Extrinsic Value (Ask):</Grid>
                    <Grid item xs={6}><strong>{numeral(extrinsicValueAsk).format("#0.00")}</strong></Grid>
                    <Grid item xs={6}>Extrinsic Value (Mid):</Grid>
                    <Grid item xs={6}><strong>{numeral(extrinsicValueMid).format("#0.00")}</strong></Grid>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}