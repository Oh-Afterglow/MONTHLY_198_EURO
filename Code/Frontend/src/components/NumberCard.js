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

/**
 * @param {{projectName: string}} props
 */
export default function NumberCard({ projectName }) {
  const [data, setData] = React.useState({
    commit: 0,
    issue: 0,
    pullRequest: 0,
  });

  React.useEffect(
    () =>
      (async () => {
        try {
          /**
           * @type {{commit: number, issue: number, pullRequest: number}}
           */
          const res = await request.get('/project/numbers', { projectName });
          setData(res);
        } catch (e) {
          // TODO: handle error
          console.error(e);
        }
      })(),
    []
  );

  const styleCard = {
    padding: '1rem',
    margin: '1rem',
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
        <SubDigitalDisplay name='Commits' value={data.commit} />
        <SubDigitalDisplay name='Issues' value={data.issue} />
        <SubDigitalDisplay name='Pull Requests' value={data.pullRequest} />
      </Stack>
    </Card>
  );
}
