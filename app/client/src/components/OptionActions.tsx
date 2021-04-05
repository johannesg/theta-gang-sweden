import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography, useTheme } from "@material-ui/core";
import { activeOption } from '../apollo/vars';
import { useReactiveVar } from "@apollo/client";
import { useDetailsQuery } from '../apollo/types';
import numeral from '../utils/numeral';

export function OptionsHeader() {
  const option = useReactiveVar(activeOption);
  const { data } = useDetailsQuery({ skip: option === null, variables: { href: option?.href ?? "" } })
  const greeks = data?.optionDetails;

  return <Typography variant="h6">{option?.type} @ {option?.strike} E {greeks?.expires}</Typography>
}

export function OptionActions() {
  const option = useReactiveVar(activeOption);

  const { data } = useDetailsQuery({ skip: option === null, variables: { href: option?.href ?? "" } })
  const greeks = data?.optionDetails;

  const buy = option?.buy ?? 0;
  const sell = option?.sell ?? 0;
  const mid = (buy + sell) / 2;
  const spread = (sell - buy) / 2 / mid;

  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Buy</TableCell>
        <TableCell>Mid</TableCell>
        <TableCell>Sell</TableCell>
        <TableCell>Spread</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>{numeral(buy).format("#0.00")}</TableCell>
        <TableCell>{numeral(mid).format("#0.00")}</TableCell>
        <TableCell>{numeral(sell).format("#0.00")}</TableCell>
        <TableCell>{numeral(spread).format("%")}</TableCell>
      </TableRow>
    </TableBody>
    <TableHead>
      <TableRow>
        <TableCell>Delta</TableCell>
        <TableCell>Gamma</TableCell>
        <TableCell>Theta</TableCell>
        <TableCell>Vega</TableCell>
        <TableCell>IV</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>{greeks?.delta}</TableCell>
        <TableCell>{greeks?.gamma}</TableCell>
        <TableCell>{greeks?.theta}</TableCell>
        <TableCell>{greeks?.vega}</TableCell>
        <TableCell>{greeks?.IV}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
}