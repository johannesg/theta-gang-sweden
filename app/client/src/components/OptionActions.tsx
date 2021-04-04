import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Theme, useTheme } from "@material-ui/core";

export function OptionActions() {
  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>A</TableCell>
        <TableCell>C</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>A</TableCell>
        <TableCell>C</TableCell>
      </TableRow>
    </TableBody>
  </Table>
}