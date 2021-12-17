import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const ProjectTable = () => {
  const cols = [
    { field: 'id', headerName: 'Event ID' },
    { field: 'type', headerName: 'Type' },
    { field: 'time', headerName: 'Time' },
    { field: 'author', headerName: 'Author' },
    { field: 'status', headerName: 'Status' },
  ];

  const rows = [
    { id: 1, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
    { id: 2, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
    { id: 3, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
    { id: 4, type: 'Bug', time: '10:00', author: 'John', status: 'Open' },
  ];

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
    <div style={{ height: '100%', width: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>{tableHead}</TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
