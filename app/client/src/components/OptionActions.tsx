import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Theme, useTheme } from "@material-ui/core";
import { activeOption } from '../apollo/vars';
import { useReactiveVar } from "@apollo/client";
import { useGreeksQuery } from '../apollo/types';

export function OptionActions() {
  const option = useReactiveVar(activeOption);

  const { data } = useGreeksQuery({skip: option === null, variables: { href: option?.href ?? ""}})
  const greeks = data?.optionDetails;

  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Buy</TableCell>
        <TableCell>Sell</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>{option?.name}</TableCell>
        <TableCell>{option?.buy}</TableCell>
        <TableCell>{option?.sell}</TableCell>
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