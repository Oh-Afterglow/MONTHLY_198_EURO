import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={cols}
        pageSize={5}
        owsPerPageOptions={[5]}
      />
    </div>
  );
};

export default ProjectTable;
