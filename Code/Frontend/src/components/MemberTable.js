import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

const MemberTable = ({ data }) => {
  const cols = [
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
    )
    );
    return <TableRow key={row.id}>{cells}</TableRow>;
  });

  return (
    <div>
      <Toolbar style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
        <h3 >Recent Activities</h3>
      </Toolbar>
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
