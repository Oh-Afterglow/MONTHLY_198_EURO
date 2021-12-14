import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Charts } from '@jiaminghi/data-view-react';

export default function BarChart({ title, mode,xname,xvalue,yname,style }) {
  let option1 = {
    title: {
        text: title
      },
      xAxis: {
        name: xname,
        data: xvalue[0].value,
      },
      yAxis: {
        name: yname,
        data: 'value'
      },
      series: [
        {
          data: xvalue[1].value,
          type: 'bar',
          stack: 'a',
          label: {
            show: true,
            position: 'center',
            offset: [0, 0],
            style: {
              fill: '#fff'
            }
          }
        }
        
      ]
  };

  let option2 = {
    title: {
        text: title
      },
      xAxis: {
        name: xname,
        data: xvalue[0].value
      },
      yAxis: {
        name: yname,
        data: 'value'
      },
      series: [
        {
            data: xvalue[1].value,
            type: 'bar',
            stack: 'a',
            label: {
            show: true,
            position: 'center',
            offset: [0, 0],
            style: {
                fill: '#fff'
            }
            }
        },
        {
            data: xvalue[2].value,
            type: 'bar',
            stack: 'b',
            label: {
                show: true,
                position: 'center',
                offset: [0, 0],
                style: {
                fill: '#fff'
                }
            }
        },
        {
            data: xvalue[3].value,
            type: 'bar',
            stack: 'c',
            label: {
                show: true,
                position: 'center',
                offset: [0, 0],
                style: {
                fill: '#fff'
                }
            }
        },
        {
            data: xvalue[4].value,
            type: 'bar',
            stack: 'd',
            label: {
                show: true,
                position: 'center',
                offset: [0, 0],
                style: {
                fill: '#fff'
                }
            }
        },
        {
            data: xvalue[5].value,
            type: 'bar',
            stack: 'e',
            label: {
                show: true,
                position: 'center',
                offset: [0, 0],
                style: {
                fill: '#fff'
                }
            }
        },
        {
            data: xvalue[6].value,
            type: 'bar',
            stack: 'f',
            label: {
                show: true,
                position: 'center',
                offset: [0, 0],
                style: {
                fill: '#fff'
                }
            }
        },
        {
            data: xvalue[7].value,
            type: 'bar',
            stack: 'g',
            label: {
                show: true,
                position: 'center',
                offset: [0, 0],
                style: {
                fill: '#fff'
                }
            }
        }
        
      ]
  };


  const option3 = {
    title: {
        text: title
      },
      xAxis: {
        name: xname,
        data: xvalue[0].value,
        },
      yAxis: {
        name: yname,
        data: 'value'
      },
      series: [
        {
            data: xvalue[1].value,
            type: 'bar',
            stack: 'a',
        },
        {
            data: xvalue[2].value,
            type: 'bar',
            stack: 'b',
        },
        {
            data: xvalue[3].value,
            type: 'bar',
            stack: 'c',
        },
        {
            data: xvalue[4].value,
            type: 'bar',
            stack: 'd',
        }
        
      ]
  };

  const mnp = {
    margin: '1rem',
    padding: '1rem',
  };

  return (
    <Grid item>
      <Card style={{ ...style, ...mnp }}>
          {mode=="0"?<Charts option={option1} height='100%' />:<div></div>}
          {mode=="1"?<Charts option={option2} height='100%' />:<div></div>}
          {mode=="2"?<Charts option={option3} height='100%' />:<div></div>}
      </Card>
    </Grid>
  );
}
