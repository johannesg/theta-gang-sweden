import { TableCell } from '@material-ui/core';
import numeral from '../utils/numeral';
import React from 'react';
// import { useOptionDetailsQuery } from '../apollo/hooks';
import { Maybe, OptionDetails } from '../apollo/types';

export function OptionGreeksCall({ option }: { option: OptionDetails }) {
  // const { data } = useOptionDetailsQuery(option?.href);
  // const greeks = data?.optionDetails;

  return <React.Fragment>
    <TableCell align="right">{option?.updated}</TableCell>
    <TableCell align="right">{numeral(option?.IV).format("%0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.vega).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.theta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.delta).format("#0.00")}</TableCell>
    <TableCell align="right">{option?.volume}</TableCell>
    <TableCell align="right">{numeral(option?.spread).format("%0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.last).format("#0.00")}</TableCell>
  </React.Fragment>
}

export function OptionGreeksPut({ option }: { option: OptionDetails }) {
  // const { data } = useOptionDetailsQuery(option?.href);
  // const greeks = data?.optionDetails;

  return <React.Fragment>
    <TableCell align="right">{numeral(option?.last).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.spread).format("%0.00")}</TableCell>
    <TableCell align="right">{option?.volume}</TableCell>
    <TableCell align="right">{numeral(option?.delta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.gamma).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.theta).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.vega).format("#0.00")}</TableCell>
    <TableCell align="right">{numeral(option?.IV).format("%0.00")}</TableCell>
    <TableCell align="right">{option?.updated}</TableCell>
  </React.Fragment>
}
