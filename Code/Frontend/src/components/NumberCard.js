import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { numberFormatter } from '../utils/formatter';
import request from '../utils/request';

/**
 * @param {{name: string, value: number}} props
 */
function SubDigitalDisplay({ name, value }) {
  const styleNum = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };
  const styleText = {
    whiteSpace: 'nowrap',
  };

  const styleFlex = {
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={styleFlex}>
      <div style={styleNum}>{numberFormatter(value)}</div>
      <div style={styleText}> #{name} </div>
    </div>
  );
}

export default function NumberCard({ data }) {
  const styleCard = {
    padding: '1rem',
    margin: '1rem 0 1rem',
    display: 'flex',
    alignItems: 'center',
  };

  const styleFlex = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'space-around',
  };

  return (
    <Card style={styleCard}>
      <Stack
        style={styleFlex}
        direction='row'
        divider={<Divider flexItem orientation='vertical' />}
      >
        <SubDigitalDisplay name='Commits' value={data.commit ?? 0} />
        <SubDigitalDisplay name='Issues' value={data.issue ?? 0} />
        <SubDigitalDisplay name='Pull Requests' value={data.pullRequest ?? 0} />
      </Stack>
    </Card>
  );
}
