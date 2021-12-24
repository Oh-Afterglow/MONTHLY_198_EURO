import React from 'react';
import { PieChart, Pie} from 'recharts';


const CustomPie = ({ data}) => {

    return (
        <PieChart width={400} height={400}>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8"  label/>
        </PieChart>
    );
}

export default CustomPie;
