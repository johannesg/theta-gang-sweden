import { TableCell } from '@material-ui/core';
import numeral from '../utils/numeral';
import React from 'react';
// import { useOptionDetailsQuery } from '../apollo/hooks';
import { InstrumentDetails, OptionDetails } from '../apollo/types';
// import { calcGreeksCall, calcGreeksPut } from "@theta-gang/shared/src/calc-greeks";
// import { getDaysFromNow } from '@theta-gang/shared/src/date';

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

  return <React.Fragment>
    <TableCell align="right">{option?.updated}</TableCell>
    <TableCell align="right">{numeral(option?.vega).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.theta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.delta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.IV).format("%0.00")}</TableCell>
    <TableCell align="right">{option?.volume}</TableCell>
    <TableCell align="right">{numeral(option?.spread).format("%0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.last).format("#0.00")}</TableCell>
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

  return <React.Fragment>
    <TableCell align="right">{numeral(option?.last).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.spread).format("%0.00")}</TableCell>
    <TableCell align="right">{option?.volume}</TableCell>
    <TableCell align="right">{numeral(option?.IV).format("%0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.delta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.theta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.vega).format("#0.00")}</TableCell>
    <TableCell align="right">{option?.updated}</TableCell>
  </React.Fragment>
}
