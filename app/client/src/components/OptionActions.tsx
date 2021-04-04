import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Theme, useTheme } from "@material-ui/core";

export function OptionActions() {
  return <Table>
      <TableHead>
        <TableCell>Name</TableCell>
        <TableCell>A</TableCell>
        <TableCell>C</TableCell>
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