import { TableCell } from '@material-ui/core';
import numeral from '../utils/numeral';
import React from 'react';
// import { useOptionDetailsQuery } from '../apollo/hooks';
import { Maybe, OptionDetails, OptionInfo } from '../apollo/types';

export function OptionGreeksCall({ option, greeks }: { option: OptionInfo, greeks : Maybe<OptionDetails> | undefined }) {
  // const { data } = useOptionDetailsQuery(option?.href);
  // const greeks = data?.optionDetails;

  return <React.Fragment>
    <TableCell align="right">{greeks?.updated}</TableCell>
    <TableCell align="right">{numeral(greeks?.IV).format("%0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.vega).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.theta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.delta).format("#0.00")}</TableCell>
    <TableCell align="right">{greeks?.volume}</TableCell>
    <TableCell align="right">{numeral(greeks?.spread).format("%0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.last).format("#0.00")}</TableCell>
  </React.Fragment>
}

export function OptionGreeksPut({ option, greeks }: { option: OptionInfo, greeks : Maybe<OptionDetails> | undefined }) {
  // const { data } = useOptionDetailsQuery(option?.href);
  // const greeks = data?.optionDetails;

  return <React.Fragment>
    <TableCell align="right">{numeral(greeks?.last).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.spread).format("%0.00")}</TableCell>
    <TableCell align="right">{greeks?.volume}</TableCell>
    <TableCell align="right">{numeral(greeks?.delta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.theta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.vega).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(greeks?.IV).format("%0.00")}</TableCell>
    <TableCell align="right">{greeks?.updated}</TableCell>
  </React.Fragment>
}
