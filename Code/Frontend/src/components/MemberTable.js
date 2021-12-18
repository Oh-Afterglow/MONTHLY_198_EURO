import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const MemberTable = ({ data }) => {
  const cols = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'time', headerName: 'Time', width: 120 },
    { field: 'event', headerName: 'Event', width: 200 },
  ];

  const rows = data;

  const tableHead = cols.map((col) => (
    <TableCell key={col.field}>{col.headerName}</TableCell>
  ));

  const tableRows = rows.map((row) => {
    const cells = cols.map((col) => (
      <TableCell key={col.field + row.id}>{row[col.field]}</TableCell>
    ));
    return <TableRow key={row.id}>{cells}</TableRow>;
  });

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>{tableHead}</TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
