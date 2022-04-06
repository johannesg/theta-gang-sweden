import { TableCell } from '@material-ui/core';
import numeral from '../utils/numeral';
import React from 'react';
// import { useOptionDetailsQuery } from '../apollo/hooks';
import { InstrumentDetails, OptionDetails } from '../apollo/types';
// import { calcGreeksCall, calcGreeksPut } from "@theta-gang/shared/src/calc-greeks";
// import { getDaysFromNow } from '@theta-gang/shared/src/date';
import { activeOption } from '../apollo/vars';
import { useReactiveVar } from '@apollo/client';
import { useStyles } from './styles'

export type OptionGreeksProps = {
  underlying: InstrumentDetails
  option: OptionDetails
}

export function OptionGreeksCall({ underlying, option }: OptionGreeksProps) {
  // const underlyingPrice = underlying.buyPrice && underlying.sellPrice
  //   ? ((underlying.buyPrice! + underlying.sellPrice!) / 2)
  //   : underlying.lastPrice ?? 0;

  // const price = (option.bid! + option.ask!) / 2;
  // // const price = option.last ?? 0;
  // const strike = option.strike!;
  // const dte = getDaysFromNow(option.expires!);
  // const interest = option.interest ?? -.003;

  // const greeks = calcGreeksCall({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice });
  var classes = useStyles();

  const activeOptionVar = useReactiveVar(activeOption);

  function onSelect() {
    if (option === activeOptionVar)
      activeOption(null);
    else
      activeOption(option);

    console.log(`Selected: ${activeOption()?.name}`)
  }

  const cellClass = activeOptionVar === option ? classes.selected : "";

  return <React.Fragment>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.vega).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.theta).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.delta).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.IV).format("%0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{option?.volume}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.spread).format("%0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.last).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option.bid).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option.ask).format("#0.00")}</TableCell>
  </React.Fragment>
}

export function OptionGreeksPut({ underlying, option }: OptionGreeksProps) {
  // const underlyingPrice = underlying.buyPrice && underlying.sellPrice
  //   ? ((underlying.buyPrice! + underlying.sellPrice!) / 2)
  //   : underlying.lastPrice ?? 0;

  // const price = (option.bid! + option.ask!) / 2;
  // // const price = option.last ?? 0;
  // const strike = option.strike!;
  // const dte = getDaysFromNow(option.expires!);
  // const interest = option.interest ?? -.003;

  // const greeks = calcGreeksPut({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice });
  var classes = useStyles();

  const activeOptionVar = useReactiveVar(activeOption);

  function onSelect() {
    if (option === activeOptionVar)
      activeOption(null);
    else
      activeOption(option);

    console.log(`Selected: ${activeOption()?.name}`)
  }

  const cellClass = activeOptionVar === option ? classes.selected : "";

  return <React.Fragment>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option.bid).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option.ask).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.last).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.spread).format("%0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{option?.volume}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.IV).format("%0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.delta).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.theta).format("#0.00")}</TableCell>
    <TableCell align="right" onClick={onSelect} className={cellClass}>{numeral(option?.vega).format("#0.00")}</TableCell>
  </React.Fragment>
}
